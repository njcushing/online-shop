import { useContext } from "react";
import { UserContext } from "@/pages/Root";
import { Skeleton, SkeletonProps, Image } from "@mantine/core";
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

const SkeletonClassNames: SkeletonProps["classNames"] = {
    root: styles["skeleton-root"],
};

export function CartItem({ data }: TCartItem) {
    const { cart } = useContext(UserContext);
    const { awaiting } = cart;

    const { product, variant, quantity } = data;

    const { name, images, allowance } = product;
    const { price, stock, options, allowanceOverride, image } = variant;

    const usedImage = image || images.thumb;
    const { src, alt } = usedImage;

    return (
        <li className={styles["cart-item"]}>
            <Skeleton visible={awaiting} classNames={SkeletonClassNames}>
                <Image
                    className={styles["cart-item-thumbnail-image"]}
                    src={src}
                    alt={alt}
                    style={{ visibility: awaiting ? "hidden" : "initial" }}
                />
            </Skeleton>

            <div className={styles["cart-item-content"]}>
                <Skeleton visible={awaiting} classNames={SkeletonClassNames}>
                    <p
                        className={styles["cart-item-name"]}
                        style={{ visibility: awaiting ? "hidden" : "initial" }}
                    >
                        {name.full}
                    </p>
                </Skeleton>

                <div className={styles["cart-item-content-middle"]}>
                    {Object.entries(options).map((option) => {
                        const [key, value] = option;
                        const variantOption = variantOptions.find((vOpt) => vOpt.id === key);
                        const variantOptionValue = variantOption?.values.find(
                            (vOptVal) => vOptVal.id === value,
                        );
                        return (
                            <Skeleton
                                visible={awaiting}
                                width="min-content"
                                classNames={SkeletonClassNames}
                                key={`${key}-skeleton`}
                            >
                                <div
                                    className={styles["cart-item-variant-option-info"]}
                                    key={key}
                                    style={{ visibility: awaiting ? "hidden" : "initial" }}
                                >
                                    <p className={styles["cart-item-variant-option-name"]}>
                                        {variantOption?.name || key}:{" "}
                                    </p>
                                    <p className={styles["cart-item-variant-option-value"]}>
                                        {variantOptionValue?.name || value}
                                    </p>
                                </div>
                            </Skeleton>
                        );
                    })}
                </div>

                <div className={styles["cart-item-content-bottom"]}>
                    <Skeleton
                        visible={awaiting}
                        width="min-content"
                        classNames={SkeletonClassNames}
                    >
                        <div style={{ visibility: awaiting ? "hidden" : "initial" }}>
                            <Quantity
                                defaultValue={quantity}
                                min={1}
                                max={calculateMaximumAvailability(
                                    stock,
                                    allowance,
                                    allowanceOverride,
                                )}
                                disabled={awaiting}
                                size="s"
                            />
                        </div>
                    </Skeleton>

                    <Skeleton
                        visible={awaiting}
                        width="min-content"
                        classNames={SkeletonClassNames}
                    >
                        <div
                            className={styles["cart-item-price-container"]}
                            style={{ visibility: awaiting ? "hidden" : "initial" }}
                        >
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
                    </Skeleton>
                </div>
            </div>
        </li>
    );
}
