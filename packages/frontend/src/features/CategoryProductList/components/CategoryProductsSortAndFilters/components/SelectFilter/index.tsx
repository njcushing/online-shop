import { Radio } from "@mantine/core";
import { ResponseBody as GetCategoryBySlugResponseDto } from "@/api/categories/[slug]/GET";
import styles from "./index.module.css";

export type TSelectFilter = {
    data: GetCategoryBySlugResponseDto["filters"][number];
    awaiting?: boolean;
};

export function SelectFilter({ data, awaiting = false }: TSelectFilter) {
    const { values } = data;

    return (
        <Radio.Group>
            <ul className={styles["filter-radio"]}>
                {values.map((value) => {
                    const { code, name: valueName, count } = value;

                    return (
                        <Radio
                            value={code}
                            label={
                                <>
                                    <p className={styles["filter-value-name"]}>{valueName}</p>
                                    <p className={styles["filter-value-count"]}>({count})</p>
                                </>
                            }
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
