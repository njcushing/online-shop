import { ProductReview, reviews } from "@/utils/products/product";
import * as HTTPMethodTypes from "../types";
import { saveTokenFromAPIResponse } from "../utils/saveTokenFromAPIResponse";

export const getReview: HTTPMethodTypes.GET<
    { reviewId: string },
    { review: ProductReview | null }
> = async (data, abortController = null) => {
    const token = localStorage.getItem(import.meta.env.VITE_TOKEN_LOCAL_LOCATION);
    if (!token) return { status: 400, message: "No token provided for query", data: null };

    const { reviewId } = data.params || { reviewId: null };
    if (!reviewId) return { status: 400, message: "No review id provided for query", data: null };

    const result = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/review/${reviewId}`, {
        signal: abortController ? abortController.signal : null,
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

export const mockGetReview = (reviewId: string): ProductReview | null => {
    return reviews.find((review) => review.id === reviewId) || null;
};
