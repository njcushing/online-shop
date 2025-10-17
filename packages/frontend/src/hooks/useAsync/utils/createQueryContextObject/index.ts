import { UseAsyncReturnType } from "@/hooks/useAsync";
import { RecursivePartial } from "@/utils/types";
import _ from "lodash";

export const createQueryContextObject = <RequestParams, RequestBody, ResponseBody>(
    initial: RecursivePartial<UseAsyncReturnType<RequestParams, RequestBody, ResponseBody>> = {},
): UseAsyncReturnType<RequestParams, RequestBody, ResponseBody> => {
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
