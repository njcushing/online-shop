import { AccountCreationFormData } from "@/features/AccountCreationForm/utils/zodSchema";
import * as HTTPMethodTypes from "../types";
import { fetcher } from "../utils/fetcher";

export const createAccount: HTTPMethodTypes.POST<undefined, AccountCreationFormData, null> = async (
    data,
) => {
    const { body } = data;

    const urlParams = new URLSearchParams();
    Object.entries(data).forEach(([key, value]) => urlParams.append(key, `${value}`));

    const result = await fetcher<null>(
        `${import.meta.env.VITE_SERVER_DOMAIN}/api/reviews?${urlParams}`,
        {
            signal: data.abortController ? data.abortController.signal : null,
            method: "POST",
            mode: "cors",
            body: JSON.stringify({ body }),
        },
    );

    return result;
};
