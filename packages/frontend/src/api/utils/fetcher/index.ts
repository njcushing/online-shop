import { FuncResponseObject } from "@/api/types";
import { saveTokenFromAPIResponse } from "../saveTokenFromAPIResponse";

export async function fetcher<T>(path: string, init: RequestInit): Promise<FuncResponseObject<T>> {
    const result = await fetch(path, init)
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
                status: 500,
                message: error.message,
                data: null,
            };
        });

    return result;
}
