import { useContext } from "react";
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

    return (
        <div className={styles["category-products-sort-and-filters"]}>
            {filters.map((filter) => {
                const { name: filterName, values } = filter;

                return (
                    <div className={styles["filter"]} key={filterName}>
                        <p className={styles["filter-name"]}>{filterName}</p>
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
                    </div>
                );
            })}
        </div>
    );
}
