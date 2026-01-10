import styles from "./index.module.css";

export type TPanel = {
    blendName: string;
};

export function Panel({ blendName }: TPanel) {
    return <div className={styles["panel"]}>{blendName}</div>;
}
