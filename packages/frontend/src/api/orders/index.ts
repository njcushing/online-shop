import { PopulatedOrderData } from "@/utils/products/orders";
import * as HTTPMethodTypes from "../types";
import { getTokenFromStorage } from "../utils/getTokenFromStorage";
import { fetcher } from "../utils/fetcher";

export const getOrders: HTTPMethodTypes.GET<undefined, PopulatedOrderData[]> = async (data) => {
    const token = getTokenFromStorage();
    if (!token) return { status: 400, message: "No token provided for query", data: null };

    const result = await fetcher<PopulatedOrderData[]>(
        `${import.meta.env.VITE_SERVER_DOMAIN}/api/orders`,
        {
            signal: data.abortController ? data.abortController.signal : null,
            method: "GET",
            mode: "cors",
            headers: { Authorization: token },
        },
    );

    return result;
};
