import { useContext } from "react";
import { IProductContext, ProductContext } from "@/pages/Product";
import { Skeleton, Rating, Progress } from "@mantine/core";
import styles from "./index.module.css";

export type TProductRatingBars = {
    clickable?: boolean;
    onClick: (
        tier: keyof NonNullable<IProductContext["product"]["data"]>["rating"]["quantities"],
    ) => unknown;
};

export function ProductRatingBars({ clickable = true, onClick }: TProductRatingBars) {
    const { product, defaultData } = useContext(ProductContext);
    const { data, awaiting } = product;

    if (!awaiting && !data) return null;

    const { rating, reviews: reviewIds } = !awaiting
        ? data!
        : (defaultData.product as NonNullable<IProductContext["product"]["data"]>);

    return (
        <div className={styles["product-reviews-rating-container"]}>
            <div className={styles["overview"]}>
                <Skeleton visible={awaiting} width="min-content">
                    <div style={{ visibility: awaiting ? "hidden" : "initial" }}>
                        <Rating
                            classNames={{ starSymbol: styles["rating-star-symbol"] }}
                            readOnly
                            count={5}
                            fractions={10}
                            value={rating.meanValue}
                            color="gold"
                            size="lg"
                        />
                    </div>
                </Skeleton>
                <Skeleton visible={awaiting}>
                    <div
                        className={styles["product-rating-description"]}
                        style={{ visibility: awaiting ? "hidden" : "initial" }}
                    >
                        <strong>{rating.meanValue.toFixed(2)}</strong> out of <strong>5</strong>{" "}
                        from <strong>{reviewIds.length}</strong> reviews
                    </div>
                </Skeleton>
            </div>
            <div className={styles["product-reviews-rating-bars"]}>
                {Object.entries(rating.quantities)
                    .reverse()
                    .map((entry) => {
                        const [key, value] = entry;

                        return (
                            <Skeleton
                                visible={awaiting}
                                key={`product-reviews-tier-${key}-progress-bar-skeleton`}
                            >
                                <button
                                    type="button"
                                    onClick={() =>
                                        onClick &&
                                        onClick(key as unknown as keyof typeof rating.quantities)
                                    }
                                    className={styles["product-reviews-rating-bar"]}
                                    style={{
                                        visibility: awaiting ? "hidden" : "initial",
                                        pointerEvents: clickable ? "initial" : "none",
                                    }}
                                    disabled={!clickable}
                                    tabIndex={clickable ? 0 : -1}
                                    key={`product-reviews-tier-${key}-progress-bar`}
                                >
                                    <p className={styles["product-reviews-rating-tier-key"]}>
                                        {Object.keys(rating.quantities).map((k) => {
                                            return (
                                                <span
                                                    className={styles["column-sizer"]}
                                                    aria-hidden
                                                    key={`product-reviews-tier-${key}-progress-bar-column-sizer-${k}`}
                                                >
                                                    {k}
                                                </span>
                                            );
                                        })}
                                        {key}
                                    </p>
                                    <Progress
                                        value={awaiting ? 0 : (value * 100) / rating.totalQuantity}
                                        color="gold"
                                        left={key}
                                        size="0.8rem"
                                        transitionDuration={500}
                                        style={{ width: "100%" }}
                                        className={styles["progress"]}
                                    />
                                    <p className={styles["product-reviews-rating-tier-percentage"]}>
                                        {Object.entries(rating.quantities).map(([k, v]) => {
                                            return (
                                                <span
                                                    className={styles["column-sizer"]}
                                                    aria-hidden
                                                    key={`product-reviews-tier-${key}-progress-bar-column-sizer-${k}`}
                                                >
                                                    {Math.floor(
                                                        (v * 100) / rating.totalQuantity + 0.5,
                                                    )}
                                                    %
                                                </span>
                                            );
                                        })}
                                        {Math.floor((value * 100) / rating.totalQuantity + 0.5)}%
                                    </p>
                                </button>
                            </Skeleton>
                        );
                    })}
            </div>
        </div>
    );
}
