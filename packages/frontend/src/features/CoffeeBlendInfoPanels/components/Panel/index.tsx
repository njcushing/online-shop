import { Divider } from "@mantine/core";
import { BlendData } from "../..";
import styles from "./index.module.css";

export type TPanel = {
    data: BlendData;
};

export function Panel({ data }: TPanel) {
    const { name } = data;

    return (
        <div className={styles["panel"]}>
            <p className={styles["name"]}>{name}</p>

            <Divider className={styles["Divider"]} />
        </div>
    );
}
