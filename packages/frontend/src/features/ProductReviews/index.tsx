import { useContext } from "react";
import { ProductContext } from "@/pages/Product";
import { Rating, Progress, Divider } from "@mantine/core";
import { Review } from "./components/Review";
import styles from "./index.module.css";

export function ProductReviews() {
    const { product, reviews } = useContext(ProductContext);
    const { data: productData, awaiting } = product;

    if (awaiting || !productData) return null;

    const { rating, reviews: reviewIds } = productData;

    const mockRatingQuantities = {
        1: Math.floor(rating.quantity * 0.03 + 0.5),
        2: Math.floor(rating.quantity * 0.01 + 0.5),
        3: Math.floor(rating.quantity * 0.05 + 0.5),
        4: Math.floor(rating.quantity * 0.1 + 0.5),
        5: Math.floor(rating.quantity * 0.81 + 0.5),
    };

    return (
        <div className={styles["product-reviews"]}>
            <div className={styles["overview"]}>
                <div className={styles["product-reviews-rating-container"]}>
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
                <div className={styles["product-reviews-rating-bars"]}>
                    {Object.entries(mockRatingQuantities)
                        .reverse()
                        .map((entry) => {
                            const [key, value] = entry;

                            return (
                                <div
                                    className={styles["product-reviews-rating-bar"]}
                                    key={`product-reviews-tier-${key}-progress-bar`}
                                >
                                    <p className={styles["product-reviews-rating-tier-key"]}>
                                        {key}
                                    </p>
                                    <Progress
                                        value={(value * 100) / rating.quantity}
                                        color="gold"
                                        left={key}
                                        size="0.8rem"
                                        style={{ width: "100%" }}
                                        className={styles["progress"]}
                                    />
                                    <p className={styles["product-reviews-rating-tier-percentage"]}>
                                        {Math.floor((value * 100) / rating.quantity + 0.5)}%
                                    </p>
                                </div>
                            );
                        })}
                </div>
            </div>
            <div className={styles["reviews"]}>
                <p className={styles["review-count"]}>{reviewIds.length} reviews</p>

                <Divider className={styles["divider"]} />

                {reviews.map((review, i) => {
                    return <Review data={review} key={review.id} />;
                })}
            </div>
        </div>
    );
}
