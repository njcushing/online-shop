export type ApiResponse<ResponseBody> = {
    status: number;
    message: string;
    data: ResponseBody | null;
};

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
