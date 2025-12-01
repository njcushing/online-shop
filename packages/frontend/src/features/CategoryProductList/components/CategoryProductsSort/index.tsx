import { useContext, useState, useEffect } from "react";
import { CategoryProductListContext } from "../..";
import styles from "./index.module.css";

export const sortOptions = [
    { title: "Best Sellers", name: "best_sellers" },
    { title: "Price (Low to High)", name: "price_asc" },
    { title: "Price (High to Low)", name: "price_desc" },
    { title: "Average Rating", name: "rating_desc" },
    { title: "Newest Releases", name: "created_desc" },
] as const;

export const defaultSort: (typeof sortOptions)[number]["name"] = "best_sellers";

export type TCategoryProductsSort = {
    awaiting?: boolean;
};

export function CategoryProductsSort({ awaiting = false }: TCategoryProductsSort) {
    const { sortSelection, setSortSelection } = useContext(CategoryProductListContext);

    const [selected, setSelected] = useState<(typeof sortOptions)[number]["name"]>(
        sortSelection || defaultSort,
    );
    useEffect(() => {
        setSortSelection(selected !== defaultSort ? selected : null);
    }, [setSortSelection, selected]);

    return (
        <div className={styles["category-products-sort"]} data-disabled={awaiting}>
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
                    disabled={awaiting}
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
