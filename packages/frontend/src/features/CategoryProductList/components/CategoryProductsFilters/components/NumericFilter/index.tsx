import { RangeSlider, Skeleton } from "@mantine/core";
import { ResponseBody as GetCategoryBySlugResponseDto } from "@/api/categories/[slug]/GET";

export type TNumericFilter = {
    data: GetCategoryBySlugResponseDto["filters"][number];
    awaiting?: boolean;
};

export function NumericFilter({ data, awaiting = false }: TNumericFilter) {
    const { values } = data;

    const min = Math.min(...values.map((v) => Number(v.value)));
    const max = Math.max(...values.map((v) => Number(v.value)));
    const step = (Math.floor(Math.log10(max - min)) - 2) ** 10;

    return (
        <Skeleton visible={awaiting}>
            <RangeSlider
                color="black"
                size="lg"
                min={min}
                max={max}
                step={step}
                disabled={awaiting}
                style={{
                    visibility: awaiting ? "hidden" : "initial",
                }}
            />
        </Skeleton>
    );
}
