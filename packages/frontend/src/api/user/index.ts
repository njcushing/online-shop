import { AccountCreationFormData } from "@/features/AccountCreationForm/utils/zodSchema";
import * as HTTPMethodTypes from "../types";
import { fetcher } from "../utils/fetcher";

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
