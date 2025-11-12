import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import _ from "lodash";
import * as HTTPMethodTypes from "@/api/types";
import { UnwrapPromise } from "@/utils/types";

export type MethodTypes<RequestParams = unknown, RequestBody = unknown, ResponseBody = unknown> =
    | HTTPMethodTypes.GET<RequestParams, ResponseBody>
    | HTTPMethodTypes.DELETE<RequestParams, ResponseBody>
    | HTTPMethodTypes.POST<RequestParams, RequestBody, ResponseBody>
    | HTTPMethodTypes.PUT<RequestParams, RequestBody, ResponseBody>;

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

function initialResponseObject<RequestParams, RequestBody, ResponseBody>(): UnwrapPromise<
    ReturnType<MethodTypes<RequestParams, RequestBody, ResponseBody>>
> {
    return {
        success: false,
        status: HTTPMethodTypes.customStatusCodes.unattempted,
        message: "No request made",
        error: undefined,
    };
}

function awaitingResponseObject<RequestParams, RequestBody, ResponseBody>(): UnwrapPromise<
    ReturnType<MethodTypes<RequestParams, RequestBody, ResponseBody>>
> {
    return {
        success: false,
        status: HTTPMethodTypes.customStatusCodes.awaiting,
        message: "Awaiting response",
        error: undefined,
    };
}

function abortedResponseObject<RequestParams, RequestBody, ResponseBody>(): UnwrapPromise<
    ReturnType<MethodTypes<RequestParams, RequestBody, ResponseBody>>
> {
    return {
        success: false,
        status: HTTPMethodTypes.customStatusCodes.aborted,
        message: "Request aborted",
        error: undefined,
    };
}

export type UseAsyncReturnType<RequestParams, RequestBody, ResponseBody> = {
    response: UnwrapPromise<ReturnType<MethodTypes<RequestParams, RequestBody, ResponseBody>>>;
    setParams: React.Dispatch<
        React.SetStateAction<
            Parameters<MethodTypes<RequestParams, RequestBody, ResponseBody>> | undefined
        >
    >;
    attempt: () => void;
    abort: () => void;
    awaiting: boolean;
};

export function useAsyncBase<
    RequestParams = unknown,
    RequestBody = unknown,
    ResponseBody = unknown,
>(
    func: MethodTypes<RequestParams, RequestBody, ResponseBody>,
    parameters?: Parameters<MethodTypes<RequestParams, RequestBody, ResponseBody>>,
    opts?: UseAsyncOpts,
): UseAsyncReturnType<RequestParams, RequestBody, ResponseBody> {
    const { attemptOnMount, navigation } = _.merge(_.cloneDeep(defaultUseAsyncOpts), opts);
    const { onSuccess, onFail } = navigation;

    const navigate = useNavigate();

    const [params, setParams] = useState<
        Parameters<MethodTypes<RequestParams, RequestBody, ResponseBody>> | undefined
    >(parameters);
    const [response, setResponse] =
        useState<UnwrapPromise<ReturnType<MethodTypes<RequestParams, RequestBody, ResponseBody>>>>(
            initialResponseObject(),
        );
    const abortController = useRef<AbortController | null>(null);
    const [attempting, setAttempting] = useState<boolean>(attemptOnMount || false);

    const attempt = useCallback(() => {
        setResponse(awaitingResponseObject());
        setAttempting(true);
    }, []);
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
            asyncResp as UnwrapPromise<
                ReturnType<MethodTypes<RequestParams, RequestBody, ResponseBody>>
            >,
        );

        const { success } = asyncResp;
        if (onSuccess && success) navigate(onSuccess);
        if (onFail && !success) navigate(onFail);

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

export function GET<RequestParams = unknown, ResponseBody = unknown>(
    func: HTTPMethodTypes.GET<RequestParams, ResponseBody>,
    parameters?: Parameters<HTTPMethodTypes.GET<RequestParams, ResponseBody>>,
    opts?: UseAsyncOpts,
): UseAsyncReturnType<RequestParams, undefined, ResponseBody> {
    return useAsyncBase<RequestParams, undefined, ResponseBody>(func, parameters, opts);
}

export function POST<RequestParams = unknown, RequestBody = unknown, ResponseBody = unknown>(
    func: HTTPMethodTypes.POST<RequestParams, RequestBody, ResponseBody>,
    parameters?: Parameters<HTTPMethodTypes.POST<RequestParams, RequestBody, ResponseBody>>,
    opts?: UseAsyncOpts,
): UseAsyncReturnType<RequestParams, RequestBody, ResponseBody> {
    return useAsyncBase<RequestParams, RequestBody, ResponseBody>(func, parameters, opts);
}

export function PUT<RequestParams = unknown, RequestBody = unknown, ResponseBody = unknown>(
    func: HTTPMethodTypes.PUT<RequestParams, RequestBody, ResponseBody>,
    parameters?: Parameters<HTTPMethodTypes.PUT<RequestParams, RequestBody, ResponseBody>>,
    opts?: UseAsyncOpts,
): UseAsyncReturnType<RequestParams, RequestBody, ResponseBody> {
    return useAsyncBase<RequestParams, RequestBody, ResponseBody>(func, parameters, opts);
}

export function DELETE<RequestParams = unknown, ResponseBody = unknown>(
    func: HTTPMethodTypes.DELETE<RequestParams, ResponseBody>,
    parameters?: Parameters<HTTPMethodTypes.DELETE<RequestParams, ResponseBody>>,
    opts?: UseAsyncOpts,
): UseAsyncReturnType<RequestParams, undefined, ResponseBody> {
    return useAsyncBase<RequestParams, undefined, ResponseBody>(func, parameters, opts);
}

export type InferUseAsyncReturnTypeFromFunction<T> =
    T extends HTTPMethodTypes.GET<infer RequestParams, infer ResponseBody>
        ? ReturnType<typeof GET<RequestParams, ResponseBody>>
        : T extends HTTPMethodTypes.POST<infer RequestParams, infer RequestBody, infer ResponseBody>
          ? ReturnType<typeof POST<RequestParams, RequestBody, ResponseBody>>
          : T extends HTTPMethodTypes.PUT<
                  infer RequestParams,
                  infer RequestBody,
                  infer ResponseBody
              >
            ? ReturnType<typeof PUT<RequestParams, RequestBody, ResponseBody>>
            : T extends HTTPMethodTypes.DELETE<infer RequestParams, infer ResponseBody>
              ? ReturnType<typeof DELETE<RequestParams, ResponseBody>>
              : never;
