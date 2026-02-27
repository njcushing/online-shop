import styles from "./index.module.css";

export function PromotionPanel1() {
    return (
        <div className={styles["promotion-panel"]}>
            <div className={styles["promotion-panel-inner"]}>
                <p className={styles["promotion-panel-title"]}>Test Panel 1</p>
            </div>
        </div>
    );
}
