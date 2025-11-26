import { Radio, Skeleton } from "@mantine/core";
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
