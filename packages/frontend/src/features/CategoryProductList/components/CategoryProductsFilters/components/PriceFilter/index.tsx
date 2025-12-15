import { useContext, useState, useEffect, useCallback, useRef, useMemo } from "react";
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

    const { data, awaitingAny: contextAwaitingAny } = useQueryContexts({
        contexts: [{ name: "products", context: products }],
    });

    const productsData = useMemo(() => {
        if (!contextAwaitingAny && data.products) return data.products;
        return {
            products: mockProducts,
            price: { min: 0, max: 999999999999999 },
        } as GetCategoryBySlugProductsResponseDto;
    }, [data.products, contextAwaitingAny]);

    const [min, max] = useMemo(() => {
        return [productsData.price.min, productsData.price.max];
    }, [productsData.price.min, productsData.price.max]);
    const step = 10 ** Math.floor(Math.log10(max) - 2);

    const cachedMinMax = useRef<[number, number]>([min, max]);

    const getSelected = useCallback(() => {
        const range = filterSelections.get("Price");
        if (!range || range.type !== "numeric") return [min, max] as [number, number];

        const [prevMin, prevMax] = cachedMinMax.current;
        cachedMinMax.current = [min, max];
        const newRange: [number, number] = range.value;
        if (newRange[0] === null || newRange[0] === prevMin || newRange[0] < min) {
            newRange[0] = min;
        }
        if (newRange[0] > max) newRange[0] = max;
        if (newRange[1] === null || newRange[1] === prevMax || newRange[1] > max) {
            newRange[1] = max;
        }
        if (newRange[1] < min) newRange[1] = min;
        if (newRange[0] > newRange[1]) {
            /* eslint-disable prefer-destructuring */
            if (newRange[0] !== min && newRange[1] === max) newRange[1] = newRange[0];
            else newRange[0] = newRange[1];
            /* eslint-enable prefer-destructuring */
        }
        return newRange;
    }, [filterSelections, min, max]);
    const [selected, setSelected] = useState<[number, number]>(getSelected());
    useEffect(() => setSelected(getSelected()), [getSelected]);

    return (
        <div className={styles["filter-price"]}>
            <Skeleton visible={awaiting}>
                <p
                    className={styles["filter-price-range"]}
                    style={{ visibility: awaiting ? "hidden" : "initial" }}
                >
                    £{(selected[0] / 100).toFixed(2)} - £{(selected[1] / 100).toFixed(2)}
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
