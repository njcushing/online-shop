import { Mock, vi } from "vitest";
import { render } from "@test-utils";
import _ from "lodash";
import { createContext, useMemo, act } from "react";
import { RecursivePartial } from "@/utils/types";
import { BrowserRouter } from "react-router-dom";
import { ApiResponse } from "@/api/types";
import * as HTTPMethodTypes from "@/api/types";
import { UseAsyncOpts } from ".";
import * as useAsync from ".";

type ResponseType = string;
const mockResponse: ApiResponse<ResponseType> = {
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

        function Component({ opts }: { opts: renderFuncArgs["useAsyncOptsOverride"] }) {
            const mergedUseAsyncOpts = _.merge(_.cloneDeep(defaultUseAsyncOpts), opts);

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

        function BrowserRouterWrapper({ opts }: { opts: renderFuncArgs["useAsyncOptsOverride"] }) {
            return (
                <BrowserRouter
                    future={{
                        v7_startTransition: true,
                        v7_relativeSplatPath: true,
                    }}
                >
                    <Component opts={opts} />
                </BrowserRouter>
            );
        }

        // When using initRender, must wrap 'expect' in 'await waitFor'
        const { rerender } = initRender
            ? render(<BrowserRouterWrapper opts={useAsyncOptsOverride} />)
            : await act(() => render(<BrowserRouterWrapper opts={useAsyncOptsOverride} />));

        return {
            rerenderFunc: (newArgs: renderFuncArgs) => {
                rerender(<BrowserRouterWrapper opts={newArgs.useAsyncOptsOverride} />);
            },
            getHookContextValue: () => HookContextValue,
            component: <BrowserRouterWrapper opts={useAsyncOptsOverride} />,
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

    describe("Should return a 'response' object that matches the return value of the callback function...", () => {
        test("When 'attempt' is called and the callback function has resolved", async () => {
            const { getHookContextValue } = await renderFunc();
            const { attempt } = getHookContextValue()!;

            await act(async () => attempt());

            expect(getHookContextValue()?.response).toStrictEqual(mockResponse);
        });

        test("If the 'attemptOnMount' option is set to 'true' and the callback function has resolved", async () => {
            const { getHookContextValue } = await renderFunc({
                useAsyncOptsOverride: { attemptOnMount: true },
            });

            expect(getHookContextValue()?.response).toStrictEqual(mockResponse);
        });
    });

    describe("Should redirect the user...", () => {
        test("To the URL path provided in the 'onSuccess' prop if the response contains a status code indicating success", async () => {
            window.history.pushState({}, "", "/");

            const { getHookContextValue } = await renderFunc({
                useAsyncOptsOverride: { navigation: { onSuccess: "/success" } },
            });
            const { attempt } = getHookContextValue()!;

            await act(async () => attempt());

            expect(window.location.pathname).toBe("/success");
        });

        test("To the URL path provided in the 'onFail' prop if the response contains a status code indicating failure", async () => {
            window.history.pushState({}, "", "/");

            (mockGet as Mock).mockImplementationOnce(async () => {
                const adjustedMockResponse = structuredClone(mockResponse);
                adjustedMockResponse.status = 404;
                return adjustedMockResponse;
            });

            const { getHookContextValue } = await renderFunc({
                useAsyncOptsOverride: { navigation: { onFail: "/fail" } },
            });
            const { attempt } = getHookContextValue()!;

            await act(async () => attempt());

            expect(window.location.pathname).toBe("/fail");
        });
    });

    test("Should abort the existing function if the callback function, its parameters, or the redirect URL paths are adjusted", async () => {
        (mockGet as Mock).mockImplementationOnce(async () => {
            await new Promise((resolve) => {
                setTimeout(resolve, 1000);
            });
            return mockResponse;
        });

        const abortSpy = vi.spyOn(AbortController.prototype, "abort");

        const { rerenderFunc, getHookContextValue } = await renderFunc();
        const { attempt } = getHookContextValue()!;

        await act(async () => attempt());

        await act(async () => {
            rerenderFunc({ useAsyncOptsOverride: { navigation: { onSuccess: "/" } } });
        });

        expect(abortSpy).toHaveBeenCalled();
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

        function Component({ opts }: { opts: renderFuncArgs["useAsyncOptsOverride"] }) {
            const mergedUseAsyncOpts = _.merge(_.cloneDeep(defaultUseAsyncOpts), opts);

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

        function BrowserRouterWrapper({ opts }: { opts: renderFuncArgs["useAsyncOptsOverride"] }) {
            return (
                <BrowserRouter
                    future={{
                        v7_startTransition: true,
                        v7_relativeSplatPath: true,
                    }}
                >
                    <Component opts={opts} />
                </BrowserRouter>
            );
        }

        // When using initRender, must wrap 'expect' in 'await waitFor'
        const { rerender } = initRender
            ? render(<BrowserRouterWrapper opts={useAsyncOptsOverride} />)
            : await act(() => render(<BrowserRouterWrapper opts={useAsyncOptsOverride} />));

        return {
            rerenderFunc: (newArgs: renderFuncArgs) => {
                rerender(<BrowserRouterWrapper opts={newArgs.useAsyncOptsOverride} />);
            },
            getHookContextValue: () => HookContextValue,
            component: <BrowserRouterWrapper opts={useAsyncOptsOverride} />,
        };
    };

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

    describe("Should return a 'response' object that matches the return value of the callback function...", () => {
        test("When 'attempt' is called and the callback function has resolved", async () => {
            const { getHookContextValue } = await renderFunc();
            const { attempt } = getHookContextValue()!;

            await act(async () => attempt());

            expect(getHookContextValue()?.response).toStrictEqual(mockResponse);
        });

        test("If the 'attemptOnMount' option is set to 'true' and the callback function has resolved", async () => {
            const { getHookContextValue } = await renderFunc({
                useAsyncOptsOverride: { attemptOnMount: true },
            });

            expect(getHookContextValue()?.response).toStrictEqual(mockResponse);
        });
    });

    describe("Should redirect the user...", () => {
        test("To the URL path provided in the 'onSuccess' prop if the response contains a status code indicating success", async () => {
            window.history.pushState({}, "", "/");

            const { getHookContextValue } = await renderFunc({
                useAsyncOptsOverride: { navigation: { onSuccess: "/success" } },
            });
            const { attempt } = getHookContextValue()!;

            await act(async () => attempt());

            expect(window.location.pathname).toBe("/success");
        });

        test("To the URL path provided in the 'onFail' prop if the response contains a status code indicating failure", async () => {
            window.history.pushState({}, "", "/");

            (mockPost as Mock).mockImplementationOnce(async () => {
                const adjustedMockResponse = structuredClone(mockResponse);
                adjustedMockResponse.status = 404;
                return adjustedMockResponse;
            });

            const { getHookContextValue } = await renderFunc({
                useAsyncOptsOverride: { navigation: { onFail: "/fail" } },
            });
            const { attempt } = getHookContextValue()!;

            await act(async () => attempt());

            expect(window.location.pathname).toBe("/fail");
        });
    });

    test("Should abort the existing function if the callback function, its parameters, or the redirect URL paths are adjusted", async () => {
        (mockPost as Mock).mockImplementationOnce(async () => {
            await new Promise((resolve) => {
                setTimeout(resolve, 1000);
            });
            return mockResponse;
        });

        const abortSpy = vi.spyOn(AbortController.prototype, "abort");

        const { rerenderFunc, getHookContextValue } = await renderFunc();
        const { attempt } = getHookContextValue()!;

        await act(async () => attempt());

        await act(async () => {
            rerenderFunc({ useAsyncOptsOverride: { navigation: { onSuccess: "/" } } });
        });

        expect(abortSpy).toHaveBeenCalled();
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

        function Component({ opts }: { opts: renderFuncArgs["useAsyncOptsOverride"] }) {
            const mergedUseAsyncOpts = _.merge(_.cloneDeep(defaultUseAsyncOpts), opts);

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

        function BrowserRouterWrapper({ opts }: { opts: renderFuncArgs["useAsyncOptsOverride"] }) {
            return (
                <BrowserRouter
                    future={{
                        v7_startTransition: true,
                        v7_relativeSplatPath: true,
                    }}
                >
                    <Component opts={opts} />
                </BrowserRouter>
            );
        }

        // When using initRender, must wrap 'expect' in 'await waitFor'
        const { rerender } = initRender
            ? render(<BrowserRouterWrapper opts={useAsyncOptsOverride} />)
            : await act(() => render(<BrowserRouterWrapper opts={useAsyncOptsOverride} />));

        return {
            rerenderFunc: (newArgs: renderFuncArgs) => {
                rerender(<BrowserRouterWrapper opts={newArgs.useAsyncOptsOverride} />);
            },
            getHookContextValue: () => HookContextValue,
            component: <BrowserRouterWrapper opts={useAsyncOptsOverride} />,
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

    describe("Should return a 'response' object that matches the return value of the callback function...", () => {
        test("When 'attempt' is called and the callback function has resolved", async () => {
            const { getHookContextValue } = await renderFunc();
            const { attempt } = getHookContextValue()!;

            await act(async () => attempt());

            expect(getHookContextValue()?.response).toStrictEqual(mockResponse);
        });

        test("If the 'attemptOnMount' option is set to 'true' and the callback function has resolved", async () => {
            const { getHookContextValue } = await renderFunc({
                useAsyncOptsOverride: { attemptOnMount: true },
            });

            expect(getHookContextValue()?.response).toStrictEqual(mockResponse);
        });
    });

    describe("Should redirect the user...", () => {
        test("To the URL path provided in the 'onSuccess' prop if the response contains a status code indicating success", async () => {
            window.history.pushState({}, "", "/");

            const { getHookContextValue } = await renderFunc({
                useAsyncOptsOverride: { navigation: { onSuccess: "/success" } },
            });
            const { attempt } = getHookContextValue()!;

            await act(async () => attempt());

            expect(window.location.pathname).toBe("/success");
        });

        test("To the URL path provided in the 'onFail' prop if the response contains a status code indicating failure", async () => {
            window.history.pushState({}, "", "/");

            (mockDelete as Mock).mockImplementationOnce(async () => {
                const adjustedMockResponse = structuredClone(mockResponse);
                adjustedMockResponse.status = 404;
                return adjustedMockResponse;
            });

            const { getHookContextValue } = await renderFunc({
                useAsyncOptsOverride: { navigation: { onFail: "/fail" } },
            });
            const { attempt } = getHookContextValue()!;

            await act(async () => attempt());

            expect(window.location.pathname).toBe("/fail");
        });
    });

    test("Should abort the existing function if the callback function, its parameters, or the redirect URL paths are adjusted", async () => {
        (mockDelete as Mock).mockImplementationOnce(async () => {
            await new Promise((resolve) => {
                setTimeout(resolve, 1000);
            });
            return mockResponse;
        });

        const abortSpy = vi.spyOn(AbortController.prototype, "abort");

        const { rerenderFunc, getHookContextValue } = await renderFunc();
        const { attempt } = getHookContextValue()!;

        await act(async () => attempt());

        await act(async () => {
            rerenderFunc({ useAsyncOptsOverride: { navigation: { onSuccess: "/" } } });
        });

        expect(abortSpy).toHaveBeenCalled();
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

        function Component({ opts }: { opts: renderFuncArgs["useAsyncOptsOverride"] }) {
            const mergedUseAsyncOpts = _.merge(_.cloneDeep(defaultUseAsyncOpts), opts);

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

        function BrowserRouterWrapper({ opts }: { opts: renderFuncArgs["useAsyncOptsOverride"] }) {
            return (
                <BrowserRouter
                    future={{
                        v7_startTransition: true,
                        v7_relativeSplatPath: true,
                    }}
                >
                    <Component opts={opts} />
                </BrowserRouter>
            );
        }

        // When using initRender, must wrap 'expect' in 'await waitFor'
        const { rerender } = initRender
            ? render(<BrowserRouterWrapper opts={useAsyncOptsOverride} />)
            : await act(() => render(<BrowserRouterWrapper opts={useAsyncOptsOverride} />));

        return {
            rerenderFunc: (newArgs: renderFuncArgs) => {
                rerender(<BrowserRouterWrapper opts={newArgs.useAsyncOptsOverride} />);
            },
            getHookContextValue: () => HookContextValue,
            component: <BrowserRouterWrapper opts={useAsyncOptsOverride} />,
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

    describe("Should return a 'response' object that matches the return value of the callback function...", () => {
        test("When 'attempt' is called and the callback function has resolved", async () => {
            const { getHookContextValue } = await renderFunc();
            const { attempt } = getHookContextValue()!;

            await act(async () => attempt());

            expect(getHookContextValue()?.response).toStrictEqual(mockResponse);
        });

        test("If the 'attemptOnMount' option is set to 'true' and the callback function has resolved", async () => {
            const { getHookContextValue } = await renderFunc({
                useAsyncOptsOverride: { attemptOnMount: true },
            });

            expect(getHookContextValue()?.response).toStrictEqual(mockResponse);
        });
    });

    describe("Should redirect the user...", () => {
        test("To the URL path provided in the 'onSuccess' prop if the response contains a status code indicating success", async () => {
            window.history.pushState({}, "", "/");

            const { getHookContextValue } = await renderFunc({
                useAsyncOptsOverride: { navigation: { onSuccess: "/success" } },
            });
            const { attempt } = getHookContextValue()!;

            await act(async () => attempt());

            expect(window.location.pathname).toBe("/success");
        });

        test("To the URL path provided in the 'onFail' prop if the response contains a status code indicating failure", async () => {
            window.history.pushState({}, "", "/");

            (mockPut as Mock).mockImplementationOnce(async () => {
                const adjustedMockResponse = structuredClone(mockResponse);
                adjustedMockResponse.status = 404;
                return adjustedMockResponse;
            });

            const { getHookContextValue } = await renderFunc({
                useAsyncOptsOverride: { navigation: { onFail: "/fail" } },
            });
            const { attempt } = getHookContextValue()!;

            await act(async () => attempt());

            expect(window.location.pathname).toBe("/fail");
        });
    });

    test("Should abort the existing function if the callback function, its parameters, or the redirect URL paths are adjusted", async () => {
        (mockPut as Mock).mockImplementationOnce(async () => {
            await new Promise((resolve) => {
                setTimeout(resolve, 1000);
            });
            return mockResponse;
        });

        const abortSpy = vi.spyOn(AbortController.prototype, "abort");

        const { rerenderFunc, getHookContextValue } = await renderFunc();
        const { attempt } = getHookContextValue()!;

        await act(async () => attempt());

        await act(async () => {
            rerenderFunc({ useAsyncOptsOverride: { navigation: { onSuccess: "/" } } });
        });

        expect(abortSpy).toHaveBeenCalled();
    });
});
