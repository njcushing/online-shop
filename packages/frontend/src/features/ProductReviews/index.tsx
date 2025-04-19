import { useContext } from "react";
import { ProductContext } from "@/pages/Product";
import { Rating } from "@mantine/core";
import styles from "./index.module.css";

export function ProductReviews() {
    const { product } = useContext(ProductContext);
    const { data: productData, awaiting } = product;

    if (awaiting || !productData) return null;

    const { rating } = productData;

    return (
        <div className={styles["product-reviews"]}>
            <div className={styles["overview"]}>
                <Rating
                    className={styles["product-rating"]}
                    readOnly
                    count={5}
                    fractions={10}
                    value={rating.value}
                    color="gold"
                    size="lg"
                />
                <div className={styles["product-rating-description"]}>
                    <strong>{rating.value.toFixed(2)}</strong> out of <strong>5</strong> from{" "}
                    <strong>{rating.quantity}</strong> reviews
                </div>
            </div>
        </div>
    );
}
