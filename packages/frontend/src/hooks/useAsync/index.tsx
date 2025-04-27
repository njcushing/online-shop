import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import * as HTTPMethodTypes from "@/api/types";
import { UnwrapPromise } from "@/utils/types";

type MethodTypes<FuncParams = unknown, FuncBody = unknown, FuncResponse = unknown> =
    | HTTPMethodTypes.GET<FuncParams, FuncResponse>
    | HTTPMethodTypes.DELETE<FuncParams, FuncResponse>
    | HTTPMethodTypes.POST<FuncParams, FuncBody, FuncResponse>
    | HTTPMethodTypes.PUT<FuncParams, FuncBody, FuncResponse>;

type GetAsyncOpts = {
    attemptOnMount?: boolean;
    navigation?: {
        onSuccess?: string;
        onFail?: string;
    };
};

export function useAsyncBase<FuncParams = unknown, FuncBody = unknown, FuncResponse = unknown>(
    func: MethodTypes<FuncParams, FuncBody, FuncResponse>,
    parameters?: Parameters<MethodTypes<FuncParams, FuncBody, FuncResponse>>,
    opts?: GetAsyncOpts,
): {
    response: UnwrapPromise<ReturnType<MethodTypes<FuncParams, FuncBody, FuncResponse>>> | null;
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
    const [response, setResp] = useState<UnwrapPromise<
        ReturnType<MethodTypes<FuncParams, FuncBody, FuncResponse>>
    > | null>(null);
    const [abortController, setAbortController] = useState<AbortController | null>(null);
    const [aborted, setAborted] = useState(false);
    const [attempting, setAttempting] = useState<boolean>(false);
    const [awaiting, setAwaiting] = useState<boolean>(attemptOnMount || false);

    const attempt = useCallback(() => setAttempting(true), []);
    const abort = useCallback(() => setAttempting(false), []);

    useEffect(() => {
        if (attemptOnMount) setAttempting(true);
    }, [attemptOnMount]);

    useEffect(() => {
        if (attempting) {
            if (abortController) {
                abortController.abort();
                setAborted(true);
            }
            const abortControllerNew = new AbortController();
            setAbortController(abortControllerNew);
            setResp(null);
            (async () => {
                let data = {};
                let args;
                if (params) [data, ...args] = params;
                const asyncResp = await func(data, args);
                setResp(
                    asyncResp as UnwrapPromise<
                        ReturnType<MethodTypes<FuncParams, FuncBody, FuncResponse>>
                    >,
                );
                setAbortController(null);
            })();
            setAttempting(false);
        }

        return () => {
            if (abortController) {
                abortController.abort();
                setAborted(true);
            }
        };
    }, [params, abortController, attempting, func]);

    useEffect(() => {
        if (response) {
            const { status } = response;
            if (onSuccess && status >= 200 && status <= 299) navigate(onSuccess);
            if (onFail && status < 200 && status > 299) navigate(onFail);
        }
    }, [onSuccess, onFail, response, navigate]);

    useEffect(() => {
        if (attempting) {
            setAwaiting(true);
            setAborted(false);
        } else if (aborted) {
            setAwaiting(false);
        }
    }, [attempting, response, aborted]);

    return { response, setParams, attempt, abort, awaiting };
}

export function GET<FuncParams = unknown, FuncResponse = unknown>(
    func: HTTPMethodTypes.GET<FuncParams, FuncResponse>,
    parameters?: Parameters<HTTPMethodTypes.GET<FuncParams, FuncResponse>>,
    opts?: GetAsyncOpts,
) {
    return useAsyncBase<FuncParams, undefined, FuncResponse>(func, parameters, opts);
}

export function POST<FuncParams = unknown, FuncBody = unknown, FuncResponse = unknown>(
    func: HTTPMethodTypes.POST<FuncParams, FuncBody, FuncResponse>,
    parameters?: Parameters<HTTPMethodTypes.POST<FuncParams, FuncBody, FuncResponse>>,
    opts?: GetAsyncOpts,
) {
    return useAsyncBase<FuncParams, FuncBody, FuncResponse>(func, parameters, opts);
}

export function PUT<FuncParams = unknown, FuncBody = unknown, FuncResponse = unknown>(
    func: HTTPMethodTypes.PUT<FuncParams, FuncBody, FuncResponse>,
    parameters?: Parameters<HTTPMethodTypes.PUT<FuncParams, FuncBody, FuncResponse>>,
    opts?: GetAsyncOpts,
) {
    return useAsyncBase<FuncParams, FuncBody, FuncResponse>(func, parameters, opts);
}

export function DELETE<FuncParams = unknown, FuncResponse = unknown>(
    func: HTTPMethodTypes.DELETE<FuncParams, FuncResponse>,
    parameters?: Parameters<HTTPMethodTypes.DELETE<FuncParams, FuncResponse>>,
    opts?: GetAsyncOpts,
) {
    return useAsyncBase<FuncParams, undefined, FuncResponse>(func, parameters, opts);
}
