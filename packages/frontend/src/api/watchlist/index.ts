import { UserWatchlist } from "@/utils/products/watchlist";
import * as HTTPMethodTypes from "../types";
import { getTokenFromStorage } from "../utils/getTokenFromStorage";
import { fetcher } from "../utils/fetcher";

export const getWatchlist: HTTPMethodTypes.GET<undefined, UserWatchlist> = async (data) => {
    const token = getTokenFromStorage();
    if (!token) return { status: 400, message: "No token provided for query", data: null };

    const result = await fetcher<UserWatchlist>(
        `${import.meta.env.VITE_SERVER_DOMAIN}/api/watchlist`,
        {
            signal: data.abortController ? data.abortController.signal : null,
            method: "GET",
            mode: "cors",
            headers: { Authorization: token },
        },
    );

    return result;
};

export const updateWatchlist: HTTPMethodTypes.PUT<
    undefined,
    { variant: UserWatchlist[number] },
    UserWatchlist[]
> = async (data) => {
    const token = getTokenFromStorage();
    if (!token) return { status: 400, message: "No token provided for query", data: null };

    const { variant } = data.body || { variant: null };
    if (!variant) return { status: 400, message: "No variant provided for query", data: null };

    const result = await fetcher<UserWatchlist[]>(
        `${import.meta.env.VITE_SERVER_DOMAIN}/api/watchlist`,
        {
            signal: data.abortController ? data.abortController.signal : null,
            method: "PUT",
            mode: "cors",
            headers: { Authorization: token },
            body: JSON.stringify({ variant }),
        },
    );

    return result;
};
