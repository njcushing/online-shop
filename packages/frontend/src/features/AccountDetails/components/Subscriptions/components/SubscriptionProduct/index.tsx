import { Link } from "react-router-dom";
import { Skeleton, Image } from "@mantine/core";
import { SubscriptionData } from "@/utils/products/subscriptions";
import { Price } from "@/features/Price";
import styles from "./index.module.css";

export type TSubscriptionProduct = {
    data: SubscriptionData;
    awaiting: boolean;
};

export function SubscriptionProduct({ data, awaiting }: TSubscriptionProduct) {
    const { product, variant } = data;

    const { id: productId, slug, name, images: productImages } = product;
    const {
        priceBase,
        priceCurrent,
        subscriptionDiscountPercentage,
        attributes,
        images: variantImages,
    } = variant;

    let usedImage = { id: "", src: "", alt: "", position: 0 };
    if (productImages.length > 0) [usedImage] = productImages;
    if (variantImages.length > 0) [usedImage] = variantImages;

    const variantUrlParams = new URLSearchParams();
    attributes.forEach((a) => variantUrlParams.append(a.type.name, `${a.value.code}`));

    return (
        <div className={styles["subscription-product"]}>
            <Skeleton visible={awaiting}>
                <Image
                    className={styles["product-thumbnail-image"]}
                    src={usedImage.src}
                    alt={usedImage.alt}
                    style={{ visibility: awaiting ? "hidden" : "initial" }}
                />
            </Skeleton>

            <div className={styles["product-information"]}>
                <Skeleton visible={awaiting}>
                    <Link
                        to={`/p/${productId}/${slug}?${variantUrlParams}`}
                        className={styles["product-full-name"]}
                        style={{ visibility: awaiting ? "hidden" : "initial" }}
                    >
                        {name}
                    </Link>
                </Skeleton>

                <div className={styles["product-variant-options"]}>
                    {attributes.map((attribute) => {
                        const { type, value } = attribute;
                        return (
                            <Skeleton visible={awaiting} key={`${type.name}-skeleton`}>
                                <div
                                    className={styles["product-variant-option-info"]}
                                    key={type.name}
                                    style={{ visibility: awaiting ? "hidden" : "initial" }}
                                >
                                    <p className={styles["product-variant-option-name"]}>
                                        {type.title}:{" "}
                                    </p>
                                    <p className={styles["product-variant-option-value"]}>
                                        {value.name}
                                    </p>
                                </div>
                            </Skeleton>
                        );
                    })}
                </div>

                <div className={styles["price-container"]}>
                    <Skeleton visible={awaiting}>
                        <div style={{ visibility: awaiting ? "hidden" : "initial" }}>
                            <Price
                                base={priceBase}
                                current={
                                    priceCurrent * (1 - (subscriptionDiscountPercentage ?? 1) / 100)
                                }
                                classNames={{
                                    base: styles["price-base"],
                                    current: styles["price-current"],
                                    discountPercentage: styles["price-discount-percentage"],
                                }}
                            />
                        </div>
                    </Skeleton>

                    {!awaiting &&
                        subscriptionDiscountPercentage &&
                        subscriptionDiscountPercentage > 0 && (
                            <p className={styles["discount-percentage-message"]}>
                                The above unit cost includes a{" "}
                                <strong>{subscriptionDiscountPercentage}%</strong> discount for
                                subscriptions to this product.
                            </p>
                        )}
                </div>
            </div>
        </div>
    );
}
