import { UseAsyncReturnType } from "@/hooks/useAsync";

export const createQueryContextObject = <FuncParams, FuncBody, FuncResponse>(): UseAsyncReturnType<
    FuncParams,
    FuncBody,
    FuncResponse
> => {
    return {
        response: { status: 200, message: "Success", data: null },
        setParams: () => {},
        attempt: () => {},
        abort: () => {},
        awaiting: true,
    };
};
