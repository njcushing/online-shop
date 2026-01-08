import { useContext, useState, useEffect, useRef, useMemo } from "react";
import { RootContext } from "@/pages/Root";
import { ProductContext } from "@/pages/Product";
import { Divider, Pagination, Skeleton } from "@mantine/core";
import { useScrollIntoView } from "@mantine/hooks";
import { ResponseBody as GetProductBySlugResponseDto } from "@/api/products/[slug]/GET";
import {
    ResponseBody as GetReviewsByProductSlugResponseDto,
    getReviewsByProductSlug,
} from "@/api/products/[slug]/reviews/GET";
import { useQueryContexts } from "@/hooks/useQueryContexts";
import * as useAsync from "@/hooks/useAsync";
import { v4 as uuid } from "uuid";
import { ProductRatingBars } from "./components/ProductRatingBars";
import { Review } from "./components/Review";
import styles from "./index.module.css";

export const filterOptions: {
    title: keyof GetProductBySlugResponseDto["rating"]["quantities"];
    name: string;
}[] = [
    { title: 5, name: "rating_5" },
    { title: 4, name: "rating_4" },
    { title: 3, name: "rating_3" },
    { title: 2, name: "rating_2" },
    { title: 1, name: "rating_1" },
] as const;
export const sortOptions = [
    { title: "Highest Rating", name: "rating_desc" },
    { title: "Lowest Rating", name: "rating_asc" },
    { title: "Oldest", name: "created_asc" },
    { title: "Newest", name: "created_desc" },
] as const;

export type TProductReviews = {
    containerIsTransitioning?: boolean;
};

const pageSize = 10;

export function ProductReviews({ containerIsTransitioning }: TProductReviews) {
    const { headerInfo } = useContext(RootContext);
    const { forceClose } = headerInfo;

    const { product } = useContext(ProductContext);

    const [productData, setProductData] = useState<GetProductBySlugResponseDto | null>(null);

    const { data, awaitingAny: contextAwaitingAny } = useQueryContexts({
        contexts: [{ name: "product", context: product }],
    });

    useEffect(() => {
        if (!contextAwaitingAny && data.product) setProductData(data.product);
    }, [data.product, contextAwaitingAny]);

    const defaultReviewResponse = {
        total: 1,
        filteredCount: 1,
        reviews: [],
    } as GetReviewsByProductSlugResponseDto;
    const [reviewResponse, setReviewResponse] = useState<GetReviewsByProductSlugResponseDto | null>(
        null,
    );

    const { response, setParams, attempt, awaiting } = useAsync.GET(getReviewsByProductSlug, [{}], {
        attemptOnMount: false,
    });

    useEffect(() => {
        if (!awaiting && response.success) setReviewResponse(response.data);
    }, [response, awaiting]);

    const [filter, setFilter] = useState<(typeof filterOptions)[number]["name"] | undefined>(
        undefined,
    );
    const [sort, setSort] = useState<(typeof sortOptions)[number]["name"]>("created_desc");
    const [page, setPage] = useState<number>(1);

    useEffect(() => {
        if (contextAwaitingAny || !productData) return;

        setParams([
            {
                params: {
                    path: { slug: productData.slug },
                    query: { page, pageSize, sort, filter },
                },
            },
        ]);
        attempt();
    }, [productData, contextAwaitingAny, page, sort, filter, setParams, attempt]);

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

    const awaitingAny = useMemo(
        () => contextAwaitingAny || awaiting,
        [contextAwaitingAny, awaiting],
    );

    const { filteredCount, reviews } = reviewResponse ?? defaultReviewResponse;

    const productRatingBarsMemo = useMemo(() => {
        return (
            <ProductRatingBars
                onClick={(tier) => {
                    if (`${tier}` === filter) setFilter(undefined);
                    else setFilter(`${tier}` as (typeof filterOptions)[number]["name"]);
                    setQueueScroll(true);
                }}
            />
        );
    }, [filter]);

    const ratingFilterSelectMemo = useMemo(() => {
        return (
            <label htmlFor="filter-reviews" className={styles["label"]}>
                Rating
                <select
                    className={styles["select"]}
                    id="filter-reviews"
                    name="filter-reviews"
                    value={filter}
                    onChange={(e) => {
                        const { value } = e.target;
                        setFilter(value as (typeof filterOptions)[number]["name"]);
                        setPage(1);
                        setQueueScroll(true);
                    }}
                    disabled={awaitingAny}
                    key="sort-options"
                >
                    <option
                        className={styles["filter-reviews-option"]}
                        value={undefined}
                        key="filter-reviews-option-All"
                    >
                        All
                    </option>
                    {filterOptions.map((option) => {
                        return (
                            <option
                                className={styles["filter-reviews-option"]}
                                value={option.name}
                                key={`filter-reviews-option-${option.title}`}
                            >
                                {option.title}
                            </option>
                        );
                    })}
                </select>
            </label>
        );
    }, [filter, awaitingAny]);

    const sortSelectMemo = useMemo(() => {
        return (
            <label htmlFor="sort-reviews" className={styles["label"]}>
                Sort by
                <select
                    className={styles["select"]}
                    id="sort-reviews"
                    name="sort-reviews"
                    defaultValue={sort}
                    onChange={(e) => {
                        const { value } = e.target;
                        setSort(value as (typeof sortOptions)[number]["name"]);
                        setPage(1);
                        setQueueScroll(true);
                    }}
                    disabled={awaitingAny}
                    key="sort-options"
                >
                    {sortOptions.map((option) => {
                        return (
                            <option
                                className={styles["sort-reviews-option"]}
                                value={option.name}
                                key={`sort-reviews-option-${option.title}`}
                            >
                                {option.title}
                            </option>
                        );
                    })}
                </select>
            </label>
        );
    }, [sort, awaitingAny]);

    const reviewsMemo = useMemo(() => {
        return reviews.slice(0, pageSize).map((review) => {
            return <Review data={review} awaiting={awaitingAny} key={uuid()} />;
        });
    }, [reviews, awaitingAny]);

    const paginationMemo = useMemo(() => {
        return (
            <Pagination
                // Adding data-testid attribute to test onChange logic; Pagination component
                // doesn't have an accessible role and the page buttons' names (numbers)
                // often conflict with the ProductRatingBars component's buttons.
                data-testid="pagination"
                total={Math.ceil(filteredCount / pageSize)}
                value={page}
                withEdges
                onChange={(newPageNo) => {
                    setPage(newPageNo);
                    setQueueScroll(true);
                }}
                classNames={{ control: styles["pagination-control"] }}
            />
        );
    }, [filteredCount, page]);

    return (
        <div className={styles["product-reviews"]}>
            <div
                // Don't test element positioning
                /* v8 ignore start */

                className={`${styles["sticky-panel"]} ${styles[headerInfo.open ? "shifted" : ""]}`}
                style={(() => {
                    if (containerIsTransitioning) return { position: "initial" };
                    if (headerInfo.open) {
                        return {
                            top: `calc(max(${0}px, ${headerInfo.height}px))`,
                            maxHeight: `calc(var(--vh, 1vh) * 100 - ${headerInfo.height}px)`,
                        };
                    }
                    return { top: "0px", maxHeight: "calc(var(--vh, 1vh) * 100)" };
                })()}

                /* v8 ignore stop */
            >
                <div className={styles["sticky-panel-inner"]}>
                    {productRatingBarsMemo}

                    <div className={styles["filter-and-sort-options-container"]}>
                        {ratingFilterSelectMemo}

                        {sortSelectMemo}
                    </div>
                </div>
            </div>
            <div className={styles["reviews"]} ref={targetRef}>
                <Skeleton visible={awaitingAny}>
                    <p
                        className={styles["review-count"]}
                        style={{ visibility: awaitingAny ? "hidden" : "initial" }}
                    >
                        {filteredCount} reviews
                    </p>
                </Skeleton>

                <Divider className={styles["divider"]} />

                {reviewsMemo}

                <div className={styles["pagination-container"]}>{paginationMemo}</div>
            </div>
        </div>
    );
}
