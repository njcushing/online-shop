import { FuncResponseObject } from "@/api/types";

export async function fetcher<T>(path: string, init: RequestInit): Promise<FuncResponseObject<T>> {
    const result = await fetch(path, init)
        .then(async (response) => {
            const { status, statusText } = response;

            let data: T | null = null;
            try {
                data = await response.json();
            } catch {
                data = null;
            }

            return {
                status,
                message: statusText || (response.ok ? "OK" : "Request failed"),
                data,
            };
        })
        .catch((error) => {
            return {
                status: 500,
                message: error.message || "Network error",
                data: null,
            };
        });

    return result;
}
