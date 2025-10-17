import { vi } from "vitest";
import fetchMock from "@fetch-mock/vitest";
import { ApiResponse } from "@/api/types";
import { fetcher } from ".";
import * as saveTokenFromAPIResponse from "../saveTokenFromAPIResponse";

const mockArgs: Parameters<typeof fetcher> = [
    "endpoint",
    {
        method: "POST",
        mode: "cors",
        headers: { Authorization: "token" },
        body: JSON.stringify({ field: "value" }),
    },
];

const mockResponse: ApiResponse<string> = {
    status: 200,
    message: "Success",
    data: "data",
};

// Mock dependencies
fetchMock.mockGlobal().route("endpoint", Promise.resolve(mockResponse), "endpointName");

describe("The 'fetcher' function...", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    test("Should call the fetch API", async () => {
        await fetcher(...mockArgs);

        const calls = fetchMock.callHistory.calls();
        expect(calls).toHaveLength(1);
    });

    test("Using the same arguments as the ones provided to itself", async () => {
        await fetcher(...mockArgs);

        const calls = fetchMock.callHistory.calls();
        const call = calls[0];
        const { args } = call;

        expect(args).toStrictEqual(mockArgs);
    });

    describe("After a successful request...", () => {
        test("Should call the 'saveTokenFromAPIResponse' function", async () => {
            const spy = vi.spyOn(saveTokenFromAPIResponse, "saveTokenFromAPIResponse");

            await fetcher(...mockArgs);

            expect(spy).toHaveBeenCalled();
        });

        test("Using the stringified JSON from the response object", async () => {
            const spy = vi.spyOn(saveTokenFromAPIResponse, "saveTokenFromAPIResponse");

            await fetcher(...mockArgs);

            expect(spy).toHaveBeenCalledWith(mockResponse);
        });

        test("Should return the response object from the fetch call", async () => {
            const result = await fetcher(...mockArgs);

            expect(result).toStrictEqual(mockResponse);
        });
    });

    describe("After a failed request...", () => {
        test("Should return a response object with status: 500, the error message, and data: null", async () => {
            fetchMock.mockGlobal().modifyRoute("endpointName", {
                response: Promise.reject(new Error("Failed request")),
            });

            const result = await fetcher(...mockArgs);

            expect(result).toStrictEqual({
                status: 500,
                message: "Failed request",
                data: null,
            });
        });
    });
});
