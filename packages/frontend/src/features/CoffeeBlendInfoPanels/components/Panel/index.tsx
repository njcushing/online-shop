import { Divider } from "@mantine/core";
import { BlendData } from "../../blendData";
import styles from "./index.module.css";

export type TPanel = {
    data: BlendData;
};

export function Panel({ data }: TPanel) {
    const { name, origins, description } = data;

    return (
        <div className={styles["panel"]}>
            <div className={styles["content-top"]}>
                <p className={styles["name"]}>{name}</p>

                <div className={styles["flags"]}>
                    <Divider orientation="vertical" className={styles["Divider"]} />

                    {origins.map((origin) => (
                        <div className={`fi fi-${origin} ${styles["flag"]}`} key={origin}></div>
                    ))}
                </div>
            </div>

            <Divider className={styles["Divider"]} />

            <div className={styles["content-main"]}>
                <div className={styles["content-left"]}>
                    <p className={styles["description"]}>{description}</p>

                    <Divider className={styles["Divider"]} />
                </div>

                <Divider orientation="vertical" className={styles["Divider"]} />

                <div className={styles["content-right"]}></div>
            </div>
        </div>
    );
}
