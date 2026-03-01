import { Image } from "@mantine/core";
import styles from "./index.module.css";

export function PromotionPanel1() {
    return (
        <div className={styles["promotion-panel"]}>
            <div className={styles["image-container"]}>
                <Image
                    src="https://res.cloudinary.com/djzqtvl9l/image/upload/v1772367684/cafree/jeremy-bishop-G9i_plbfDgk-unsplash-1920_nwz5nm.jpg"
                    alt="Mainly dark blue textured background with hints of a lighter blue."
                    className={styles["image"]}
                />

                <div className={styles["image-cover"]}></div>
            </div>

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
