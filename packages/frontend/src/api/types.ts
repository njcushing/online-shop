import { components } from "./schema";

export const customStatusCodes = {
    aborted: -1,
    unattempted: 0,
};

export type ApiResponseBase = {
    status: number;
    message: string;
};

export type ApiResponseSuccess<ResponseBody> = ApiResponseBase & {
    success: true;
    data: ResponseBody;
};

export type ApiResponseError = ApiResponseBase & {
    success: false;
    error: components["schemas"]["Microsoft.AspNetCore.Mvc.ProblemDetails"] | undefined;
};

export type ApiResponse<ResponseBody> = ApiResponseSuccess<ResponseBody> | ApiResponseError;

export type GET<RequestParams = unknown, ResponseBody = unknown> = (
    props: {
        params?: RequestParams;
        abortController?: AbortController | null;
    },
    ...args: unknown[]
) => Promise<ApiResponse<ResponseBody>>;

export type DELETE<RequestParams, ResponseBody> = GET<RequestParams, ResponseBody>;

export type POST<RequestParams, RequestBody, ResponseBody> = {
    (
        props: {
            params?: RequestParams;
            body?: RequestBody;
            abortController?: AbortController | null;
        },
        ...args: unknown[]
    ): Promise<ApiResponse<ResponseBody>>;
};

export type PUT<RequestParams, RequestBody, ResponseBody> = POST<
    RequestParams,
    RequestBody,
    ResponseBody
>;
