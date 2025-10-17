import { UseAsyncReturnType } from "@/hooks/useAsync";
import { DeepPartial } from "react-hook-form";
import _ from "lodash";

export const createQueryContextObject = <RequestParams, RequestBody, ResponseBody>(
    initial: DeepPartial<UseAsyncReturnType<RequestParams, RequestBody, ResponseBody>> = {},
): UseAsyncReturnType<RequestParams, RequestBody, ResponseBody> => {
    /**
     * Defining this object outside the lodash merge as the return object can't correctly parse the
     * structure of the response object for some reason, even though it's valid.
     */
    const defaultResponse: UseAsyncReturnType<
        RequestParams,
        RequestBody,
        ResponseBody
    >["response"] = {
        success: false,
        status: 0,
        message: "No request made",
    };

    return _.merge(
        {
            response: defaultResponse,
            setParams: () => {},
            attempt: () => {},
            abort: () => {},
            awaiting: false,
        },
        initial,
    );
};
