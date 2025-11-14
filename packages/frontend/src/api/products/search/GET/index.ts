import * as HTTPMethodTypes from "@/api/types";
import { paths } from "@/api/schema";
import { fetcher } from "@/api/utils/fetcher";

type RequestParams = paths["/api/products/search"]["get"]["parameters"];

const endpoint = "/api/products/search";
const method = "get";
const code = 200;
const contentType = "application/json";
type Responses = paths[typeof endpoint][typeof method]["responses"];
export type ResponseBody = Responses[typeof code]["content"][typeof contentType];

export const getProductsBySearch: HTTPMethodTypes.GET<RequestParams, ResponseBody> = async (
    data,
) => {
    const { params } = data;

    if (!params) {
        return {
            success: false as const,
            status: 400,
            message: "Could not make request: no request parameters provided.",
            error: undefined,
        };
    }

    const { query } = params;
    const { string } = query;

    if (!string) {
        return {
            success: false as const,
            status: 400,
            message: "Could not make request: no 'string' query parameter provided.",
            error: undefined,
        };
    }

    const urlParams = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => urlParams.append(key, `${value}`));

    const apiUrl = import.meta.env.VITE_API_BASE_URL || "/api";

    const result = await fetcher<ResponseBody>(`${apiUrl}/products/search?${urlParams}`, {
        signal: data.abortController ? data.abortController.signal : null,
        method: method.toUpperCase(),
        mode: "cors",
        headers: { "Content-Type": contentType },
    });

    return result;
};
