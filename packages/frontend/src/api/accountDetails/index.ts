import { AccountDetails } from "@/utils/schemas/account";
import * as HTTPMethodTypes from "../types";
import { getTokenFromStorage } from "../utils/getTokenFromStorage";
import { fetcher } from "../utils/fetcher";

export const getAccountDetails: HTTPMethodTypes.GET<undefined, AccountDetails> = async (data) => {
    const token = getTokenFromStorage();
    if (!token) return { status: 400, message: "No token provided for query", data: null };

    const result = await fetcher<AccountDetails>(
        `${import.meta.env.VITE_SERVER_DOMAIN}/api/account-details`,
        {
            signal: data.abortController ? data.abortController.signal : null,
            method: "GET",
            mode: "cors",
            headers: { Authorization: token },
        },
    );

    return result;
};
