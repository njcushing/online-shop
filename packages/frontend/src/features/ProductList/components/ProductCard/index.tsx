import React, { useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { Image, Rating } from "@mantine/core";
import { Product as ProductDataType, ProductVariant } from "@/utils/products/product";
import { createPriceAdjustmentString } from "@/utils/createPriceAdjustmentString";
import dayjs from "dayjs";
import styles from "./index.module.css";

const lowStockThreshold = 50;

export type TProductCard = {
    productData: ProductDataType;
};

export function ProductCard({ productData }: TProductCard) {
    const productInformationBanner = useCallback((): React.ReactNode | null => {
        if (productData.variants.length === 0) return null;
        const highestStockVariant = productData.variants.reduce(
            (min, variant) => (variant.stock > min ? variant.stock : min),
            productData.variants[0].stock,
        );

        // Out of stock
        if (highestStockVariant === 0) {
            return <div className={styles["product-information-banner"]}>Out of stock</div>;
        }

        // Low stock
        if (highestStockVariant <= lowStockThreshold) {
            return <div className={styles["product-information-banner"]}>Low stock</div>;
        }

        // New in stock (within last month)
        const daysInLastMonth = dayjs().subtract(1, "month").daysInMonth();
        if (dayjs(productData.releaseDate).isAfter(dayjs().subtract(daysInLastMonth, "day"))) {
            return <div className={styles["product-information-banner"]}>New in stock</div>;
        }

        return null;
    }, [productData]);

    const lowestPriceVariant = useMemo<ProductVariant | undefined>(() => {
        if (productData.variants.length === 0) return undefined;
        return productData.variants.reduce(
            (current, variant) =>
                variant.price.current < current.price.current ? variant : current,
            productData.variants[0],
        );
    }, [productData]);

    if (!lowestPriceVariant) return null;

    return (
        <Link to={`/p/${productData.id}`} className={styles["product-card"]}>
            <div className={styles["product-card-image-container"]}>
                <Image className={styles["product-image"]} src={productData.images.thumb} />
                {productInformationBanner()}
            </div>
            <p className={styles["product-name"]}>{productData.name}</p>
            <div className={styles["product-card-price-container"]}>
                <span className={styles["product-price-current"]}>
                    £{(lowestPriceVariant.price.current / 100).toFixed(2)}
                </span>
                {lowestPriceVariant.price.current !== lowestPriceVariant.price.base && (
                    <>
                        <span className={styles["product-price-base"]}>
                            £{(lowestPriceVariant.price.base / 100).toFixed(2)}
                        </span>
                        <span className={styles["product-price-discount-percentage"]}>
                            {createPriceAdjustmentString(
                                lowestPriceVariant.price.current,
                                lowestPriceVariant.price.base,
                            )}
                        </span>
                    </>
                )}
            </div>
            <div className={styles["product-card-rating-container"]}>
                <Rating
                    className={styles["product-rating"]}
                    readOnly
                    count={5}
                    fractions={10}
                    value={productData.rating.value}
                    color="gold"
                    size="xs"
                />
                <div className={styles["product-rating-value"]}>
                    {productData.rating.value.toFixed(2)}
                </div>
                <div
                    className={styles["product-rating-quantity"]}
                >{`(${productData.rating.quantity})`}</div>
            </div>
        </Link>
    );
}
