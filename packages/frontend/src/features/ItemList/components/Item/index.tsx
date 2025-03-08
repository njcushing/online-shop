import React, { useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { Image, Rating } from "@mantine/core";
import { Product } from "@/utils/products/product";
import dayjs from "dayjs";
import styles from "./index.module.css";

const lowStockThreshold = 50;

export type TItem = {
    itemData: Product;
};

export function Item({ itemData }: TItem) {
    const itemInformationBanner = useCallback((): React.ReactNode | null => {
        // Out of stock
        if (itemData.stock === 0) {
            return <div className={styles["item-information-banner"]}>Out of stock</div>;
        }

        // Low stock
        if (itemData.stock <= lowStockThreshold) {
            return <div className={styles["item-information-banner"]}>Low stock</div>;
        }

        // New in stock (within last month)
        const daysInLastMonth = dayjs().subtract(1, "month").daysInMonth();
        if (dayjs(itemData.releaseDate).isAfter(dayjs().subtract(daysInLastMonth, "day"))) {
            return <div className={styles["item-information-banner"]}>New in stock</div>;
        }

        return null;
    }, [itemData]);

    const priceReductionString = useMemo<string>(() => {
        const reduction = (itemData.price.current / Math.max(itemData.price.base, 1)) * 100 - 100;
        return `${reduction < 0 ? "" : "+"}${reduction.toFixed(0)}%`;
    }, [itemData.price]);

    return (
        <Link to="/p/product" className={styles["item"]}>
            <div className={styles["item-image-container"]}>
                <Image className={styles["item-image"]} src={itemData.img} />
                {itemInformationBanner()}
            </div>
            <p className={styles["item-name"]}>{itemData.name}</p>
            <div className={styles["item-price-container"]}>
                <span className={styles["item-price-current"]}>
                    £{(itemData.price.current / 100).toFixed(2)}
                </span>
                {itemData.price.current !== itemData.price.base && (
                    <>
                        <span className={styles["item-price-base"]}>
                            £{(itemData.price.base / 100).toFixed(2)}
                        </span>
                        <span className={styles["item-price-discount-percentage"]}>
                            {priceReductionString}
                        </span>
                    </>
                )}
            </div>
            <div className={styles["item-rating-container"]}>
                <Rating
                    className={styles["item-rating"]}
                    readOnly
                    count={5}
                    fractions={10}
                    value={itemData.rating.value}
                    color="gold"
                    size="xs"
                />
                <div className={styles["item-rating-value"]}>
                    {itemData.rating.value.toFixed(2)}
                </div>
                <div
                    className={styles["item-rating-quantity"]}
                >{`(${itemData.rating.quantity})`}</div>
            </div>
        </Link>
    );
}
