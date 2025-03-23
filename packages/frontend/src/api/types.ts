export type GET<Params, Response> = (
    data: {
        params?: Params;
    },
    abortController: AbortController | null,
    ...args: unknown[]
) => Promise<{
    status: number;
    message: string;
    data: Response | null;
}>;

export type DELETE<Params, Response> = GET<Params, Response>;

export type POST<Params, Body, Response> = (
    data: {
        params?: Params;
        body?: Body;
    },
    abortController: AbortController | null,
    ...args: unknown[]
) => Promise<{
    status: number;
    message: string;
    data?: Response;
}>;

export type PUT<Params, Body, Response> = POST<Params, Body, Response>;
