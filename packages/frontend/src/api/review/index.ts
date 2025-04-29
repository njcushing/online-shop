import { ProductReview, reviews } from "@/utils/products/product";
import { filterOptions, sortOptions } from "@/features/ProductReviews";
import * as HTTPMethodTypes from "../types";
import { saveTokenFromAPIResponse } from "../utils/saveTokenFromAPIResponse";

export const getReview: HTTPMethodTypes.GET<
    { reviewId: string },
    { review: ProductReview }
> = async (data) => {
    const token = localStorage.getItem(import.meta.env.VITE_TOKEN_LOCAL_LOCATION);
    if (!token) return { status: 400, message: "No token provided for query", data: null };

    const { reviewId } = data.params || { reviewId: null };
    if (!reviewId) return { status: 400, message: "No review id provided for query", data: null };

    const result = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/review/${reviewId}`, {
        signal: data.abortController ? data.abortController.signal : null,
        method: "GET",
        mode: "cors",
        headers: { Authorization: token },
    })
        .then(async (response) => {
            const responseJSON = await response.json();
            saveTokenFromAPIResponse(responseJSON);

            return {
                status: responseJSON.status,
                message: responseJSON.message,
                data: responseJSON.data,
            };
        })
        .catch((error) => {
            return {
                status: error.status ? error.status : 500,
                message: error.message,
                data: null,
            };
        });
    return result;
};

export const mockGetReview: HTTPMethodTypes.GET<{ reviewId: string }, ProductReview> = async (
    data,
) => {
    const { params } = data;
    const { reviewId } = params || {};

    await new Promise((resolve) => {
        setTimeout(resolve, 1000);
    });

    if (!reviewId) {
        return {
            status: 400,
            message: "No review id provided for query",
            data: null,
        };
    }

    const foundReview = reviews.find((review) => review.id === reviewId);

    if (!foundReview) {
        return {
            status: 404,
            message: "Review not found",
            data: null,
        };
    }

    return {
        status: 200,
        message: "Success",
        data: foundReview,
    };
};

export const getReviews: HTTPMethodTypes.GET<
    {
        productId: string | undefined;
        filter?: (typeof filterOptions)[number];
        sort?: (typeof sortOptions)[number];
        start?: number;
        end?: number;
    },
    { reviews: ProductReview[] }
> = async (data) => {
    const token = localStorage.getItem(import.meta.env.VITE_TOKEN_LOCAL_LOCATION);
    if (!token) return { status: 400, message: "No token provided for query", data: null };

    const { productId } = data.params || { productId: null };
    if (!productId) return { status: 400, message: "No product id provided for query", data: null };

    const urlParams = new URLSearchParams();
    Object.entries(data).forEach(([key, value]) => urlParams.append(key, `${value}`));

    const result = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/reviews?${urlParams}`, {
        signal: data.abortController ? data.abortController.signal : null,
        method: "GET",
        mode: "cors",
        headers: { Authorization: token },
    })
        .then(async (response) => {
            const responseJSON = await response.json();
            saveTokenFromAPIResponse(responseJSON);

            return {
                status: responseJSON.status,
                message: responseJSON.message,
                data: responseJSON.data,
            };
        })
        .catch((error) => {
            return {
                status: error.status ? error.status : 500,
                message: error.message,
                data: null,
            };
        });
    return result;
};

export const mockGetReviews: HTTPMethodTypes.GET<
    {
        productId?: string;
        filter?: (typeof filterOptions)[number];
        sort?: (typeof sortOptions)[number];
        start?: number;
        end?: number;
    },
    ProductReview[]
> = async (data) => {
    const { params } = data;
    const { productId, filter, sort, start, end } = params || {};

    await new Promise((resolve) => {
        setTimeout(resolve, 1000);
    });

    if (!productId) {
        return {
            status: 400,
            message: "No product id provided for query",
            data: [],
        };
    }

    const productReviews = reviews.filter((review) => review.productId === productId);

    let filteredReviews = productReviews;
    if (filter) {
        filteredReviews = filteredReviews.filter(
            (review) => review.rating === Number.parseInt(filter, 10),
        );
    }

    const sortedReviews = filteredReviews;
    if (sort) {
        switch (sort) {
            case "Most Recent":
                sortedReviews.sort(
                    (a, b) => new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime(),
                );
                break;
            case "Highest Rating":
                // Sort by recency first
                sortedReviews.sort(
                    (a, b) => new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime(),
                );
                sortedReviews.sort((a, b) => b.rating - a.rating);
                break;
            case "Lowest Rating":
                // Sort by recency first
                sortedReviews.sort(
                    (a, b) => new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime(),
                );
                sortedReviews.sort((a, b) => a.rating - b.rating);
                break;
            default:
        }
    }

    let slicedReviews = sortedReviews;
    slicedReviews = slicedReviews.slice(start, end);

    return {
        status: 200,
        message: "Success",
        data: slicedReviews,
    };
};
