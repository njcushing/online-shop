import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
    const { attemptOnMount, navigation } = opts || { attemptOnMount: false, navigation: {} };
    const { onSuccess, onFail } = navigation || { onSuccess: undefined, onFail: undefined };

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

    useEffect(() => {
        if (attempting) {
            if (abortController.current) abortController.current.abort();
            const abortControllerNew = new AbortController();
            abortController.current = abortControllerNew;

            (async () => {
                let data = {};
                let args;
                if (params) [data, ...args] = params;

                const asyncResp = await func(data, args);
                setResponse(
                    asyncResp as UnwrapPromise<
                        ReturnType<MethodTypes<FuncParams, FuncBody, FuncResponse>>
                    >,
                );

                abortController.current = null;
                setAttempting(false);
            })();
        }

        return () => {
            if (abortController.current) abortController.current.abort();
        };
    }, [params, abortController, attempting, func]);

    useEffect(() => {
        if (response) {
            const { status } = response;
            if (onSuccess && status >= 200 && status <= 299) navigate(onSuccess);
            if (onFail && (status < 200 || status > 299)) navigate(onFail);
        }
    }, [onSuccess, onFail, response, navigate]);

    useEffect(() => {
        if (!attempting && abortController.current) abortController.current.abort();
    }, [abortController, attempting]);

    return { response, setParams, attempt, abort, awaiting: attempting };
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
