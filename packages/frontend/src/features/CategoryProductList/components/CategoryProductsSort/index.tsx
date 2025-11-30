import { useContext, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CategoryContext } from "@/pages/Category";
import { useQueryContexts } from "@/hooks/useQueryContexts";
import { customStatusCodes } from "@/api/types";
import styles from "./index.module.css";

export const sortOptions = [
    { title: "Best Sellers", name: "best_sellers" },
    { title: "Price (Low to High)", name: "price_asc" },
    { title: "Price (High to Low)", name: "price_desc" },
    { title: "Average Rating", name: "rating_desc" },
    { title: "Newest Releases", name: "created_desc" },
] as const;

export function CategoryProductsSort() {
    const { categoryData } = useContext(CategoryContext);

    const { awaitingAny: contextAwaitingAny } = useQueryContexts({
        contexts: [{ name: "category", context: categoryData }],
    });

    const awaitingAny =
        contextAwaitingAny || categoryData.response.status === customStatusCodes.unattempted;

    const [searchParams] = useSearchParams();

    const [selected, setSelected] = useState<(typeof sortOptions)[number]["name"]>(
        (() => {
            if (searchParams.has("sort") && searchParams.get("sort")) {
                const initSelected = searchParams.get("sort");
                if (sortOptions.find((so) => so.name === initSelected)) {
                    return initSelected! as unknown as (typeof sortOptions)[number]["name"];
                }
            }
            return "best_sellers";
        })(),
    );

    return (
        <div className={styles["category-products-sort"]}>
            <label htmlFor="category-products-sort" className={styles["label"]}>
                Sort by:
                <select
                    className={styles["select"]}
                    id="category-products-sort"
                    name="category-products-sort"
                    value={selected}
                    onChange={(e) => {
                        const { value } = e.target;
                        setSelected(value as (typeof sortOptions)[number]["name"]);
                    }}
                    disabled={awaitingAny}
                    key="sort-options"
                >
                    {sortOptions.map((option) => {
                        return (
                            <option
                                className={styles["category-products-sort-option"]}
                                value={option.name}
                                key={`category-products-sort-option-${option.title}`}
                            >
                                {option.title}
                            </option>
                        );
                    })}
                </select>
            </label>
        </div>
    );
}
