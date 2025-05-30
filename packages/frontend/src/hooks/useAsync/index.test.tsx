import { Mock, vi } from "vitest";
import { render } from "@test-utils";
import _ from "lodash";
import { createContext, useMemo, act } from "react";
import { RecursivePartial } from "@/utils/types";
import { BrowserRouter } from "react-router-dom";
import { FuncResponseObject } from "@/api/types";
import * as HTTPMethodTypes from "@/api/types";
import { UseAsyncOpts } from ".";
import * as useAsync from ".";

type ResponseType = string;
const mockResponse: FuncResponseObject<ResponseType> = {
    status: 200,
    message: "Success",
    data: "value",
};
const defaultUseAsyncOpts: RecursivePartial<UseAsyncOpts> = { attemptOnMount: false };
type renderFuncArgs = {
    useAsyncOptsOverride?: UseAsyncOpts;
    initRender?: boolean;
};

describe("The 'useAsync.GET' hook...", () => {
    // Mock dependencies
    const mockGet: HTTPMethodTypes.GET<undefined, ResponseType> = vi.fn(async () => mockResponse);

    const renderFunc = async (args: renderFuncArgs = {}) => {
        const { useAsyncOptsOverride, initRender = false } = args;

        const HookContext = createContext<
            ReturnType<typeof useAsync.GET<undefined, ResponseType>> | undefined
        >(undefined);
        let HookContextValue!: ReturnType<typeof useAsync.GET<undefined, ResponseType>> | undefined;

        const mergedUseAsyncOpts = _.merge(_.cloneDeep(defaultUseAsyncOpts), useAsyncOptsOverride);

        function Component() {
            const result = useAsync.GET(mockGet, [{ params: undefined }], mergedUseAsyncOpts);

            return (
                <HookContext.Provider
                    value={useMemo(
                        () => result as ReturnType<typeof useAsync.GET<undefined, ResponseType>>,
                        [result],
                    )}
                >
                    <HookContext.Consumer>
                        {(value) => {
                            HookContextValue = value;
                            return null;
                        }}
                    </HookContext.Consumer>
                </HookContext.Provider>
            );
        }

        const componentToRender = (
            <BrowserRouter
                future={{
                    v7_startTransition: true,
                    v7_relativeSplatPath: true,
                }}
            >
                <Component />
            </BrowserRouter>
        );

        // When using initRender, must wrap 'expect' in 'await waitFor'
        const { rerender } = initRender
            ? render(componentToRender)
            : await act(() => render(componentToRender));

        return {
            rerender,
            getHookContextValue: () => HookContextValue,
            componentToRender,
        };
    };

    afterEach(() => {
        vi.restoreAllMocks();
    });

    test("Should return an 'attempt' function that, when called, should call the provided callback function", async () => {
        const { getHookContextValue } = await renderFunc();
        const { attempt } = getHookContextValue()!;

        expect(mockGet).not.toHaveBeenCalled();

        await act(async () => attempt());

        expect(mockGet).toHaveBeenCalledTimes(1);
    });

    test("Should return an 'abort' function that, when called, should abort the async callback function call", async () => {
        (mockGet as Mock).mockImplementationOnce(async () => {
            await new Promise((resolve) => {
                setTimeout(resolve, 1000);
            });
            return mockResponse;
        });

        const abortSpy = vi.spyOn(AbortController.prototype, "abort");

        const { getHookContextValue } = await renderFunc();
        const { attempt, abort } = getHookContextValue()!;

        await act(async () => attempt());
        await act(async () => abort());

        expect(abortSpy).toHaveBeenCalled();
    });

    describe("Should return a 'response' object that matches the return value of the callback function...", async () => {
        test("When 'attempt' is called and the callback function has resolved", async () => {
            const { getHookContextValue } = await renderFunc();
            const { attempt } = getHookContextValue()!;

            await act(async () => attempt());

            expect(getHookContextValue()?.response).toStrictEqual(mockResponse);
        });

        test("If the 'attemptOnMount' option it set to 'true' and the callback function has resolved", async () => {
            const { getHookContextValue } = await renderFunc({
                useAsyncOptsOverride: { attemptOnMount: true },
            });

            expect(getHookContextValue()?.response).toStrictEqual(mockResponse);
        });
    });
});

describe("The 'useAsync.POST' hook...", () => {
    // Mock dependencies
    const mockPost: HTTPMethodTypes.POST<undefined, undefined, ResponseType> = vi.fn(
        async () => mockResponse,
    );

    const renderFunc = async (args: renderFuncArgs = {}) => {
        const { useAsyncOptsOverride, initRender = false } = args;

        const HookContext = createContext<
            ReturnType<typeof useAsync.POST<undefined, undefined, ResponseType>> | undefined
        >(undefined);
        let HookContextValue!:
            | ReturnType<typeof useAsync.POST<undefined, undefined, ResponseType>>
            | undefined;

        const mergedUseAsyncOpts = _.merge(_.cloneDeep(defaultUseAsyncOpts), useAsyncOptsOverride);

        function Component() {
            const result = useAsync.POST(mockPost, [{ params: undefined }], mergedUseAsyncOpts);

            return (
                <HookContext.Provider
                    value={useMemo(
                        () =>
                            result as ReturnType<
                                typeof useAsync.POST<undefined, undefined, ResponseType>
                            >,
                        [result],
                    )}
                >
                    <HookContext.Consumer>
                        {(value) => {
                            HookContextValue = value;
                            return null;
                        }}
                    </HookContext.Consumer>
                </HookContext.Provider>
            );
        }

        const componentToRender = (
            <BrowserRouter
                future={{
                    v7_startTransition: true,
                    v7_relativeSplatPath: true,
                }}
            >
                <Component />
            </BrowserRouter>
        );

        // When using initRender, must wrap 'expect' in 'await waitFor'
        const { rerender } = initRender
            ? render(componentToRender)
            : await act(() => render(componentToRender));

        return {
            rerender,
            getHookContextValue: () => HookContextValue,
            componentToRender,
        };
    };

    afterEach(() => {
        vi.restoreAllMocks();
    });

    test("Should return an 'attempt' function that, when called, should call the provided callback function", async () => {
        const { getHookContextValue } = await renderFunc();
        const { attempt } = getHookContextValue()!;

        expect(mockPost).not.toHaveBeenCalled();

        await act(async () => attempt());

        expect(mockPost).toHaveBeenCalledTimes(1);
    });

    test("Should return an 'abort' function that, when called, should abort the async callback function call", async () => {
        (mockPost as Mock).mockImplementationOnce(async () => {
            await new Promise((resolve) => {
                setTimeout(resolve, 1000);
            });
            return mockResponse;
        });

        const abortSpy = vi.spyOn(AbortController.prototype, "abort");

        const { getHookContextValue } = await renderFunc();
        const { attempt, abort } = getHookContextValue()!;

        await act(async () => attempt());
        await act(async () => abort());

        expect(abortSpy).toHaveBeenCalled();
    });

    describe("Should return a 'response' object that matches the return value of the callback function...", async () => {
        test("When 'attempt' is called and the callback function has resolved", async () => {
            const { getHookContextValue } = await renderFunc();
            const { attempt } = getHookContextValue()!;

            await act(async () => attempt());

            expect(getHookContextValue()?.response).toStrictEqual(mockResponse);
        });

        test("If the 'attemptOnMount' option it set to 'true' and the callback function has resolved", async () => {
            const { getHookContextValue } = await renderFunc({
                useAsyncOptsOverride: { attemptOnMount: true },
            });

            expect(getHookContextValue()?.response).toStrictEqual(mockResponse);
        });
    });
});

describe("The 'useAsync.DELETE' hook...", () => {
    // Mock dependencies
    const mockDelete: HTTPMethodTypes.DELETE<undefined, ResponseType> = vi.fn(
        async () => mockResponse,
    );

    const renderFunc = async (args: renderFuncArgs = {}) => {
        const { useAsyncOptsOverride, initRender = false } = args;

        const HookContext = createContext<
            ReturnType<typeof useAsync.DELETE<undefined, ResponseType>> | undefined
        >(undefined);
        let HookContextValue!:
            | ReturnType<typeof useAsync.DELETE<undefined, ResponseType>>
            | undefined;

        const mergedUseAsyncOpts = _.merge(_.cloneDeep(defaultUseAsyncOpts), useAsyncOptsOverride);

        function Component() {
            const result = useAsync.DELETE(mockDelete, [{ params: undefined }], mergedUseAsyncOpts);

            return (
                <HookContext.Provider
                    value={useMemo(
                        () => result as ReturnType<typeof useAsync.DELETE<undefined, ResponseType>>,
                        [result],
                    )}
                >
                    <HookContext.Consumer>
                        {(value) => {
                            HookContextValue = value;
                            return null;
                        }}
                    </HookContext.Consumer>
                </HookContext.Provider>
            );
        }

        const componentToRender = (
            <BrowserRouter
                future={{
                    v7_startTransition: true,
                    v7_relativeSplatPath: true,
                }}
            >
                <Component />
            </BrowserRouter>
        );

        // When using initRender, must wrap 'expect' in 'await waitFor'
        const { rerender } = initRender
            ? render(componentToRender)
            : await act(() => render(componentToRender));

        return {
            rerender,
            getHookContextValue: () => HookContextValue,
            componentToRender,
        };
    };

    afterEach(() => {
        vi.restoreAllMocks();
    });

    test("Should return an 'attempt' function that, when called, should call the provided callback function", async () => {
        const { getHookContextValue } = await renderFunc();
        const { attempt } = getHookContextValue()!;

        expect(mockDelete).not.toHaveBeenCalled();

        await act(async () => attempt());

        expect(mockDelete).toHaveBeenCalledTimes(1);
    });

    test("Should return an 'abort' function that, when called, should abort the async callback function call", async () => {
        (mockDelete as Mock).mockImplementationOnce(async () => {
            await new Promise((resolve) => {
                setTimeout(resolve, 1000);
            });
            return mockResponse;
        });

        const abortSpy = vi.spyOn(AbortController.prototype, "abort");

        const { getHookContextValue } = await renderFunc();
        const { attempt, abort } = getHookContextValue()!;

        await act(async () => attempt());
        await act(async () => abort());

        expect(abortSpy).toHaveBeenCalled();
    });

    describe("Should return a 'response' object that matches the return value of the callback function...", async () => {
        test("When 'attempt' is called and the callback function has resolved", async () => {
            const { getHookContextValue } = await renderFunc();
            const { attempt } = getHookContextValue()!;

            await act(async () => attempt());

            expect(getHookContextValue()?.response).toStrictEqual(mockResponse);
        });

        test("If the 'attemptOnMount' option it set to 'true' and the callback function has resolved", async () => {
            const { getHookContextValue } = await renderFunc({
                useAsyncOptsOverride: { attemptOnMount: true },
            });

            expect(getHookContextValue()?.response).toStrictEqual(mockResponse);
        });
    });
});

describe("The 'useAsync.PUT' hook...", () => {
    // Mock dependencies
    const mockPut: HTTPMethodTypes.PUT<undefined, undefined, ResponseType> = vi.fn(
        async () => mockResponse,
    );

    const renderFunc = async (args: renderFuncArgs = {}) => {
        const { useAsyncOptsOverride, initRender = false } = args;

        const HookContext = createContext<
            ReturnType<typeof useAsync.PUT<undefined, undefined, ResponseType>> | undefined
        >(undefined);
        let HookContextValue!:
            | ReturnType<typeof useAsync.PUT<undefined, undefined, ResponseType>>
            | undefined;

        const mergedUseAsyncOpts = _.merge(_.cloneDeep(defaultUseAsyncOpts), useAsyncOptsOverride);

        function Component() {
            const result = useAsync.PUT(mockPut, [{ params: undefined }], mergedUseAsyncOpts);

            return (
                <HookContext.Provider
                    value={useMemo(
                        () =>
                            result as ReturnType<
                                typeof useAsync.PUT<undefined, undefined, ResponseType>
                            >,
                        [result],
                    )}
                >
                    <HookContext.Consumer>
                        {(value) => {
                            HookContextValue = value;
                            return null;
                        }}
                    </HookContext.Consumer>
                </HookContext.Provider>
            );
        }

        const componentToRender = (
            <BrowserRouter
                future={{
                    v7_startTransition: true,
                    v7_relativeSplatPath: true,
                }}
            >
                <Component />
            </BrowserRouter>
        );

        // When using initRender, must wrap 'expect' in 'await waitFor'
        const { rerender } = initRender
            ? render(componentToRender)
            : await act(() => render(componentToRender));

        return {
            rerender,
            getHookContextValue: () => HookContextValue,
            componentToRender,
        };
    };

    afterEach(() => {
        vi.restoreAllMocks();
    });

    test("Should return an 'attempt' function that, when called, should call the provided callback function", async () => {
        const { getHookContextValue } = await renderFunc();
        const { attempt } = getHookContextValue()!;

        expect(mockPut).not.toHaveBeenCalled();

        await act(async () => attempt());

        expect(mockPut).toHaveBeenCalledTimes(1);
    });

    test("Should return an 'abort' function that, when called, should abort the async callback function call", async () => {
        (mockPut as Mock).mockImplementationOnce(async () => {
            await new Promise((resolve) => {
                setTimeout(resolve, 1000);
            });
            return mockResponse;
        });

        const abortSpy = vi.spyOn(AbortController.prototype, "abort");

        const { getHookContextValue } = await renderFunc();
        const { attempt, abort } = getHookContextValue()!;

        await act(async () => attempt());
        await act(async () => abort());

        expect(abortSpy).toHaveBeenCalled();
    });

    describe("Should return a 'response' object that matches the return value of the callback function...", async () => {
        test("When 'attempt' is called and the callback function has resolved", async () => {
            const { getHookContextValue } = await renderFunc();
            const { attempt } = getHookContextValue()!;

            await act(async () => attempt());

            expect(getHookContextValue()?.response).toStrictEqual(mockResponse);
        });

        test("If the 'attemptOnMount' option it set to 'true' and the callback function has resolved", async () => {
            const { getHookContextValue } = await renderFunc({
                useAsyncOptsOverride: { attemptOnMount: true },
            });

            expect(getHookContextValue()?.response).toStrictEqual(mockResponse);
        });
    });
});
