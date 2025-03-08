import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Image, Rating } from "@mantine/core";
import styles from "./index.module.css";

const mockItemData = {
    name: "Item Name",
    img: null,
    price: {
        current: 8000,
        base: 16000,
    },
    rating: {
        value: 3.6,
        quantity: 238,
    },
};

export function Item() {
    const [itemData, setItemData] = useState(mockItemData);

    const priceReductionString = useMemo<string>(() => {
        const reduction = (itemData.price.current / Math.max(itemData.price.base, 1)) * 100 - 100;
        return `${reduction < 0 ? "" : "+"}${reduction.toFixed(0)}%`;
    }, [itemData.price]);

    return (
        <Link to="/p/product" className={styles["item"]}>
            <Image className={styles["item-image"]} src={itemData.img} />
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
                />
                <div className={styles["item-rating-value"]}>{itemData.rating.value}</div>
                <div
                    className={styles["item-rating-quantity"]}
                >{`(${itemData.rating.quantity})`}</div>
            </div>
        </Link>
    );
}
