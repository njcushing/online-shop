import { useState } from "react";
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

    return (
        <Link to="/p/product" className={styles["item"]}>
            <Image className={styles["item-image"]} src={itemData.img} />
            <p className={styles["item-name"]}>{itemData.name}</p>
            <span className={styles["item-price"]}>{itemData.price.current}</span>
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
