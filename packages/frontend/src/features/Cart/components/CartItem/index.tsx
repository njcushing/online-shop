import { useContext } from "react";
import { UserContext } from "@/pages/Root";
import { Skeleton, Image } from "@mantine/core";
import { Quantity } from "@/components/Inputs/Quantity";
import { ProductVariant, Product, variantOptions } from "@/utils/products/product";
import { PopulatedCartItemData } from "@/utils/products/cart";
import { calculateUnitPrice } from "@/utils/products/utils/calculateUnitPrice";
import { Price, TPrice } from "@/features/Price";
import styles from "./index.module.css";

export type TCartItem = {
    data: PopulatedCartItemData;
    editableQuantity?: boolean;
    classNames?: {
        container?: string;
        content?: string;
        name?: string;
        variantOptionName?: string;
        variantOptionValue?: string;
        quantity?: string;
        price?: TPrice["classNames"];
    };
};

const calculateMaximumAvailability = (
    stock: ProductVariant["stock"],
    allowance: Product["allowance"],
    allowanceOverride: ProductVariant["allowanceOverride"],
): number => {
    if (typeof allowanceOverride === "number" && !Number.isNaN(allowanceOverride)) {
        return Math.min(stock, allowanceOverride as number);
    }
    return Math.min(stock, allowance);
};

export function CartItem({ data, editableQuantity = true, classNames }: TCartItem) {
    const { cart } = useContext(UserContext);
    const { awaiting } = cart;

    const { product, variant, quantity, info } = data;
    const { subscription } = info || {};

    const { name, images, allowance } = product;
    const { price, stock, options, allowanceOverride, image } = variant;
    const { subscriptionDiscountPercentage } = price;

    const usedImage = image || images.thumb;
    const { src, alt } = usedImage;

    return (
        <li className={`${styles["cart-item"]} ${classNames?.container}`}>
            <Skeleton visible={awaiting}>
                <Image
                    className={styles["cart-item-thumbnail-image"]}
                    src={src}
                    alt={alt}
                    style={{ visibility: awaiting ? "hidden" : "initial" }}
                />
            </Skeleton>

            <div className={`${styles["cart-item-content"]} ${classNames?.content}`}>
                <Skeleton visible={awaiting}>
                    <p
                        className={`${styles["cart-item-name"]} ${classNames?.name}`}
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
                                key={`${key}-skeleton`}
                            >
                                <div
                                    className={styles["cart-item-variant-option-info"]}
                                    key={key}
                                    style={{ visibility: awaiting ? "hidden" : "initial" }}
                                >
                                    <p
                                        className={`${styles["cart-item-variant-option-name"]} ${classNames?.variantOptionName}`}
                                    >
                                        {variantOption?.name || key}:{" "}
                                    </p>
                                    <p
                                        className={`${styles["cart-item-variant-option-value"]} ${classNames?.variantOptionValue}`}
                                    >
                                        {variantOptionValue?.name || value}
                                    </p>
                                </div>
                            </Skeleton>
                        );
                    })}
                </div>

                {!awaiting && subscription && subscriptionDiscountPercentage > 0 && (
                    <p className={styles["discount-percentage-message"]}>
                        The price below includes a{" "}
                        <strong>{subscriptionDiscountPercentage}%</strong> discount for
                        subscriptions to this product.
                    </p>
                )}

                <div className={styles["cart-item-content-bottom"]}>
                    <Skeleton visible={awaiting} width="min-content">
                        <div style={{ visibility: awaiting ? "hidden" : "initial" }}>
                            {editableQuantity ? (
                                <Quantity
                                    defaultValue={quantity}
                                    min={1}
                                    max={calculateMaximumAvailability(
                                        stock,
                                        allowance,
                                        allowanceOverride,
                                    )}
                                    disabled={awaiting}
                                    size="sm"
                                />
                            ) : (
                                <p
                                    className={`${styles["quantity"]} ${classNames?.quantity}`}
                                >{`${quantity} unit${quantity !== 1 ? "s" : ""}`}</p>
                            )}
                        </div>
                    </Skeleton>

                    <Skeleton visible={awaiting} width="min-content">
                        <div style={{ visibility: awaiting ? "hidden" : "initial" }}>
                            <Price
                                base={price.base}
                                current={calculateUnitPrice(data)}
                                multiply={quantity}
                                classNames={classNames?.price}
                            />
                        </div>
                    </Skeleton>
                </div>
            </div>
        </li>
    );
}
