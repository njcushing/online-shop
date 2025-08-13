import { User } from "@/utils/schemas/user";
import { AccountCreationFormData } from "@/features/AccountCreationForm/utils/zodSchema";
import * as HTTPMethodTypes from "../types";
import { getTokenFromStorage } from "../utils/getTokenFromStorage";
import { fetcher } from "../utils/fetcher";

export const getUser: HTTPMethodTypes.GET<undefined, User> = async (data) => {
    const token = getTokenFromStorage();
    if (!token) return { status: 400, message: "No token provided for query", data: null };

    const result = await fetcher<User>(`${import.meta.env.VITE_SERVER_DOMAIN}/api`, {
        signal: data.abortController ? data.abortController.signal : null,
        method: "GET",
        mode: "cors",
        headers: { Authorization: token },
    });

    return result;
};

export const createAccount: HTTPMethodTypes.POST<undefined, AccountCreationFormData, null> = async (
    data,
) => {
    const { body } = data;

    const result = await fetcher<null>(`${import.meta.env.VITE_SERVER_DOMAIN}/api/user`, {
        signal: data.abortController ? data.abortController.signal : null,
        method: "POST",
        mode: "cors",
        body: JSON.stringify(body),
    });

    return result;
};
