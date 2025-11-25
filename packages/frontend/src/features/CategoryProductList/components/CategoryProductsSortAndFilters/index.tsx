import { useContext, useCallback } from "react";
import { Checkbox, RangeSlider, Radio } from "@mantine/core";
import { CategoryContext } from "@/pages/Category";
import { skeletonCategory } from "@/utils/products/categories";
import { useQueryContexts } from "@/hooks/useQueryContexts";
import { ResponseBody as GetCategoryBySlugResponseDto } from "@/api/categories/[slug]/GET";
import styles from "./index.module.css";

export function CategoryProductsSortAndFilters() {
    const { categoryData } = useContext(CategoryContext);

    let category = skeletonCategory as GetCategoryBySlugResponseDto;

    const { data, awaitingAny: contextAwaitingAny } = useQueryContexts({
        contexts: [{ name: "category", context: categoryData }],
    });

    if (!contextAwaitingAny) {
        if (data.category) category = data.category;
    }

    const { filters } = category;

    const filterElements = useCallback(
        (
            type: GetCategoryBySlugResponseDto["filters"][number]["type"],
            values: GetCategoryBySlugResponseDto["filters"][number]["values"],
        ) => {
            switch (type) {
                case "string":
                    return (
                        <ul className={styles["filter-strings"]}>
                            {values.map((value) => {
                                const { code, name: valueName, count } = value;

                                return (
                                    <div className={styles["filter-value-string"]} key={code}>
                                        <Checkbox
                                            label={
                                                <>
                                                    <p className={styles["filter-value-name"]}>
                                                        {valueName}
                                                    </p>
                                                    <p className={styles["filter-value-count"]}>
                                                        ({count})
                                                    </p>
                                                </>
                                            }
                                            onChange={() => {}}
                                            classNames={{
                                                root: styles["checkbox-root"],
                                                body: styles["checkbox-body"],
                                                input: styles["checkbox-input"],
                                                label: styles["checkbox-label"],
                                            }}
                                        />
                                    </div>
                                );
                            })}
                        </ul>
                    );
                case "numeric": {
                    const min = Math.min(...values.map((v) => Number(v.value)));
                    const max = Math.max(...values.map((v) => Number(v.value)));
                    const step = (Math.floor(Math.log10(max - min)) - 2) ** 10;

                    return <RangeSlider color="black" size="lg" min={min} max={max} step={step} />;
                }
                case "boolean":
                    return null;
                case "color":
                    return (
                        <ul className={styles["filter-colors"]}>
                            {values.map((value) => {
                                const { code, name: valueName, value: valueString, count } = value;

                                return (
                                    <button
                                        type="button"
                                        className={styles["filter-value-color"]}
                                        key={code}
                                    >
                                        <div
                                            className={styles["filter-value-color-box"]}
                                            data-valid-color={!!valueString}
                                            style={{ backgroundColor: valueString }}
                                        ></div>
                                        <p className={styles["filter-value-name"]}>{valueName}</p>
                                        <p className={styles["filter-value-count"]}>({count})</p>
                                    </button>
                                );
                            })}
                        </ul>
                    );
                case "date":
                    return null;
                case "select":
                    return (
                        <Radio.Group>
                            <ul className={styles["filter-radio"]}>
                                {values.map((value) => {
                                    const { code, name: valueName, count } = value;

                                    return (
                                        <Radio
                                            value={code}
                                            label={
                                                <>
                                                    <p className={styles["filter-value-name"]}>
                                                        {valueName}
                                                    </p>
                                                    <p className={styles["filter-value-count"]}>
                                                        ({count})
                                                    </p>
                                                </>
                                            }
                                            classNames={{
                                                root: styles["radio-root"],
                                                body: styles["radio-body"],
                                                radio: styles["radio"],
                                                label: styles["radio-label"],
                                            }}
                                            key={code}
                                        />
                                    );
                                })}
                            </ul>
                        </Radio.Group>
                    );
                default:
                    return null;
            }
        },
        [],
    );

    return (
        <div className={styles["category-products-sort-and-filters"]}>
            {filters.map((filter) => {
                const { name: filterName, type, values } = filter;

                return (
                    <div className={styles["filter"]} key={filterName}>
                        <p className={styles["filter-name"]}>{filterName}</p>
                        {filterElements(type, values)}
                    </div>
                );
            })}
        </div>
    );
}
