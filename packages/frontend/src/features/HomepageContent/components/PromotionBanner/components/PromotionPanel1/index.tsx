import styles from "./index.module.css";

export function PromotionPanel1() {
    return (
        <div className={styles["promotion-panel"]}>
            <div className={styles["promotion-panel-inner"]}>
                <p className={styles["title"]}>£10 off*</p>

                <p className={styles["subcopy"]}>when you spend over £100</p>

                <p className={styles["code"]}>
                    Use code {`'`}
                    <strong>TAKE10</strong>
                    {`'`}
                </p>

                <p className={styles["disclaimer"]}>*promotion applied at checkout</p>
            </div>
        </div>
    );
}
