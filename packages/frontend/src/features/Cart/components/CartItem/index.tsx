import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "@/pages/Root";
import { Skeleton, Image } from "@mantine/core";
import { Quantity, TQuantity } from "@/components/Inputs/Quantity";
import { CartItemData } from "@/utils/products/cart";
import { calculateUnitPrice } from "@/utils/products/utils/calculateUnitPrice";
import { ResponseBody as GetProductBySlugResponseDto } from "@/api/product/[slug]/GET";
import { Price, TPrice } from "@/features/Price";
import styles from "./index.module.css";

export type TCartItem = {
    data: CartItemData;
    editableQuantity?: boolean;
    disableLink?: boolean;
    QuantitySize?: TQuantity["size"];
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
    stock: GetProductBySlugResponseDto["variants"][number]["stock"],
    allowance: GetProductBySlugResponseDto["allowance"],
    allowanceOverride: GetProductBySlugResponseDto["variants"][number]["allowanceOverride"],
): number => {
    if (typeof allowanceOverride === "number" && !Number.isNaN(allowanceOverride)) {
        return Math.min(stock, allowanceOverride as number);
    }
    return Math.min(stock, allowance);
};

export function CartItem({
    data,
    editableQuantity = true,
    disableLink,
    QuantitySize = "sm",
    classNames,
}: TCartItem) {
    const { cart } = useContext(UserContext);
    const { awaiting } = cart;

    const { product, variant, quantity, info } = data;
    const { id, slug } = product;

    const { name, images: productImages, allowance } = product;
    const {
        stock,
        priceBase,
        subscriptionDiscountPercentage,
        allowanceOverride,
        attributes,
        images: variantImages,
    } = variant;

    let usedImage = { id: "", src: "", alt: "", position: 0 };
    if (productImages.length > 0) [usedImage] = productImages;
    if (variantImages.length > 0) [usedImage] = variantImages;

    const variantUrlParams = new URLSearchParams();
    Object.entries(attributes).forEach(([key, value]) => variantUrlParams.append(key, `${value}`));

    return (
        <li className={`${styles["cart-item"]} ${classNames?.container}`}>
            <Skeleton visible={awaiting}>
                <Image
                    className={styles["cart-item-thumbnail-image"]}
                    src={usedImage.src}
                    alt={usedImage.alt}
                    style={{ visibility: awaiting ? "hidden" : "initial" }}
                />
            </Skeleton>

            <div className={`${styles["cart-item-content"]} ${classNames?.content}`}>
                <Skeleton visible={awaiting}>
                    {!disableLink ? (
                        <div>
                            <Link
                                to={`/p/${id}/${slug}?${variantUrlParams}`}
                                className={`${styles["cart-item-name"]} ${classNames?.name}`}
                                style={{ visibility: awaiting ? "hidden" : "initial" }}
                            >
                                {name}
                            </Link>
                        </div>
                    ) : (
                        <p
                            className={`${styles["cart-item-name"]} ${classNames?.name}`}
                            style={{ visibility: awaiting ? "hidden" : "initial" }}
                        >
                            {name}
                        </p>
                    )}
                </Skeleton>

                <div className={styles["cart-item-content-middle"]}>
                    {Object.entries(attributes).map((attribute) => {
                        const [key] = attribute;
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
                                        {key}:{" "}
                                    </p>
                                    <p
                                        className={`${styles["cart-item-variant-option-value"]} ${classNames?.variantOptionValue}`}
                                    >
                                        Attribute Value
                                    </p>
                                </div>
                            </Skeleton>
                        );
                    })}
                </div>

                {!awaiting &&
                    info?.subscription &&
                    subscriptionDiscountPercentage &&
                    subscriptionDiscountPercentage > 0 && (
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
                                    size={QuantitySize}
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
                                base={priceBase}
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
