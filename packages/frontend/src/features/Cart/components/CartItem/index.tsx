import { Image } from "@mantine/core";
import { Quantity } from "@/components/Inputs/Quantity";
import { ProductVariant, Product, variantOptions } from "@/utils/products/product";
import { PopulatedCartItemData } from "@/utils/products/cart";
import { createPriceAdjustmentString } from "@/utils/createPriceAdjustmentString";
import styles from "./index.module.css";

export type TCartItem = {
    data: PopulatedCartItemData;
};

const calculateMaximumAvailability = (
    stock: ProductVariant["stock"],
    allowance: Product["allowance"],
    allowanceOverride: ProductVariant["allowanceOverride"],
): number => {
    if (!Number.isNaN(Number(allowanceOverride))) {
        return Math.min(stock, allowanceOverride as number);
    }
    return Math.min(stock, allowance);
};

export function CartItem({ data }: TCartItem) {
    const { product, variant, quantity } = data;

    const { name, images, allowance } = product;
    const { price, stock, options, allowanceOverride, image } = variant;

    return (
        <li className={styles["cart-item"]}>
            <Image className={styles["cart-item-thumbnail-image"]} src={image || images.thumb} />

            <div className={styles["cart-item-content"]}>
                <p className={styles["cart-item-name"]}>{name.full}</p>

                <div className={styles["cart-item-content-middle"]}>
                    {Object.entries(options).map((option) => {
                        const [key, value] = option;
                        const variantOption = variantOptions.find((vOpt) => vOpt.id === key);
                        const variantOptionValue = variantOption?.values.find(
                            (vOptVal) => vOptVal.id === value,
                        );
                        return (
                            <div className={styles["cart-item-variant-option-info"]} key={key}>
                                <p className={styles["cart-item-variant-option-name"]}>
                                    {variantOption?.name || key}:{" "}
                                </p>
                                <p className={styles["cart-item-variant-option-value"]}>
                                    {variantOptionValue?.name || value}
                                </p>
                            </div>
                        );
                    })}
                </div>

                <div className={styles["cart-item-content-bottom"]}>
                    <Quantity
                        defaultValue={quantity}
                        min={1}
                        max={calculateMaximumAvailability(stock, allowance, allowanceOverride)}
                        size="s"
                    />

                    <div className={styles["cart-item-price-container"]}>
                        <span className={styles["cart-item-price-current"]}>
                            £{((price.current * quantity) / 100).toFixed(2)}
                        </span>

                        {price.current !== price.base && (
                            <>
                                <span className={styles["cart-item-price-base"]}>
                                    £{((price.base * quantity) / 100).toFixed(2)}
                                </span>
                                <span className={styles["cart-item-price-discount-percentage"]}>
                                    {createPriceAdjustmentString(
                                        price.current * quantity,
                                        price.base * quantity,
                                    )}
                                </span>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </li>
    );
}
