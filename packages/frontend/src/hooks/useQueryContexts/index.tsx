import { useEffect, useMemo } from "react";
import { components } from "@/api/schema";
import { UseAsyncReturnType } from "../useAsync";

/**
 * The expected shape of the response body for successful requests (usually defined by a DTO type
 * derived from the OpenAPI schema) cannot be successfully inferred by the hook when using unknown
 * for the generics. Therefore, I believe it is appropriate to use 'any' here.
 */
type ContextParams = {
    name: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    context: UseAsyncReturnType<any, any, any>;
    allowErrorBeforeAttempt?: boolean;
    allowErrorWhileAwaiting?: boolean;
    markUnattemptedAsAwaiting?: boolean;
};

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
    data: Partial<{ [K in T[number] as K["name"]]: ExtractResponseData<K["context"]> }>;
    errors: Partial<{ [K in T[number] as K["name"]]: ExtractResponseError<K["context"]> | string }>;
    messages: { [K in T[number] as K["name"]]: string };
    awaitingAny: boolean;
};

const isSuccessfulResponse = (
    params: ContextParams,
): params is ContextParams & {
    context: { response: { success: true; data: unknown } };
} => params.context.response.success && params.context.response.data;

const isUnsuccessfulResponse = (
    params: ContextParams,
): params is ContextParams & {
    context: { response: { success: false; error: unknown } };
} => !params.context.response.success;

export function useQueryContexts<const T extends readonly ContextParams[]>({
    contexts,
    throwOnFailure,
}: TUseQueryContexts<T>): ReturnType<T> {
    const { data, errors, messages, awaitingAny } = useMemo<ReturnType<T>>(() => {
        return {
            data: Object.fromEntries(
                contexts
                    .filter((p) => isSuccessfulResponse(p))
                    .map(({ name, context: c }) => [name, c.response.data]),
            ) as ReturnType<T>["data"],
            errors: Object.fromEntries(
                contexts
                    .filter((p) => isUnsuccessfulResponse(p))
                    .filter((p) => p.context.response.status === 0 && p.allowErrorBeforeAttempt)
                    .filter((p) => p.context.awaiting && p.allowErrorWhileAwaiting)
                    .map(({ name, context: c }) => {
                        if (!c.response.error) return [name, c.response.message];
                        return [name, c.response.error];
                    }),
            ) as ReturnType<T>["errors"],
            messages: Object.fromEntries(
                contexts.map(({ name, context: c }) => {
                    return [name, c.response.message];
                }),
            ) as ReturnType<T>["messages"],
            awaitingAny: contexts.some(({ context: c, markUnattemptedAsAwaiting }) => {
                if (c.response.status === 0 && markUnattemptedAsAwaiting) return true;
                return c.awaiting;
            }),
        };
    }, [contexts]);

    useEffect(() => {
        const errorCount = Object.keys(errors).length;
        if (errorCount > 0 && throwOnFailure) {
            const errorStrings = Object.values(errors).map((error) => {
                if (typeof error === "string") return error;
                return (error as components["schemas"]["ProblemDetails"]).title;
            });
            throw new Error(errorStrings.join(", "));
        }
    }, [throwOnFailure, errors, messages]);

    return {
        data,
        errors,
        messages,
        awaitingAny,
    };
}
