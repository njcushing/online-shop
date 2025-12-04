import { useContext, useState, useEffect } from "react";
import { CategoryProductListContext } from "@/features/CategoryProductList";
import { RangeSlider, Skeleton } from "@mantine/core";
import { ResponseBody as GetCategoryBySlugResponseDto } from "@/api/categories/[slug]/GET";
import { isNumeric } from "@/utils/isNumeric";
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

    const [selectedForDisplay, setSelectedForDisplay] = useState<[number, number]>([min, max]);
    const [selected, setSelected] = useState<[number, number]>(
        (() => {
            const range = filterSelections.get(name);
            if (range && range.length === 2 && isNumeric(range[0]) && isNumeric(range[1])) {
                return [Math.max(min, Number(range[0])), Math.min(max, Number(range[1]))];
            }
            return [min, max];
        })(),
    );
    useEffect(() => {
        setFilterSelections((curr) => {
            const newSelections = new Map(curr);
            const validValue = selected[0] !== min || selected[1] !== max;
            if (!validValue) {
                if (newSelections.has(name)) newSelections.delete(name);
            } else newSelections.set(name, [`${selected[0]}`, `${selected[1]}`]);
            return newSelections;
        });
    }, [setFilterSelections, name, min, max, selected]);

    return (
        <div className={styles["filter-numeric"]}>
            <Skeleton visible={awaiting}>
                <p
                    className={styles["filter-numeric-range"]}
                    style={{ visibility: awaiting ? "hidden" : "initial" }}
                >
                    {selectedForDisplay[0]} - {selectedForDisplay[1]}
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
                    onChange={(value) => setSelectedForDisplay(value)}
                    onChangeEnd={(value) => setSelected(value)}
                    disabled={awaiting}
                    style={{ visibility: awaiting ? "hidden" : "initial" }}
                />
            </Skeleton>
        </div>
    );
}
