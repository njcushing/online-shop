import { useContext, useState, useEffect } from "react";
import { CategoryProductListContext } from "@/features/CategoryProductList";
import { RangeSlider, Skeleton } from "@mantine/core";
import { ResponseBody as GetCategoryBySlugResponseDto } from "@/api/categories/[slug]/GET";
import styles from "./index.module.css";

export type TNumericFilter = {
    data: GetCategoryBySlugResponseDto["filters"][number];
    awaiting?: boolean;
};

export function NumericFilter({ data, awaiting = false }: TNumericFilter) {
    const { filterSelections, setFilterSelections } = useContext(CategoryProductListContext);

    const { name, values } = data;

    const min = Math.min(...values.map((v) => Number(v.value)));
    const max = Math.max(...values.map((v) => Number(v.value)));
    const step = 10 ** Math.floor(Math.log10(max) - 2);

    const [selected, setSelected] = useState<[number, number]>(
        (() => {
            const range = filterSelections.get(name);
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
        <div className={styles["filter-numeric"]}>
            <Skeleton visible={awaiting}>
                <p
                    className={styles["filter-numeric-range"]}
                    style={{ visibility: awaiting ? "hidden" : "initial" }}
                >
                    {((selected[0] !== null ? selected[0] : min) / 100).toFixed(2)} -
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
                                if (newSelections.has(name)) newSelections.delete(name);
                            } else newSelections.set(name, { type: "numeric", value });
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
