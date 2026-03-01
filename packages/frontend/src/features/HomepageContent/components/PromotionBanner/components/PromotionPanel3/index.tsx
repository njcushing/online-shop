import { useNavigate } from "react-router-dom";
import { Image } from "@mantine/core";
import styles from "./index.module.css";

export function PromotionPanel3() {
    const navigate = useNavigate();

    return (
        <div className={styles["promotion-panel"]}>
            <div className={styles["image-container"]}>
                <Image
                    src="https://res.cloudinary.com/djzqtvl9l/image/upload/v1772283523/cafree/matt-brett-ZYpnq8B3Wn0-unsplash-1920_binzfa.jpg"
                    alt="An espresso from above, sat atop a pile of coffee beans."
                    className={styles["image"]}
                />

                <div className={styles["image-cover"]}></div>
            </div>

            <div className={styles["promotion-panel-inner"]}>
                <p className={styles["title"]}>Love Coffee?</p>

                <p className={styles["subcopy"]}>Enjoy discounts across our wide range</p>

                <button
                    type="button"
                    role="link"
                    onClick={() => navigate("/c/coffee")}
                    className={styles["link"]}
                >
                    Shop Now
                </button>
            </div>
        </div>
    );
}
