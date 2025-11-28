import { useState, useEffect } from "react";
import { RangeSlider, Skeleton } from "@mantine/core";
import { ResponseBody as GetCategoryBySlugResponseDto } from "@/api/categories/[slug]/GET";
import styles from "./index.module.css";

export type TNumericFilter = {
    data: GetCategoryBySlugResponseDto["filters"][number];
    awaiting?: boolean;
    onChange?: (range: [number, number] | null) => void;
};

export function NumericFilter({ data, awaiting = false, onChange }: TNumericFilter) {
    const { values } = data;

    const min = Math.min(...values.map((v) => Number(v.value)));
    const max = Math.max(...values.map((v) => Number(v.value)));
    const step = 10 ** Math.floor(Math.log10(max) - 2);

    const [selectedForDisplay, setSelectedForDisplay] = useState<[number, number]>([min, max]);
    const [selected, setSelected] = useState<[number, number]>([min, max]);
    useEffect(() => {
        if (onChange) onChange(selected[0] !== min || selected[1] !== max ? selected : null);
    }, [onChange, min, max, selected]);

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
