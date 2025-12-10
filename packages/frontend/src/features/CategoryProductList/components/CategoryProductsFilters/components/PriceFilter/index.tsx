import { useContext, useState, useEffect } from "react";
import { CategoryProductListContext } from "@/features/CategoryProductList";
import { RangeSlider, Skeleton } from "@mantine/core";
import { useQueryContexts } from "@/hooks/useQueryContexts";
import { ResponseBody as GetCategoryBySlugProductsResponseDto } from "@/api/categories/[slug]/products/GET";
import { mockProducts } from "@/utils/products/product";
import styles from "./index.module.css";

export type TPriceFilter = {
    awaiting?: boolean;
};

export function PriceFilter({ awaiting = false }: TPriceFilter) {
    const { products, filterSelections, setFilterSelections } = useContext(
        CategoryProductListContext,
    );

    let productsData = {
        products: mockProducts,
        price: { min: 0, max: 999999999999999 },
    } as GetCategoryBySlugProductsResponseDto;

    const { data, awaitingAny: contextAwaitingAny } = useQueryContexts({
        contexts: [{ name: "products", context: products }],
    });

    if (!contextAwaitingAny) {
        if (data.products) productsData = data.products;
    }

    const { price } = productsData;
    const { min, max } = price;

    const step = 10 ** Math.floor(Math.log10(max) - 2);

    const [selected, setSelected] = useState<[number, number]>(
        (() => {
            const range = filterSelections.get("Price");
            if (!range || range.type !== "numeric") return [min, max];
            return [Math.max(min, range.value[0]), Math.min(max, range.value[1])];
        })(),
    );
    useEffect(() => {
        setSelected((curr) => {
            const newRange = curr;
            if (newRange[0] === null || newRange[0] < min) newRange[0] = min;
            if (newRange[1] === null || newRange[1] > max) newRange[1] = max;
            return newRange;
        });
    }, [min, max, selected]);

    return (
        <div className={styles["filter-price"]}>
            <Skeleton visible={awaiting}>
                <p
                    className={styles["filter-price-range"]}
                    style={{ visibility: awaiting ? "hidden" : "initial" }}
                >
                    £{((selected[0] !== null ? selected[0] : min) / 100).toFixed(2)} - £
                    {((selected[1] !== null ? selected[1] : max) / 100).toFixed(2)}
                </p>
            </Skeleton>

            <Skeleton visible={awaiting}>
                <RangeSlider
                    color="black"
                    size="lg"
                    label={null}
                    min={min}
                    max={max}
                    minRange={0}
                    step={step}
                    value={selected}
                    onChange={(value) => {
                        const newRange: [number, number] = [
                            value[0] !== min ? value[0] : min,
                            value[1] !== max ? value[1] : max,
                        ];
                        setSelected(newRange);
                    }}
                    onChangeEnd={(value) => {
                        setFilterSelections((curr) => {
                            const newSelections = new Map(curr);
                            const validValue = value[0] !== min || value[1] !== max;
                            if (!validValue) {
                                if (newSelections.has("Price")) newSelections.delete("Price");
                            } else newSelections.set("Price", { type: "numeric", value });
                            return newSelections;
                        });
                    }}
                    disabled={awaiting}
                    style={{ visibility: awaiting ? "hidden" : "initial" }}
                />
            </Skeleton>
        </div>
    );
}
