import { useContext, useState, useEffect, useCallback, useMemo } from "react";
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
    const allValues = useMemo(() => new Set<string>([...values.map((v) => v.code)]), [values]);

    const [cachedAwaiting, setCachedAwaiting] = useState<boolean>(awaiting);

    const getSelected = useCallback(() => {
        const initSelected = new Set<string>();
        const colors = filterSelections.get(name);
        if (!colors || colors.type !== "color") return initSelected;
        const { value } = colors;
        value.forEach((code) => {
            if (allValues.has(code)) initSelected.add(code);
        });
        return initSelected;
    }, [filterSelections, name, allValues]);
    const [selected, setSelected] = useState<Set<string>>(getSelected());
    useEffect(() => setSelected(getSelected()), [getSelected]);
    useEffect(() => setCachedAwaiting(awaiting), [awaiting]);

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

                            setFilterSelections((curr) => {
                                const newSelections = new Map(curr);
                                if (newSelected.size === 0) {
                                    if (newSelections.has(name)) newSelections.delete(name);
                                } else {
                                    newSelections.set(name, {
                                        type: "color",
                                        value: Array.from(newSelected),
                                    });
                                }
                                return newSelections;
                            });
                        }}
                        data-selected={selected.has(code)}
                        disabled={awaiting || cachedAwaiting}
                        className={styles["filter-value-color"]}
                        key={code}
                    >
                        <Skeleton visible={awaiting || cachedAwaiting}>
                            <div
                                className={styles["filter-value-color-box"]}
                                data-valid-color={!!valueString}
                                style={{
                                    visibility: awaiting || cachedAwaiting ? "hidden" : "initial",
                                    backgroundColor: valueString,
                                }}
                            ></div>
                        </Skeleton>
                        <Skeleton visible={awaiting || cachedAwaiting}>
                            <p
                                className={styles["filter-value-name"]}
                                style={{
                                    visibility: awaiting || cachedAwaiting ? "hidden" : "initial",
                                }}
                            >
                                {valueName}
                            </p>
                        </Skeleton>
                        <Skeleton visible={awaiting || cachedAwaiting}>
                            <p
                                className={styles["filter-value-count"]}
                                style={{
                                    visibility: awaiting || cachedAwaiting ? "hidden" : "initial",
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
