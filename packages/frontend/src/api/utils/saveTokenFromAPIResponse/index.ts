import { z } from "zod";
import { ApiResponse } from "@/api/types";

const TokenDataSchema = z.object({ token: z.string() });

export async function saveTokenFromAPIResponse(
    response: ApiResponse<unknown>,
): Promise<{ success: true } | { success: false; message: string }> {
    if (response.data == null) return { success: false, message: "DATA_NULL" };

    const parse = TokenDataSchema.safeParse(response.data);
    if (!parse.success) return { success: false, message: "NO_TOKEN" };

    try {
        localStorage.setItem(import.meta.env.VITE_TOKEN_LOCAL_LOCATION, parse.data.token);
        return { success: true };
    } catch (err) {
        return {
            success: false,
            message: (err as DOMException).message,
        };
    }
}
