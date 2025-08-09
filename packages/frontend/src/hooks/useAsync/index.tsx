import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import _ from "lodash";
import * as HTTPMethodTypes from "@/api/types";
import { UnwrapPromise } from "@/utils/types";

type MethodTypes<FuncParams = unknown, FuncBody = unknown, FuncResponse = unknown> =
    | HTTPMethodTypes.GET<FuncParams, FuncResponse>
    | HTTPMethodTypes.DELETE<FuncParams, FuncResponse>
    | HTTPMethodTypes.POST<FuncParams, FuncBody, FuncResponse>
    | HTTPMethodTypes.PUT<FuncParams, FuncBody, FuncResponse>;

export type UseAsyncOpts = {
    attemptOnMount?: boolean;
    navigation?: {
        onSuccess?: string;
        onFail?: string;
    };
};

const defaultUseAsyncOpts: Required<UseAsyncOpts> = {
    attemptOnMount: false,
    navigation: { onSuccess: undefined, onFail: undefined },
};

function initialResponseObject<FuncParams, FuncBody, FuncResponse>(): UnwrapPromise<
    ReturnType<MethodTypes<FuncParams, FuncBody, FuncResponse>>
> {
    return { status: 200, message: "Awaiting attempt", data: null };
}

function abortedResponseObject<FuncParams, FuncBody, FuncResponse>(): UnwrapPromise<
    ReturnType<MethodTypes<FuncParams, FuncBody, FuncResponse>>
> {
    return { status: 299, message: "Request aborted", data: null };
}

export function useAsyncBase<FuncParams = unknown, FuncBody = unknown, FuncResponse = unknown>(
    func: MethodTypes<FuncParams, FuncBody, FuncResponse>,
    parameters?: Parameters<MethodTypes<FuncParams, FuncBody, FuncResponse>>,
    opts?: UseAsyncOpts,
): {
    response: UnwrapPromise<ReturnType<MethodTypes<FuncParams, FuncBody, FuncResponse>>>;
    setParams: React.Dispatch<
        React.SetStateAction<
            Parameters<MethodTypes<FuncParams, FuncBody, FuncResponse>> | undefined
        >
    >;
    attempt: () => void;
    abort: () => void;
    awaiting: boolean;
} {
    const { attemptOnMount, navigation } = _.merge(_.cloneDeep(defaultUseAsyncOpts), opts);
    const { onSuccess, onFail } = navigation;

    const navigate = useNavigate();

    const [params, setParams] = useState<
        Parameters<MethodTypes<FuncParams, FuncBody, FuncResponse>> | undefined
    >(parameters);
    const [response, setResponse] =
        useState<UnwrapPromise<ReturnType<MethodTypes<FuncParams, FuncBody, FuncResponse>>>>(
            initialResponseObject(),
        );
    const abortController = useRef<AbortController | null>(null);
    const [attempting, setAttempting] = useState<boolean>(attemptOnMount || false);

    const attempt = useCallback(() => setAttempting(true), []);
    const abort = useCallback(() => {
        if (abortController.current) {
            abortController.current.abort();
            setResponse(abortedResponseObject());
        }
        setAttempting(false);
    }, [abortController]);

    const request = useCallback(async () => {
        let data = {};
        let args;
        if (params) [data, ...args] = params;

        const asyncResp = await func(data, args);
        setResponse(
            asyncResp as UnwrapPromise<ReturnType<MethodTypes<FuncParams, FuncBody, FuncResponse>>>,
        );

        const { status } = asyncResp;
        if (onSuccess && status >= 200 && status <= 299) navigate(onSuccess);
        if (onFail && (status < 200 || status > 299)) navigate(onFail);

        abortController.current = null;
        setAttempting(false);
    }, [func, onSuccess, onFail, navigate, params]);

    useEffect(() => {
        if (attempting) {
            if (abortController.current) abortController.current.abort();
            const abortControllerNew = new AbortController();
            abortController.current = abortControllerNew;

            request();
        }

        return () => {
            if (abortController.current) abortController.current.abort();
        };
    }, [attempting, request]);

    return useMemo(
        () => ({
            response,
            setParams,
            attempt,
            abort,
            awaiting: attempting,
        }),
        [response, setParams, attempt, abort, attempting],
    );
}

export function GET<FuncParams = unknown, FuncResponse = unknown>(
    func: HTTPMethodTypes.GET<FuncParams, FuncResponse>,
    parameters?: Parameters<HTTPMethodTypes.GET<FuncParams, FuncResponse>>,
    opts?: UseAsyncOpts,
) {
    return useAsyncBase<FuncParams, undefined, FuncResponse>(func, parameters, opts);
}

export function POST<FuncParams = unknown, FuncBody = unknown, FuncResponse = unknown>(
    func: HTTPMethodTypes.POST<FuncParams, FuncBody, FuncResponse>,
    parameters?: Parameters<HTTPMethodTypes.POST<FuncParams, FuncBody, FuncResponse>>,
    opts?: UseAsyncOpts,
) {
    return useAsyncBase<FuncParams, FuncBody, FuncResponse>(func, parameters, opts);
}

export function PUT<FuncParams = unknown, FuncBody = unknown, FuncResponse = unknown>(
    func: HTTPMethodTypes.PUT<FuncParams, FuncBody, FuncResponse>,
    parameters?: Parameters<HTTPMethodTypes.PUT<FuncParams, FuncBody, FuncResponse>>,
    opts?: UseAsyncOpts,
) {
    return useAsyncBase<FuncParams, FuncBody, FuncResponse>(func, parameters, opts);
}

export function DELETE<FuncParams = unknown, FuncResponse = unknown>(
    func: HTTPMethodTypes.DELETE<FuncParams, FuncResponse>,
    parameters?: Parameters<HTTPMethodTypes.DELETE<FuncParams, FuncResponse>>,
    opts?: UseAsyncOpts,
) {
    return useAsyncBase<FuncParams, undefined, FuncResponse>(func, parameters, opts);
}
