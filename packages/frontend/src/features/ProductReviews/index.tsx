import { useContext, useState, useEffect, useRef, useMemo } from "react";
import { RootContext } from "@/pages/Root";
import { IProductContext, ProductContext } from "@/pages/Product";
import { Divider, Pagination, Skeleton } from "@mantine/core";
import { useScrollIntoView } from "@mantine/hooks";
import { mockGetReviews } from "@/api/mocks";
import { ProductReview } from "@/utils/products/product";
import * as useAsync from "@/hooks/useAsync";
import { v4 as uuid } from "uuid";
import { ProductRatingBars } from "./components/ProductRatingBars";
import { Review } from "./components/Review";
import styles from "./index.module.css";

export const filterOptions = ["All", "5", "4", "3", "2", "1"] as const;
export const sortOptions = ["Most Recent", "Highest Rating", "Lowest Rating"] as const;

const reviewsPerPage = 10;

export function ProductReviews() {
    const { headerInfo } = useContext(RootContext);
    const { forceClose } = headerInfo;

    const { product, defaultData } = useContext(ProductContext);
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

    // Don't test auto-scroll logic
    /* v8 ignore start */

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

        // Ensure Review components' container repaints before smooth scroll to prevent jumping
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

    /* v8 ignore stop */

    if (!awaitingProductData && !productData) return null;

    const { rating, reviews: reviewIds } = !awaitingProductData
        ? productData!
        : (defaultData.product as NonNullable<IProductContext["product"]["data"]>);

    const reviewQuantity =
        filter === "All"
            ? reviewIds.length
            : rating.quantities[Number.parseInt(filter, 10) as keyof typeof rating.quantities];

    return (
        <div className={styles["product-reviews"]}>
            <div
                // Don't test element positioning
                /* v8 ignore start */

                className={`${styles["sticky-panel"]} ${styles[headerInfo.open ? "shifted" : ""]}`}
                style={{
                    top: !headerInfo.open
                        ? "16px"
                        : `calc(max(${16}px, ${headerInfo.height + 16}px))`,
                }}

                /* v8 ignore stop */
            >
                <ProductRatingBars
                    onClick={(tier) => {
                        if (`${tier}` === filter) setFilter("All");
                        else setFilter(`${tier}` as (typeof filterOptions)[number]);
                        setQueueScroll(true);
                    }}
                />
                <div className={styles["filter-and-sort-options-container"]}>
                    <label htmlFor="filter-reviews" className={styles["label"]}>
                        Rating
                        <select
                            className={styles["select"]}
                            id="filter-reviews"
                            name="filter-reviews"
                            value={filter}
                            onChange={(e) => {
                                const { value } = e.target;
                                setFilter(value as (typeof filterOptions)[number]);
                                setPage(0);
                                setQueueScroll(true);
                            }}
                            disabled={awaitingProductData}
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
                            defaultValue={sort}
                            onChange={(e) => {
                                const { value } = e.target;
                                setSort(value as (typeof sortOptions)[number]);
                                setPage(0);
                                setQueueScroll(true);
                            }}
                            disabled={awaitingProductData}
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
                <Skeleton visible={awaitingProductData}>
                    <p
                        className={styles["review-count"]}
                        style={{ visibility: awaitingProductData ? "hidden" : "initial" }}
                    >
                        {reviewQuantity} reviews
                    </p>
                </Skeleton>

                <Divider className={styles["divider"]} />

                {!awaiting
                    ? reviews.slice(0, reviewsPerPage).map((review) => {
                          return <Review data={review} key={review.id} />;
                      })
                    : Array.from({
                          length: Math.min(reviewQuantity - page * reviewsPerPage, reviewsPerPage),
                      }).map(() => {
                          return <Review awaiting key={uuid()} />;
                      })}

                <div className={styles["pagination-container"]}>
                    <Pagination
                        // Adding data-testid attribute to test onChange logic; Pagination component
                        // doesn't have an accessible role and the page buttons' names (numbers)
                        // often conflict with the ProductRatingBars component's buttons.
                        data-testid="pagination"
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
