import { Skeleton } from "@mantine/core";
import { ResponseBody as GetCategoryBySlugResponseDto } from "@/api/categories/[slug]/GET";
import styles from "./index.module.css";

export type TColorFilter = {
    data: GetCategoryBySlugResponseDto["filters"][number];
    awaiting?: boolean;
};

export function ColorFilter({ data, awaiting = false }: TColorFilter) {
    const { values } = data;

    return (
        <ul className={styles["filter-colors"]}>
            {values.map((value) => {
                const { code, name: valueName, value: valueString, count } = value;

                return (
                    <button
                        type="button"
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
