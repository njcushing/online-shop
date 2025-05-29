import { ProductReview } from "@/utils/products/product";
import { filterOptions, sortOptions } from "@/features/ProductReviews";
import * as HTTPMethodTypes from "../types";
import { getTokenFromStorage } from "../utils/getTokenFromStorage";
import { fetcher } from "../utils/fetcher";

export const getReview: HTTPMethodTypes.GET<{ reviewId: string }, ProductReview> = async (data) => {
    const token = getTokenFromStorage();
    if (!token) return { status: 400, message: "No token provided for query", data: null };

    const { reviewId } = data.params || { reviewId: null };
    if (!reviewId) return { status: 400, message: "No review id provided for query", data: null };

    const result = await fetcher<ProductReview>(
        `${import.meta.env.VITE_SERVER_DOMAIN}/api/review/${reviewId}`,
        {
            signal: data.abortController ? data.abortController.signal : null,
            method: "GET",
            mode: "cors",
            headers: { Authorization: token },
        },
    );

    return result;
};

export const getReviews: HTTPMethodTypes.GET<
    {
        productId: string | undefined;
        filter?: (typeof filterOptions)[number];
        sort?: (typeof sortOptions)[number];
        start?: number;
        end?: number;
    },
    ProductReview[]
> = async (data) => {
    const { params } = data;

    const token = getTokenFromStorage();
    if (!token) return { status: 400, message: "No token provided for query", data: null };

    const { productId } = params || { productId: null };
    if (!productId) return { status: 400, message: "No product id provided for query", data: null };

    const urlParams = new URLSearchParams();
    Object.entries(params!).forEach(([key, value]) => urlParams.append(key, `${value}`));

    const result = await fetcher<ProductReview[]>(
        `${import.meta.env.VITE_SERVER_DOMAIN}/api/reviews?${urlParams}`,
        {
            signal: data.abortController ? data.abortController.signal : null,
            method: "GET",
            mode: "cors",
            headers: { Authorization: token },
        },
    );

    return result;
};
