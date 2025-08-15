import { UseAsyncReturnType } from "@/hooks/useAsync";
import { RecursivePartial } from "@/utils/types";
import _ from "lodash";

export const createQueryContextObject = <FuncParams, FuncBody, FuncResponse>(
    initial: RecursivePartial<UseAsyncReturnType<FuncParams, FuncBody, FuncResponse>> = {},
): UseAsyncReturnType<FuncParams, FuncBody, FuncResponse> => {
    return _.merge(
        {
            response: { status: 200, message: "Success", data: null },
            setParams: () => {},
            attempt: () => {},
            abort: () => {},
            awaiting: false,
        },
        initial,
    );
};
