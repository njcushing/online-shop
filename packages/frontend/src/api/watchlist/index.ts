import { UserWatchlist, watchlists } from "@/utils/products/watchlist";
import * as HTTPMethodTypes from "../types";
import { saveTokenFromAPIResponse } from "../utils/saveTokenFromAPIResponse";

export const getWatchlist: HTTPMethodTypes.GET<undefined, UserWatchlist> = async (data) => {
    const token = localStorage.getItem(import.meta.env.VITE_TOKEN_LOCAL_LOCATION);
    if (!token) return { status: 400, message: "No token provided for query", data: null };

    const result = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/watchlist`, {
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

export const mockGetWatchlist: HTTPMethodTypes.GET<undefined, UserWatchlist> = async () => {
    await new Promise((resolve) => {
        setTimeout(resolve, 1000);
    });

    const userWatchlist = watchlists.flatMap((watchlist) => {
        const { userId, productId, variantId } = watchlist;
        return userId === "1" ? { productId, variantId } : [];
    });

    return {
        status: 200,
        message: "Success",
        data: userWatchlist,
    };
};
