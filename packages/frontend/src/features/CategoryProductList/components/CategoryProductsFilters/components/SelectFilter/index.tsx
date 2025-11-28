import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Radio, Skeleton } from "@mantine/core";
import { ResponseBody as GetCategoryBySlugResponseDto } from "@/api/categories/[slug]/GET";
import styles from "./index.module.css";

export type TSelectFilter = {
    data: GetCategoryBySlugResponseDto["filters"][number];
    awaiting?: boolean;
    onChange?: (selected: string) => void;
};

export function SelectFilter({ data, awaiting = false, onChange }: TSelectFilter) {
    const [searchParams] = useSearchParams();

    const { name, values } = data;
    const allValues = new Set<string>([...values.map((v) => v.code)]);

    const [selected, setSelected] = useState<string>(
        (() => {
            if (searchParams.has(name) && searchParams.get(name)) {
                const initSelected = searchParams.get(name);
                if (allValues.has(initSelected!)) return initSelected!;
            }
            return "";
        })(),
    );
    useEffect(() => onChange && onChange(selected), [onChange, selected]);

    return (
        <Radio.Group>
            <ul className={styles["filter-radio"]} data-disabled={awaiting}>
                {values.map((value) => {
                    const { code, name: valueName, count } = value;

                    return (
                        <Radio
                            value={code}
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
                            onChange={() => setSelected(code)}
                            checked={selected === code}
                            disabled={awaiting}
                            classNames={{
                                root: styles["radio-root"],
                                body: styles["radio-body"],
                                radio: styles["radio"],
                                label: styles["radio-label"],
                            }}
                            key={code}
                        />
                    );
                })}
            </ul>
        </Radio.Group>
    );
}
