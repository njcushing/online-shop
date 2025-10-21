import { ApiResponse, ApiResponseError } from "@/api/types";

export async function fetcher<T>(path: string, init: RequestInit): Promise<ApiResponse<T>> {
    const result = await fetch(path, init)
        .then(async (response) => {
            const { ok, status, statusText } = response;

            let data: T | ApiResponseError["error"] | null = null;
            try {
                data = await response.json();
            } catch {
                data = null;
            }

            if (ok) {
                return {
                    success: true as const,
                    status,
                    message: statusText || "OK",
                    data: data as T,
                };
            }
            return {
                success: false as const,
                status,
                message: statusText || "Request failed",
                error: data as ApiResponseError["error"],
            };
        })
        .catch((error: Error) => {
            const { message } = error;

            return {
                success: false as const,
                status: 500,
                message: message || "Internal error",
                error: undefined,
            };
        });

    return result;
}
