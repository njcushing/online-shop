import { useContext } from "react";
import { ProductContext } from "@/pages/Product";
import { Skeleton, Rating, Progress } from "@mantine/core";
import { ResponseBody as GetProductBySlugResponseDto } from "@/api/product/[slug]/GET";
import { useQueryContexts } from "@/hooks/useQueryContexts";
import { filterOptions } from "@/features/ProductReviews";
import styles from "./index.module.css";

export type TProductRatingBars = {
    clickable?: boolean;
    onClick: (tier: (typeof filterOptions)[number]["name"]) => unknown;
};

export function ProductRatingBars({ clickable = true, onClick }: TProductRatingBars) {
    const { product, defaultData } = useContext(ProductContext);

    let productData = defaultData.product as GetProductBySlugResponseDto;

    const { data, awaitingAny } = useQueryContexts({
        contexts: [{ name: "product", context: product }],
    });

    if (!awaitingAny) {
        if (data.product) productData = data.product;
    }

    const { rating } = productData;
    const { average, total, quantities } = rating;

    return (
        <div className={styles["product-reviews-rating-container"]}>
            <div className={styles["overview"]}>
                <Skeleton visible={awaitingAny} width="min-content">
                    <div style={{ visibility: awaitingAny ? "hidden" : "initial" }}>
                        <Rating
                            classNames={{ starSymbol: styles["rating-star-symbol"] }}
                            readOnly
                            count={5}
                            fractions={10}
                            value={average}
                            color="gold"
                            size="lg"
                        />
                    </div>
                </Skeleton>
                <Skeleton visible={awaitingAny}>
                    <div
                        className={styles["product-rating-description"]}
                        style={{ visibility: awaitingAny ? "hidden" : "initial" }}
                    >
                        <strong>{average}</strong> out of <strong>5</strong> from{" "}
                        <strong>{total}</strong> reviews
                    </div>
                </Skeleton>
            </div>
            <div className={styles["product-reviews-rating-bars"]}>
                {filterOptions.reverse().map((option) => {
                    const { title, name } = option;
                    const quantity = quantities[title];

                    return (
                        <Skeleton
                            visible={awaitingAny}
                            key={`product-reviews-tier-${title}-progress-bar-skeleton`}
                        >
                            <button
                                type="button"
                                onClick={() => onClick && onClick(name)}
                                className={styles["product-reviews-rating-bar"]}
                                style={{
                                    visibility: awaitingAny ? "hidden" : "initial",
                                    pointerEvents: clickable ? "initial" : "none",
                                }}
                                disabled={!clickable}
                                tabIndex={clickable ? 0 : -1}
                                key={`product-reviews-tier-${title}-progress-bar`}
                            >
                                <p className={styles["product-reviews-rating-tier-key"]}>
                                    {Object.keys(quantities).map((k) => {
                                        return (
                                            <span
                                                className={styles["column-sizer"]}
                                                aria-hidden
                                                key={`product-reviews-tier-${title}-progress-bar-column-sizer-${k}`}
                                            >
                                                {k}
                                            </span>
                                        );
                                    })}
                                    {title}
                                </p>
                                <Progress
                                    value={awaitingAny ? 0 : (quantity * 100) / total}
                                    color="gold"
                                    left={title}
                                    size="0.8rem"
                                    transitionDuration={500}
                                    style={{ width: "100%" }}
                                    className={styles["progress"]}
                                />
                                <p className={styles["product-reviews-rating-tier-percentage"]}>
                                    {Object.entries(quantities).map(([k, v]) => {
                                        return (
                                            <span
                                                className={styles["column-sizer"]}
                                                aria-hidden
                                                key={`product-reviews-tier-${title}-progress-bar-column-sizer-${k}`}
                                            >
                                                {Math.floor((v * 100) / total + 0.5)}%
                                            </span>
                                        );
                                    })}
                                    {Math.floor((quantity * 100) / total + 0.5)}%
                                </p>
                            </button>
                        </Skeleton>
                    );
                })}
            </div>
        </div>
    );
}
