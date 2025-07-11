import { createPriceAdjustmentString } from "@/utils/createPriceAdjustmentString";
import styles from "./index.module.css";

export type TPrice = {
    base: number;
    current: number;
    multiply?: number;
    size?: "xs" | "sm" | "md" | "lg" | "xl";
};

export function Price({ base = 0, current = 0, multiply = 1, size = "md" }: TPrice) {
    return (
        <div className={styles["price-container"]} data-size={size}>
            <span className={styles["price-current"]}>
                £{((current * multiply) / 100).toFixed(2)}
            </span>

            {current !== base && (
                <>
                    <span className={styles["price-base"]}>
                        £{((base * multiply) / 100).toFixed(2)}
                    </span>
                    <span className={styles["price-discount-percentage"]}>
                        {createPriceAdjustmentString(current * multiply, base * multiply)}
                    </span>
                </>
            )}
        </div>
    );
}
