import { Image } from "@mantine/core";
import styles from "./index.module.css";

export function PromotionPanel2() {
    return (
        <div className={styles["promotion-panel"]}>
            <div className={styles["image-container"]}>
                <Image
                    src="https://res.cloudinary.com/djzqtvl9l/image/upload/v1772367514/cafree/jelena-lapina-lFc81EX0XUM-unsplash-1920_qpyscd.jpg"
                    alt="A rich yellow peeling painted wall."
                    className={styles["image"]}
                />

                <div className={styles["image-cover"]}></div>
            </div>

            <div className={styles["promotion-panel-inner"]}>
                <p className={styles["title"]}>Seasonal Sales</p>

                <p className={styles["subcopy"]}>5% off sitewide on any purchase*</p>

                <p className={styles["code"]}>
                    Use code {`'`}
                    <strong>SEASONAL</strong>
                    {`'`}
                </p>

                <p className={styles["disclaimer"]}>*promotion applied at checkout</p>
            </div>
        </div>
    );
}
