import { useContext, useEffect, useState } from "react";
import { CategoryProductListContext } from "@/features/CategoryProductList";
import { Skeleton } from "@mantine/core";
import { ResponseBody as GetCategoryBySlugResponseDto } from "@/api/categories/[slug]/GET";
import styles from "./index.module.css";

export type TColorFilter = {
    data: GetCategoryBySlugResponseDto["filters"][number];
    awaiting?: boolean;
};

export function ColorFilter({ data, awaiting = false }: TColorFilter) {
    const { filterSelections, setFilterSelections } = useContext(CategoryProductListContext);

    const { name, values } = data;
    const allValues = new Set<string>([...values.map((v) => v.code)]);

    const [selected, setSelected] = useState<Set<string>>(
        (() => {
            const initSelected = new Set<string>();
            const colors = filterSelections.get(name);
            if (colors && Array.isArray(colors)) {
                colors.forEach((code) => {
                    if (allValues.has(code)) initSelected.add(code);
                });
            }
            return initSelected;
        })(),
    );
    useEffect(() => {
        setFilterSelections((curr) => {
            const newSelections = new Map(curr);
            if (selected.size === 0) {
                if (newSelections.has(name)) newSelections.delete(name);
            } else {
                newSelections.set(name, Array.from(selected));
            }
            return newSelections;
        });
    }, [setFilterSelections, name, selected]);

    return (
        <ul className={styles["filter-colors"]}>
            {values.map((value) => {
                const { code, name: valueName, value: valueString, count } = value;

                return (
                    <button
                        type="button"
                        onClick={() => {
                            const newSelected = new Set<string>(selected);
                            if (newSelected.has(code)) newSelected.delete(code);
                            else newSelected.add(code);
                            setSelected(newSelected);
                        }}
                        data-selected={selected.has(code)}
                        disabled={awaiting}
                        className={styles["filter-value-color"]}
                        key={code}
                    >
                        <Skeleton visible={awaiting}>
                            <div
                                className={styles["filter-value-color-box"]}
                                data-valid-color={!!valueString}
                                style={{
                                    visibility: awaiting ? "hidden" : "initial",
                                    backgroundColor: valueString,
                                }}
                            ></div>
                        </Skeleton>
                        <Skeleton visible={awaiting}>
                            <p
                                className={styles["filter-value-name"]}
                                style={{
                                    visibility: awaiting ? "hidden" : "initial",
                                }}
                            >
                                {valueName}
                            </p>
                        </Skeleton>
                        <Skeleton visible={awaiting}>
                            <p
                                className={styles["filter-value-count"]}
                                style={{
                                    visibility: awaiting ? "hidden" : "initial",
                                }}
                            >
                                ({count})
                            </p>
                        </Skeleton>
                    </button>
                );
            })}
        </ul>
    );
}
