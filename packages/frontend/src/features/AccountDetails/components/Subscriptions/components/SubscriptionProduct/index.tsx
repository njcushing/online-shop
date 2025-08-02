import { useContext } from "react";
import { UserContext } from "@/pages/Root";
import { Link } from "react-router-dom";
import { Skeleton, Image } from "@mantine/core";
import { variantOptions } from "@/utils/products/product";
import { PopulatedSubscriptionData } from "@/utils/products/subscriptions";
import { Price } from "@/features/Price";
import styles from "./index.module.css";

export type TSubscriptionProduct = {
    data: PopulatedSubscriptionData;
};

export function SubscriptionProduct({ data }: TSubscriptionProduct) {
    const { subscriptions } = useContext(UserContext);
    const { awaiting } = subscriptions;

    const { product, variant } = data;

    const { id: productId, slug, name, images } = product;
    const { price, options, image } = variant;
    const { base, current, subscriptionDiscountPercentage } = price;

    const usedImage = image || images.thumb;
    const { src, alt } = usedImage;

    const variantUrlParams = new URLSearchParams();
    Object.entries(options).forEach(([key, value]) => variantUrlParams.append(key, `${value}`));

    return (
        <div className={styles["subscription-product"]}>
            <Skeleton visible={awaiting}>
                <Image
                    className={styles["product-thumbnail-image"]}
                    src={src}
                    alt={alt}
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
                        {name.full}
                    </Link>
                </Skeleton>

                <div className={styles["product-variant-options"]}>
                    {Object.entries(options).map((option) => {
                        const [key, value] = option;
                        const variantOption = variantOptions.find((vOpt) => vOpt.id === key);
                        const variantOptionValue = variantOption?.values.find(
                            (vOptVal) => vOptVal.id === value,
                        );
                        return (
                            <Skeleton visible={awaiting} key={`${key}-skeleton`}>
                                <div
                                    className={styles["product-variant-option-info"]}
                                    key={key}
                                    style={{ visibility: awaiting ? "hidden" : "initial" }}
                                >
                                    <p className={styles["product-variant-option-name"]}>
                                        {variantOption?.name || key}:{" "}
                                    </p>
                                    <p className={styles["product-variant-option-value"]}>
                                        {variantOptionValue?.name || value}
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
                                base={base}
                                current={current * (1 - subscriptionDiscountPercentage / 100)}
                                classNames={{
                                    base: styles["price-base"],
                                    current: styles["price-current"],
                                    discountPercentage: styles["price-discount-percentage"],
                                }}
                            />
                        </div>
                    </Skeleton>

                    {!awaiting && subscriptionDiscountPercentage > 0 && (
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
