import { Checkbox } from "@mantine/core";
import { ResponseBody as GetCategoryBySlugResponseDto } from "@/api/categories/[slug]/GET";
import styles from "./index.module.css";

export type TStringFilter = {
    data: GetCategoryBySlugResponseDto["filters"][number];
    awaiting?: boolean;
};

export function StringFilter({ data, awaiting = false }: TStringFilter) {
    const { values } = data;

    return (
        <ul className={styles["filter-strings"]}>
            {values.map((value) => {
                const { code, name: valueName, count } = value;

                return (
                    <div className={styles["filter-value-string"]} key={code}>
                        <Checkbox
                            label={
                                <>
                                    <p className={styles["filter-value-name"]}>{valueName}</p>
                                    <p className={styles["filter-value-count"]}>({count})</p>
                                </>
                            }
                            onChange={() => {}}
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
