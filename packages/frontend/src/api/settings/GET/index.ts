import * as HTTPMethodTypes from "@/api/types";
import { paths } from "@/api/schema";
import { fetcher } from "@/api/utils/fetcher";

const endpointShort = "/settings";
const endpointFull = `/api${endpointShort}`;
const method = "get";
const code = 200;
const contentType = "application/json";
type Responses = paths[typeof endpointFull][typeof method]["responses"];
type Response = Responses[typeof code]["content"][typeof contentType];

export const getSettings: HTTPMethodTypes.GET<undefined, Response> = async (data) => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL || "/api";

    const result = await fetcher<Response>(`${apiUrl}${endpointShort}`, {
        signal: data.abortController ? data.abortController.signal : null,
        method: method.toUpperCase(),
        mode: "cors",
        headers: { "Content-Type": contentType },
    });

    return result;
};
