import { useContext, useState, useEffect, useCallback, useMemo } from "react";
import { CategoryProductListContext } from "@/features/CategoryProductList";
import { Checkbox, Skeleton } from "@mantine/core";
import { ResponseBody as GetCategoryBySlugResponseDto } from "@/api/categories/[slug]/GET";
import styles from "./index.module.css";

export type TStringFilter = {
    data: GetCategoryBySlugResponseDto["filters"][number];
    awaiting?: boolean;
};

export function StringFilter({ data, awaiting = false }: TStringFilter) {
    const { filterSelections, setFilterSelections } = useContext(CategoryProductListContext);

    const { name, values } = data;
    const allValues = useMemo(() => new Set<string>([...values.map((v) => v.code)]), [values]);

    const [cachedAwaiting, setCachedAwaiting] = useState<boolean>(awaiting);

    const getSelected = useCallback(() => {
        const initSelected = new Set<string>();
        const strings = filterSelections.get(name);
        if (!strings || strings.type !== "text") return initSelected;
        const { value } = strings;
        value.forEach((code) => {
            if (allValues.has(code)) initSelected.add(code);
        });
        return initSelected;
    }, [filterSelections, name, allValues]);
    const [selected, setSelected] = useState<Set<string>>(getSelected());
    useEffect(() => setSelected(getSelected()), [getSelected]);
    useEffect(() => setCachedAwaiting(awaiting), [awaiting]);

    return (
        <ul className={styles["filter-strings"]} data-disabled={!!awaiting || cachedAwaiting}>
            {values.map((value) => {
                const { code, name: valueName, count } = value;

                return (
                    <div className={styles["filter-value-string"]} key={code}>
                        <Checkbox
                            label={
                                <>
                                    <Skeleton visible={awaiting || cachedAwaiting}>
                                        <p
                                            className={styles["filter-value-name"]}
                                            style={{
                                                visibility:
                                                    awaiting || cachedAwaiting
                                                        ? "hidden"
                                                        : "initial",
                                            }}
                                        >
                                            {valueName}
                                        </p>
                                    </Skeleton>
                                    <Skeleton visible={awaiting || cachedAwaiting}>
                                        <p
                                            className={styles["filter-value-count"]}
                                            style={{
                                                visibility:
                                                    awaiting || cachedAwaiting
                                                        ? "hidden"
                                                        : "initial",
                                            }}
                                        >
                                            ({count})
                                        </p>
                                    </Skeleton>
                                </>
                            }
                            onChange={() => {
                                const newSelected = new Set<string>(selected);
                                if (newSelected.has(code)) newSelected.delete(code);
                                else newSelected.add(code);

                                setFilterSelections((curr) => {
                                    const newSelections = new Map(curr);
                                    if (newSelected.size === 0) {
                                        if (newSelections.has(name)) newSelections.delete(name);
                                    } else {
                                        newSelections.set(name, {
                                            type: "text",
                                            value: Array.from(newSelected),
                                        });
                                    }
                                    return newSelections;
                                });
                            }}
                            checked={selected.has(code)}
                            disabled={awaiting || cachedAwaiting}
                            classNames={{
                                root: styles["checkbox-root"],
                                body: styles["checkbox-body"],
                                input: styles["checkbox-input"],
                                label: styles["checkbox-label"],
                            }}
                        />
                    </div>
                );
            })}
        </ul>
    );
}
