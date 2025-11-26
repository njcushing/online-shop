import { useContext, useCallback } from "react";
import { RangeSlider } from "@mantine/core";
import { CategoryContext } from "@/pages/Category";
import { skeletonCategory } from "@/utils/products/categories";
import { useQueryContexts } from "@/hooks/useQueryContexts";
import { ResponseBody as GetCategoryBySlugResponseDto } from "@/api/categories/[slug]/GET";
import { ColorFilter } from "./components/ColorFilter";
import { StringFilter } from "./components/StringFilter";
import { SelectFilter } from "./components/SelectFilter";
import styles from "./index.module.css";

export function CategoryProductsSortAndFilters() {
    const { categoryData } = useContext(CategoryContext);

    let category = skeletonCategory as GetCategoryBySlugResponseDto;

    const { data, awaitingAny } = useQueryContexts({
        contexts: [{ name: "category", context: categoryData }],
    });

    if (!awaitingAny) {
        if (data.category) category = data.category;
    }

    const { filters } = category;

    const filterElements = useCallback(
        (filter: GetCategoryBySlugResponseDto["filters"][number]) => {
            const { type, values } = filter;

            switch (type) {
                case "string":
                    return <StringFilter data={filter} awaiting={awaitingAny} />;
                case "numeric": {
                    const min = Math.min(...values.map((v) => Number(v.value)));
                    const max = Math.max(...values.map((v) => Number(v.value)));
                    const step = (Math.floor(Math.log10(max - min)) - 2) ** 10;

                    return <RangeSlider color="black" size="lg" min={min} max={max} step={step} />;
                }
                case "boolean":
                    return null;
                case "color":
                    return <ColorFilter data={filter} awaiting={awaitingAny} />;
                case "date":
                    return null;
                case "select":
                    return <SelectFilter data={filter} awaiting={awaitingAny} />;
                default:
                    return null;
            }
        },
        [awaitingAny],
    );

    return (
        <div className={styles["category-products-sort-and-filters"]}>
            {filters.map((filter) => {
                const { name: filterName } = filter;

                return (
                    <div className={styles["filter"]} key={filterName}>
                        <p className={styles["filter-name"]}>{filterName}</p>
                        {filterElements(filter)}
                    </div>
                );
            })}
        </div>
    );
}
