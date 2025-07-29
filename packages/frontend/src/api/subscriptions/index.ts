import { PopulatedSubscriptionData } from "@/utils/products/subscriptions";
import * as HTTPMethodTypes from "../types";
import { getTokenFromStorage } from "../utils/getTokenFromStorage";
import { fetcher } from "../utils/fetcher";

export const getSubscriptions: HTTPMethodTypes.GET<undefined, PopulatedSubscriptionData[]> = async (
    data,
) => {
    const token = getTokenFromStorage();
    if (!token) return { status: 400, message: "No token provided for query", data: null };

    const result = await fetcher<PopulatedSubscriptionData[]>(
        `${import.meta.env.VITE_SERVER_DOMAIN}/api/subscriptions`,
        {
            signal: data.abortController ? data.abortController.signal : null,
            method: "GET",
            mode: "cors",
            headers: { Authorization: token },
        },
    );

    return result;
};
