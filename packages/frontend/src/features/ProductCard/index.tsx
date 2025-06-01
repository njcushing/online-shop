import React, { forwardRef, useState, useCallback, useMemo, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Image, Rating } from "@mantine/core";
import { useIntersection, useMergedRef } from "@mantine/hooks";
import { Product as ProductDataType, ProductVariant } from "@/utils/products/product";
import { settings } from "@settings";
import dayjs from "dayjs";
import { Price } from "@/features/Price";
import styles from "./index.module.css";

export type TProductCard = {
    productData: ProductDataType;
};

export const ProductCard = forwardRef<HTMLAnchorElement, TProductCard>(
    ({ productData }: TProductCard, ref) => {
        const containerRef = useRef<HTMLDivElement>(null);
        const { ref: productCardRef, entry: intersectionEntry } = useIntersection({
            root: containerRef.current,
            threshold: 0.2,
        });
        const mergedProductCardRef = useMergedRef(ref, productCardRef);
        const [visible, setVisible] = useState<boolean>(intersectionEntry?.isIntersecting || false);
        useEffect(() => {
            if (intersectionEntry?.isIntersecting) setVisible(true);
        }, [intersectionEntry?.isIntersecting]);

        const productInformationBanner = useCallback((): React.ReactNode | null => {
            const highestStockVariant = productData.variants.reduce(
                (min, variant) => (variant.stock > min ? variant.stock : min),
                productData.variants[0].stock,
            );
            const newestVariant = productData.variants.reduce(
                (curr, variant) => (variant.releaseDate > curr.releaseDate ? variant : curr),
                productData.variants[0],
            );

            // Out of stock
            if (highestStockVariant === 0) {
                return <div className={styles["product-information-banner"]}>Out of stock</div>;
            }

            // Low stock
            if (highestStockVariant <= settings.lowStockThreshold) {
                return <div className={styles["product-information-banner"]}>Low stock</div>;
            }

            // New in stock (within last month)
            const daysInLastMonth = dayjs().subtract(1, "month").daysInMonth();
            if (
                dayjs(newestVariant.releaseDate).isAfter(dayjs().subtract(daysInLastMonth, "day"))
            ) {
                return <div className={styles["product-information-banner"]}>New in stock</div>;
            }

            return null;
        }, [productData]);

        const lowestPriceVariant = useMemo<ProductVariant | undefined>(() => {
            return productData.variants.reduce(
                (current, variant) =>
                    variant.price.current < current.price.current ? variant : current,
                productData.variants[0],
            );
        }, [productData]);

        if (!lowestPriceVariant) return null;

        return (
            <Link
                to={`/p/${productData.id}/${productData.slug}`}
                className={styles["product-card"]}
                data-visible={visible}
                ref={mergedProductCardRef}
            >
                <div className={styles["product-card-image-container"]}>
                    <Image
                        className={styles["product-image"]}
                        src={productData.images.thumb.src}
                        alt={productData.images.thumb.alt}
                    />
                    {productInformationBanner()}
                </div>
                <p className={styles["product-name"]}>{productData.name.full}</p>
                <Price
                    base={lowestPriceVariant.price.base}
                    current={lowestPriceVariant.price.current}
                    size="sm"
                />
                <div className={styles["product-card-rating-container"]}>
                    <Rating
                        className={styles["product-rating"]}
                        readOnly
                        count={5}
                        fractions={10}
                        value={productData.rating.meanValue}
                        color="gold"
                        size="xs"
                    />
                    <div className={styles["product-rating-value"]}>
                        {productData.rating.meanValue.toFixed(2)}
                    </div>
                    <div
                        className={styles["product-rating-quantity"]}
                    >{`(${productData.rating.totalQuantity})`}</div>
                </div>
            </Link>
        );
    },
);

ProductCard.displayName = "ProductCard";
