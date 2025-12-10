import { useContext, useState, useEffect } from "react";
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
    const allValues = new Set<string>([...values.map((v) => v.code)]);

    const [selected, setSelected] = useState<Set<string>>(
        (() => {
            const initSelected = new Set<string>();
            const strings = filterSelections.get(name);
            if (!strings || strings.type !== "text") return initSelected;
            const { value } = strings;
            value.forEach((code) => {
                if (allValues.has(code)) initSelected.add(code);
            });
            return initSelected;
        })(),
    );
    useEffect(() => {
        setFilterSelections((curr) => {
            const newSelections = new Map(curr);
            if (selected.size === 0) {
                if (newSelections.has(name)) newSelections.delete(name);
            } else {
                newSelections.set(name, { type: "text", value: Array.from(selected) });
            }
            return newSelections;
        });
    }, [setFilterSelections, name, selected]);

    return (
        <ul className={styles["filter-strings"]} data-disabled={!!awaiting}>
            {values.map((value) => {
                const { code, name: valueName, count } = value;

                return (
                    <div className={styles["filter-value-string"]} key={code}>
                        <Checkbox
                            label={
                                <>
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
                                </>
                            }
                            onChange={() => {
                                const newSelected = new Set<string>(selected);
                                if (newSelected.has(code)) newSelected.delete(code);
                                else newSelected.add(code);
                                setSelected(newSelected);
                            }}
                            checked={selected.has(code)}
                            disabled={awaiting}
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
