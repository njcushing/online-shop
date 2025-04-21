import { useContext, useState } from "react";
import { RootContext } from "@/pages/Root";
import { ProductContext } from "@/pages/Product";
import { Rating, Progress, Divider, Pagination } from "@mantine/core";
import { useScrollIntoView } from "@mantine/hooks";
import { Review } from "./components/Review";
import styles from "./index.module.css";

const reviewsPerPage = 10;

export function ProductReviews() {
    const { headerInfo } = useContext(RootContext);
    const { product, reviews } = useContext(ProductContext);
    const { data: productData, awaiting } = product;

    const [page, setPage] = useState<number>(0);
    const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
        offset: 16 /* Top padding */,
        duration: 600,
        cancelable: false,
        easing: (t) => 1 - (1 - t) ** 2,
        onScrollFinish: () => {},
    });

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
            <div
                className={`${styles["overview"]} ${styles[headerInfo.open ? "shifted" : ""]}`}
                style={{
                    top: !headerInfo.open
                        ? "16px"
                        : `calc(max(${16}px, ${headerInfo.height + 16}px))`,
                }}
            >
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
                        <strong>{reviewIds.length}</strong> reviews
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
            <div className={styles["reviews"]} ref={targetRef}>
                <p className={styles["review-count"]}>{reviewIds.length} reviews</p>

                <Divider className={styles["divider"]} />

                {reviews
                    .slice(page * reviewsPerPage, page * reviewsPerPage + reviewsPerPage)
                    .map((review) => {
                        return <Review data={review} key={review.id} />;
                    })}

                <div className={styles["pagination-container"]}>
                    <Pagination
                        total={Math.floor(reviewIds.length / reviewsPerPage)}
                        withEdges
                        onChange={(newPageNo) => {
                            setPage(newPageNo);
                            scrollIntoView();
                        }}
                        classNames={{ control: styles["pagination-control"] }}
                    />
                </div>
            </div>
        </div>
    );
}
