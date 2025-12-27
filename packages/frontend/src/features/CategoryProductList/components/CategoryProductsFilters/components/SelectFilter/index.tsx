import { useContext, useState, useEffect, useCallback, useMemo } from "react";
import { CategoryProductListContext } from "@/features/CategoryProductList";
import { Radio, Skeleton } from "@mantine/core";
import { ResponseBody as GetCategoryBySlugResponseDto } from "@/api/categories/[slug]/GET";
import styles from "./index.module.css";

export type TSelectFilter = {
    data: GetCategoryBySlugResponseDto["filters"][number];
    awaiting?: boolean;
};

export function SelectFilter({ data, awaiting = false }: TSelectFilter) {
    const { filterSelections, setFilterSelections } = useContext(CategoryProductListContext);

    const { code, values } = data;
    const allValues = useMemo(() => new Set<string>([...values.map((v) => v.code)]), [values]);

    const [cachedAwaiting, setCachedAwaiting] = useState<boolean>(awaiting);

    const getSelected = useCallback(() => {
        const select = filterSelections.get(code);
        if (!select || select.type !== "select" || !allValues.has(select.value)) return "";
        return select.value;
    }, [filterSelections, code, allValues]);
    const [selected, setSelected] = useState<string>(getSelected());
    useEffect(() => setSelected(getSelected()), [getSelected]);
    useEffect(() => setCachedAwaiting(awaiting), [awaiting]);

    return (
        <Radio.Group>
            <ul className={styles["filter-radio"]} data-disabled={awaiting}>
                {values.map((value) => {
                    const { code: valueCode, name: valueName, count } = value;

                    return (
                        <Radio
                            value={valueCode}
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
                                setFilterSelections((curr) => {
                                    const newSelections = new Map(curr);
                                    const validValue = valueCode.length > 0;
                                    if (!validValue) {
                                        if (newSelections.has(code)) newSelections.delete(code);
                                    } else
                                        newSelections.set(code, {
                                            type: "select",
                                            value: valueCode,
                                        });
                                    return newSelections;
                                });
                            }}
                            checked={selected === valueCode}
                            disabled={awaiting || cachedAwaiting}
                            classNames={{
                                root: styles["radio-root"],
                                body: styles["radio-body"],
                                radio: styles["radio"],
                                label: styles["radio-label"],
                            }}
                            key={valueCode}
                        />
                    );
                })}
            </ul>
        </Radio.Group>
    );
}
