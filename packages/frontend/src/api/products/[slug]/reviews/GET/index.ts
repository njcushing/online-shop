import * as HTTPMethodTypes from "@/api/types";
import { paths } from "@/api/schema";
import { fetcher } from "@/api/utils/fetcher";

type RequestParams = paths["/api/products/{slug}/reviews"]["get"]["parameters"];

const endpoint = "/api/products/{slug}/reviews";
const method = "get";
const code = 200;
const contentType = "application/json";
type Responses = paths[typeof endpoint][typeof method]["responses"];
export type ResponseBody = Responses[typeof code]["content"][typeof contentType];

export const getReviewsByProductSlug: HTTPMethodTypes.GET<RequestParams, ResponseBody> = async (
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

    const { path, query } = params;
    const { slug } = path;
    const { page } = query;

    if (!slug) {
        return {
            success: false as const,
            status: 400,
            message: "Could not make request: no product slug provided for endpoint path.",
            error: undefined,
        };
    }

    if (!(typeof page === "number" && Number.isInteger(page) && page > 0)) {
        return {
            success: false as const,
            status: 400,
            message: "Could not make request: no page number provided for review pagination.",
            error: undefined,
        };
    }

    const urlParams = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => urlParams.append(key, `${value}`));

    const apiUrl = import.meta.env.VITE_API_BASE_URL || "/api";

    const result = await fetcher<ResponseBody>(`${apiUrl}/products/${slug}/reviews?${urlParams}`, {
        signal: data.abortController ? data.abortController.signal : null,
        method: method.toUpperCase(),
        mode: "cors",
        headers: { "Content-Type": contentType },
    });

    return result;
};
