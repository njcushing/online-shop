import * as HTTPMethodTypes from "../types";
import { paths, components } from "../schema";
import { fetcher } from "../utils/fetcher";

type RequestParams = {
    name: components["schemas"]["Categories._Name.GET.GetCategoryByNameResponseDto"]["name"];
};

const endpoint = "/api/categories/{name}";
const method = "get";
const code = 200;
const contentType = "application/json";
type Responses = paths[typeof endpoint][typeof method]["responses"];
export type ResponseBody = Responses[typeof code]["content"][typeof contentType];

export const getCategoryByName: HTTPMethodTypes.GET<RequestParams, ResponseBody> = async (data) => {
    const { params } = data;

    if (!params || !params.name) {
        return {
            success: false as const,
            status: 400,
            message: "Could not make request: no category name provided.",
            error: undefined,
        };
    }

    const { name } = params;

    const apiUrl = import.meta.env.VITE_API_BASE_URL || "/api";

    const result = await fetcher<ResponseBody>(`${apiUrl}/categories/${name}`, {
        signal: data.abortController ? data.abortController.signal : null,
        method: method.toUpperCase(),
        mode: "cors",
        headers: { "Content-Type": contentType },
    });

    return result;
};
