import * as useAsync from "@/hooks/useAsync";
import { customStatusCodes } from "@/api/types";

/**
 * 'any' is appropriate here: all 'UseAsyncReturnType'-type objects will contain the necessary
 * fields; the specific shapes of the RequestParams, RequestBody and ResponseBody are irrelevant
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const getAnyBadResponse = (
    ...responses: useAsync.UseAsyncReturnType<any, any, any>[]
): useAsync.UseAsyncReturnType<any, any, any> | undefined => {
    return responses.find(
        (r) =>
            !r.response.success &&
            r.response.status !== customStatusCodes.unattempted &&
            r.response.status !== customStatusCodes.awaiting,
    );
};
/* eslint-enable @typescript-eslint/no-explicit-any */
