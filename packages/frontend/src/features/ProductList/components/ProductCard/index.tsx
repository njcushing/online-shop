import React, { useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { Image, Rating } from "@mantine/core";
import { Product as ProductDataType } from "@/utils/products/product";
import dayjs from "dayjs";
import styles from "./index.module.css";

const lowStockThreshold = 50;

export type TProductCard = {
    productData: ProductDataType;
};

export function ProductCard({ productData }: TProductCard) {
    const productInformationBanner = useCallback((): React.ReactNode | null => {
        // Out of stock
        if (productData.stock === 0) {
            return <div className={styles["product-information-banner"]}>Out of stock</div>;
        }

        // Low stock
        if (productData.stock <= lowStockThreshold) {
            return <div className={styles["product-information-banner"]}>Low stock</div>;
        }

        // New in stock (within last month)
        const daysInLastMonth = dayjs().subtract(1, "month").daysInMonth();
        if (dayjs(productData.releaseDate).isAfter(dayjs().subtract(daysInLastMonth, "day"))) {
            return <div className={styles["product-information-banner"]}>New in stock</div>;
        }

        return null;
    }, [productData]);

    const priceReductionString = useMemo<string>(() => {
        const reduction =
            (productData.price.current / Math.max(productData.price.base, 1)) * 100 - 100;
        return `${reduction < 0 ? "" : "+"}${reduction.toFixed(0)}%`;
    }, [productData.price]);

    return (
        <Link to={`/p/${productData.id}`} className={styles["product-card"]}>
            <div className={styles["product-card-image-container"]}>
                <Image className={styles["product-image"]} src={productData.img} />
                {productInformationBanner()}
            </div>
            <p className={styles["product-name"]}>{productData.name}</p>
            <div className={styles["product-price-container"]}>
                <span className={styles["product-price-current"]}>
                    £{(productData.price.current / 100).toFixed(2)}
                </span>
                {productData.price.current !== productData.price.base && (
                    <>
                        <span className={styles["product-price-base"]}>
                            £{(productData.price.base / 100).toFixed(2)}
                        </span>
                        <span className={styles["product-price-discount-percentage"]}>
                            {priceReductionString}
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
