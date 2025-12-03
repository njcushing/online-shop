import { useContext, useState, useEffect } from "react";
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

    const { name, values } = data;
    const allValues = new Set<string>([...values.map((v) => v.code)]);

    const [selected, setSelected] = useState<string>(
        (() => {
            const select = filterSelections.get(name);
            if (select && typeof select === "string" && allValues.has(select)) {
                return select;
            }
            return "";
        })(),
    );
    useEffect(() => {
        setFilterSelections((curr) => {
            const newSelections = new Map(curr);
            const validValue = selected.length > 0;
            if (!validValue) {
                if (newSelections.has(name)) newSelections.delete(name);
            } else newSelections.set(name, selected);
            return newSelections;
        });
    }, [setFilterSelections, name, selected]);

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
