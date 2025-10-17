import { ApiResponse, ApiResponseSuccess, ApiResponseError } from "@/api/types";

export async function fetcher<T>(path: string, init: RequestInit): Promise<ApiResponse<T>> {
    const result = await fetch(path, init)
        .then(async (response) => {
            const { ok, status, statusText } = response;

            let data: T | null = null;
            try {
                data = await response.json();
            } catch {
                data = null;
            }

            if (ok) {
                return {
                    success: true,
                    status,
                    message: statusText || "OK",
                    data,
                } as ApiResponseSuccess<T>;
            }
            return {
                success: false,
                status,
                message: statusText || "Request failed",
                error: data,
            } as ApiResponseError;
        })
        .catch((error: Error) => {
            const { message } = error;

            return {
                success: false,
                status: 500,
                message: message || "Internal error",
            } as ApiResponseError;
        });

    return result;
}
