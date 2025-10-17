export type ApiResponse<FuncResponse> = {
    status: number;
    message: string;
    data: FuncResponse | null;
};

export type GET<FuncParams = unknown, FuncResponse = unknown> = (
    props: {
        params?: FuncParams;
        abortController?: AbortController | null;
    },
    ...args: unknown[]
) => Promise<ApiResponse<FuncResponse>>;

export type DELETE<FuncParams, FuncResponse> = GET<FuncParams, FuncResponse>;

export type POST<FuncParams, FuncBody, FuncResponse> = {
    (
        props: {
            params?: FuncParams;
            body?: FuncBody;
            abortController?: AbortController | null;
        },
        ...args: unknown[]
    ): Promise<ApiResponse<FuncResponse>>;
};

export type PUT<FuncParams, FuncBody, FuncResponse> = POST<FuncParams, FuncBody, FuncResponse>;
