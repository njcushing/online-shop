import { createPriceAdjustmentString } from "@/utils/createPriceAdjustmentString";
import styles from "./index.module.css";

export type TPrice = {
    base: number;
    current: number;
    multiply?: number;
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    classNames?: {
        container?: string;
        current?: string;
        base?: string;
        discountPercentage?: string;
    };
};

export function Price({ base = 0, current = 0, multiply = 1, size = "md", classNames }: TPrice) {
    return (
        <div className={`${styles["price-container"]} ${classNames?.container}`} data-size={size}>
            <span className={`${styles["price-current"]} ${classNames?.current}`}>
                £{((current * multiply) / 100).toFixed(2)}
            </span>

            {current !== base && (
                <>
                    <span className={`${styles["price-base"]} ${classNames?.base}`}>
                        £{((base * multiply) / 100).toFixed(2)}
                    </span>
                    <span
                        className={`${styles["price-discount-percentage"]} ${classNames?.discountPercentage}`}
                    >
                        {createPriceAdjustmentString(current * multiply, base * multiply)}
                    </span>
                </>
            )}
        </div>
    );
}
