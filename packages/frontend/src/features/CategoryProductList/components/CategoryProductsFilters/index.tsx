import { useContext, useCallback } from "react";
import { CategoryContext } from "@/pages/Category";
import { Skeleton } from "@mantine/core";
import { skeletonCategory } from "@/utils/products/categories";
import { useQueryContexts } from "@/hooks/useQueryContexts";
import { ResponseBody as GetCategoryBySlugResponseDto } from "@/api/categories/[slug]/GET";
import { customStatusCodes } from "@/api/types";
import { StringFilter } from "./components/StringFilter";
import { NumericFilter } from "./components/NumericFilter";
import { ColorFilter } from "./components/ColorFilter";
import { SelectFilter } from "./components/SelectFilter";
import styles from "./index.module.css";

export function CategoryProductsFilters() {
    const { categoryData } = useContext(CategoryContext);

    let category = skeletonCategory as GetCategoryBySlugResponseDto;

    const { data, awaitingAny: contextAwaitingAny } = useQueryContexts({
        contexts: [{ name: "category", context: categoryData }],
    });

    if (!contextAwaitingAny) {
        if (data.category) category = data.category;
    }

    const awaitingAny =
        contextAwaitingAny || categoryData.response.status === customStatusCodes.unattempted;

    const { filters } = category;

    const filterElements = useCallback(
        (filter: GetCategoryBySlugResponseDto["filters"][number]) => {
            const { type } = filter;

            switch (type) {
                case "string":
                    return <StringFilter data={filter} awaiting={awaitingAny} />;
                case "numeric":
                    return <NumericFilter data={filter} awaiting={awaitingAny} />;
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
                        <Skeleton visible={awaitingAny}>
                            <p
                                className={styles["filter-name"]}
                                style={{ visibility: awaitingAny ? "hidden" : "initial" }}
                            >
                                {filterName}
                            </p>
                        </Skeleton>

                        {filterElements(filter)}
                    </div>
                );
            })}
        </div>
    );
}
