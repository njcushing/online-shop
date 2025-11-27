import { useState, useEffect } from "react";
import { RangeSlider, Skeleton } from "@mantine/core";
import { ResponseBody as GetCategoryBySlugResponseDto } from "@/api/categories/[slug]/GET";

export type TNumericFilter = {
    data: GetCategoryBySlugResponseDto["filters"][number];
    awaiting?: boolean;
    onChange?: (range: [number, number]) => void;
};

export function NumericFilter({ data, awaiting = false, onChange }: TNumericFilter) {
    const { values } = data;

    const min = Math.min(...values.map((v) => Number(v.value)));
    const max = Math.max(...values.map((v) => Number(v.value)));
    const step = 10 ** Math.floor(Math.log10(max) - 2);

    const [selected, setSelected] = useState<[number, number]>([min, max]);
    useEffect(() => onChange && onChange(selected), [onChange, selected]);

    return (
        <Skeleton visible={awaiting}>
            <RangeSlider
                color="black"
                size="lg"
                min={min}
                max={max}
                minRange={0}
                step={step}
                onChangeEnd={(value) => setSelected(value)}
                disabled={awaiting}
                style={{ visibility: awaiting ? "hidden" : "initial" }}
            />
        </Skeleton>
    );
}
