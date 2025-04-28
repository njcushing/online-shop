import { useContext, useState, useEffect, useRef, useMemo } from "react";
import { RootContext } from "@/pages/Root";
import { ProductContext } from "@/pages/Product";
import { Rating, Progress, Divider, Pagination } from "@mantine/core";
import { useScrollIntoView } from "@mantine/hooks";
import { mockGetReviews } from "@/api/review";
import { ProductReview } from "@/utils/products/product";
import * as useAsync from "@/hooks/useAsync";
import { v4 as uuid } from "uuid";
import { Review } from "./components/Review";
import styles from "./index.module.css";

export const filterOptions = ["All", "5", "4", "3", "2", "1"] as const;
export const sortOptions = ["Most Recent", "Highest Rating", "Lowest Rating"] as const;

const reviewsPerPage = 10;

export function ProductReviews() {
    const { headerInfo } = useContext(RootContext);
    const { forceClose } = headerInfo;

    const { product } = useContext(ProductContext);
    const { data: productData, awaiting: awaitingProductData } = product;

    const [filter, setFilter] = useState<(typeof filterOptions)[number]>("All");
    const [sort, setSort] = useState<(typeof sortOptions)[number]>("Most Recent");
    const [page, setPage] = useState<number>(0);

    const { response, setParams, attempt, awaiting } = useAsync.GET(
        mockGetReviews,
        [
            {
                params: {
                    productId: productData?.id,
                    filter: filter === "All" ? undefined : filter,
                    sort,
                    start: page * reviewsPerPage,
                    end: page * reviewsPerPage + reviewsPerPage,
                },
            },
        ],
        { attemptOnMount: false },
    );

    useMemo(() => {
        const newFunctionParams = {
            productId: productData?.id,
            filter: filter === "All" ? undefined : filter,
            sort,
            start: page * reviewsPerPage,
            end: page * reviewsPerPage + reviewsPerPage,
        };
        setParams([{ params: newFunctionParams }]);
        attempt();
        return newFunctionParams;
    }, [productData, filter, sort, page, setParams, attempt]);

    const reviews = useMemo<ProductReview[]>(() => {
        if (response && response.data) return response.data;
        return [];
    }, [response]);

    const forceCloseId = useRef<string>(uuid());
    const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
        offset: 16 /* Top padding */,
        duration: 600,
        cancelable: false,
        easing: (t) => 1 - (1 - t) ** 2,
        onScrollFinish: () => forceClose(false, forceCloseId.current),
    });
    const [queueScroll, setQueueScroll] = useState<boolean>(false);
    useEffect(() => {
        if (!queueScroll) return undefined;

        // Ensure Review components' container repaint before smooth scroll to prevent jumping
        const rafId = requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                scrollIntoView();
                forceClose(true, forceCloseId.current);
                setQueueScroll(false);
            });
        });

        return () => {
            cancelAnimationFrame(rafId);
        };
    }, [forceClose, scrollIntoView, queueScroll]);

    useEffect(() => {
        const { current } = forceCloseId;
        return () => {
            forceClose(false, current);
        };
    }, [forceClose]);

    if (awaitingProductData || !productData) return null;

    const { rating, reviews: reviewIds } = productData;

    const reviewQuantity =
        filter === "All"
            ? reviewIds.length
            : rating.quantities[Number.parseInt(filter, 10) as keyof typeof rating.quantities];

    return (
        <div className={styles["product-reviews"]}>
            <div
                className={`${styles["sticky-panel"]} ${styles[headerInfo.open ? "shifted" : ""]}`}
                style={{
                    top: !headerInfo.open
                        ? "16px"
                        : `calc(max(${16}px, ${headerInfo.height + 16}px))`,
                }}
            >
                <div className={styles["overview"]}>
                    <div className={styles["product-reviews-rating-container"]}>
                        <Rating
                            classNames={{ starSymbol: styles["rating-star-symbol"] }}
                            readOnly
                            count={5}
                            fractions={10}
                            value={rating.meanValue}
                            color="gold"
                            size="lg"
                        />
                        <div className={styles["product-rating-description"]}>
                            <strong>{rating.meanValue.toFixed(2)}</strong> out of <strong>5</strong>{" "}
                            from <strong>{reviewIds.length}</strong> reviews
                        </div>
                    </div>
                    <div className={styles["product-reviews-rating-bars"]}>
                        {Object.entries(rating.quantities)
                            .reverse()
                            .map((entry) => {
                                const [key, value] = entry;

                                return (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (key === filter) setFilter("All");
                                            else setFilter(key as (typeof filterOptions)[number]);
                                        }}
                                        className={styles["product-reviews-rating-bar"]}
                                        key={`product-reviews-tier-${key}-progress-bar`}
                                    >
                                        <p className={styles["product-reviews-rating-tier-key"]}>
                                            {Object.keys(rating.quantities).map((k) => {
                                                return (
                                                    <span
                                                        className={styles["column-sizer"]}
                                                        aria-hidden
                                                        key={`product-reviews-tier-${key}-aaprogress-bar-column-sizer-${k}`}
                                                    >
                                                        {k}
                                                    </span>
                                                );
                                            })}
                                            {key}
                                        </p>
                                        <Progress
                                            value={(value * 100) / rating.totalQuantity}
                                            color="gold"
                                            left={key}
                                            size="0.8rem"
                                            style={{ width: "100%" }}
                                            className={styles["progress"]}
                                        />
                                        <p
                                            className={
                                                styles["product-reviews-rating-tier-percentage"]
                                            }
                                        >
                                            {Object.values(rating.quantities).map((v) => {
                                                return (
                                                    <span
                                                        className={styles["column-sizer"]}
                                                        aria-hidden
                                                        key={`product-reviews-tier-${key}-bbprogress-bar-column-sizer-${v}`}
                                                    >
                                                        {Math.floor(
                                                            (v * 100) / rating.totalQuantity + 0.5,
                                                        )}
                                                        %
                                                    </span>
                                                );
                                            })}
                                            {Math.floor((value * 100) / rating.totalQuantity + 0.5)}
                                            %
                                        </p>
                                    </button>
                                );
                            })}
                    </div>
                </div>
                <div className={styles["filter-and-sort-options-container"]}>
                    <label htmlFor="filter-reviews" className={styles["label"]}>
                        Rating
                        <select
                            className={styles["select"]}
                            id="filter-reviews"
                            name="filter-reviews"
                            aria-label="filter-reviews"
                            value={filter}
                            onChange={(e) => {
                                const { value } = e.target;
                                setFilter(value as (typeof filterOptions)[number]);
                                setPage(0);
                                setQueueScroll(true);
                            }}
                            key="sort-options"
                        >
                            {filterOptions.map((option) => {
                                return (
                                    <option
                                        className={styles["filter-reviews-option"]}
                                        value={option}
                                        key={`filter-reviews-option-${option}`}
                                    >
                                        {option}
                                    </option>
                                );
                            })}
                        </select>
                    </label>
                    <label htmlFor="sort-reviews" className={styles["label"]}>
                        Sort by
                        <select
                            className={styles["select"]}
                            id="sort-reviews"
                            name="sort-reviews"
                            aria-label="sort-reviews"
                            defaultValue={sort}
                            onChange={(e) => {
                                const { value } = e.target;
                                setSort(value as (typeof sortOptions)[number]);
                                setPage(0);
                                setQueueScroll(true);
                            }}
                            key="sort-options"
                        >
                            {sortOptions.map((option) => {
                                return (
                                    <option
                                        className={styles["sort-reviews-option"]}
                                        value={option}
                                        key={`sort-reviews-option-${option}`}
                                    >
                                        {option}
                                    </option>
                                );
                            })}
                        </select>
                    </label>
                </div>
            </div>
            <div className={styles["reviews"]} ref={targetRef}>
                <p className={styles["review-count"]}>{reviewQuantity} reviews</p>

                <Divider className={styles["divider"]} />

                {!awaiting
                    ? reviews.map((review) => {
                          return <Review data={review} key={review.id} />;
                      })
                    : Array.from({
                          length: Math.min(reviewQuantity - page * reviewsPerPage, reviewsPerPage),
                      }).map(() => {
                          return <Review awaiting key={uuid()} />;
                      })}

                <div className={styles["pagination-container"]}>
                    <Pagination
                        total={Math.ceil(reviewQuantity / reviewsPerPage)}
                        value={page + 1}
                        withEdges
                        onChange={(newPageNo) => {
                            setPage(newPageNo - 1);
                            setQueueScroll(true);
                        }}
                        classNames={{ control: styles["pagination-control"] }}
                    />
                </div>
            </div>
        </div>
    );
}
