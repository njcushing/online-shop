import * as HTTPMethodTypes from "../types";
import { paths } from "../schema";
import { fetcher } from "../utils/fetcher";

const endpointShort = "/categories";
const endpointFull = `/api${endpointShort}`;
const method = "get";
const contentType = "application/json";
type Responses = paths[typeof endpointFull][typeof method]["responses"];
type ResponseStatusCodes = keyof paths[typeof endpointFull][typeof method]["responses"];
type Response = Responses[ResponseStatusCodes]["content"][typeof contentType];

export const getCategories: HTTPMethodTypes.GET<undefined, Response> = async (data) => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL || "/api";

    const result = await fetcher<Response>(`${apiUrl}${endpointShort}`, {
        signal: data.abortController ? data.abortController.signal : null,
        method: method.toUpperCase(),
        mode: "cors",
        headers: { "Content-Type": contentType },
    });

    return result;
};
