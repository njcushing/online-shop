import * as HTTPMethodTypes from "../types";
import { fetcher } from "../utils/fetcher";

export const getCategories: HTTPMethodTypes.GET<undefined, unknown> = async (data) => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL || "/api";

    const result = await fetcher(`${apiUrl}/categories`, {
        signal: data.abortController ? data.abortController.signal : null,
        method: "GET",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
    });

    return result;
};
