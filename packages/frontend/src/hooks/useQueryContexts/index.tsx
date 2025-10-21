import { useEffect, useMemo } from "react";
import { UseAsyncReturnType } from "../useAsync";

/**
 * The expected shape of the response body for successful requests (usually defined by a DTO type
 * derived from the OpenAPI schema) cannot be successfully inferred by the hook when using unknown
 * for the generics. Therefore, I believe it is appropriate to use 'any' here.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ContextParams = { name: string; context: UseAsyncReturnType<any, any, any> };

export type TUseQueryContexts<T extends readonly ContextParams[]> = {
    contexts: T;
    throwOnFailure?: boolean;
};

type ExtractResponseData<T> = T extends { response: infer R }
    ? R extends { success: true; data: infer D }
        ? D
        : undefined
    : undefined;
type ExtractResponseError<T> = T extends { response: infer R }
    ? R extends { success: false; error: infer E }
        ? E
        : undefined
    : undefined;

type ReturnType<T extends readonly ContextParams[]> = {
    data: { [K in T[number] as K["name"]]: ExtractResponseData<K["context"]> | undefined };
    errors: { [K in T[number] as K["name"]]: ExtractResponseError<K["context"]> | undefined };
    messages: { [K in T[number] as K["name"]]: string };
    awaitingAny: boolean;
};

export function useQueryContexts<const T extends readonly ContextParams[]>({
    contexts,
    throwOnFailure,
}: TUseQueryContexts<T>): ReturnType<T> {
    const { data, errors, messages, awaitingAny } = useMemo<ReturnType<T>>(() => {
        return {
            data: Object.fromEntries(
                contexts.map(({ name, context: c }) => {
                    return [name, c.response.success ? c.response.data : undefined];
                }),
            ) as ReturnType<T>["data"],
            errors: Object.fromEntries(
                contexts.map(({ name, context: c }) => {
                    return [name, !c.response.success ? c.response.error : undefined];
                }),
            ) as ReturnType<T>["errors"],
            messages: Object.fromEntries(
                contexts.map(({ name, context: c }) => {
                    return [name, c.response.message];
                }),
            ) as ReturnType<T>["messages"],
            awaitingAny: contexts.some(({ context: c }) => c.awaiting),
        };
    }, [contexts]);

    useEffect(() => {
        const errorCount = Object.values(errors).flatMap((e) => e || []).length;
        const messageStrings = Object.values(messages).flatMap((m) => m || []);
        if (errorCount > 0 && throwOnFailure && messageStrings.length > 0) {
            throw new Error(messageStrings.join(", "));
        }
    }, [throwOnFailure, errors, messages]);

    return {
        data,
        errors,
        messages,
        awaitingAny,
    };
}
