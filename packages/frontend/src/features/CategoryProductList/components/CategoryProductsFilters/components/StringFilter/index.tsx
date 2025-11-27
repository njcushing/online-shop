import { useState, useEffect } from "react";
import { Checkbox, Skeleton } from "@mantine/core";
import { ResponseBody as GetCategoryBySlugResponseDto } from "@/api/categories/[slug]/GET";
import styles from "./index.module.css";

export type TStringFilter = {
    data: GetCategoryBySlugResponseDto["filters"][number];
    awaiting?: boolean;
    onChange?: (selected: Set<string>) => void;
};

export function StringFilter({ data, awaiting = false, onChange }: TStringFilter) {
    const { values } = data;

    const [selected, setSelected] = useState<Set<string>>(new Set());
    useEffect(() => onChange && onChange(selected), [onChange, selected]);

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
