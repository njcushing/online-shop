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
                    <button type="button" className={styles["filter-value-color"]} key={code}>
                        <div
                            className={styles["filter-value-color-box"]}
                            data-valid-color={!!valueString}
                            style={{ backgroundColor: valueString }}
                        ></div>
                        <p className={styles["filter-value-name"]}>{valueName}</p>
                        <p className={styles["filter-value-count"]}>({count})</p>
                    </button>
                );
            })}
        </ul>
    );
}
