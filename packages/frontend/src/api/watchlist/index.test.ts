import { vi, Mock } from "vitest";
import { getWatchlist, updateWatchlist } from ".";

// Mock dependencies
const env = { VITE_SERVER_DOMAIN: "server_domain" };
Object.entries(env).forEach((envVar) => vi.stubEnv(envVar[0], envVar[1]));

const mockGetTokenFromStorage = vi.fn(() => "token") as Mock;
vi.mock("@/api/utils/getTokenFromStorage", () => ({
    getTokenFromStorage: () => mockGetTokenFromStorage(),
}));

const mockFetcher = vi.fn((path: string, init: RequestInit) => ({ path, init }));
vi.mock("@/api/utils/fetcher", () => ({
    fetcher: (path: string, init: RequestInit) => mockFetcher(path, init),
}));

describe("The 'getWatchlist' function...", () => {
    const mockArgs: Parameters<typeof getWatchlist> = [
        {
            abortController: undefined,
        },
    ];

    afterEach(() => {
        vi.restoreAllMocks();
    });

    test("Should return an object with status: 400 if the auth token is not found in local storage", async () => {
        mockGetTokenFromStorage.mockImplementationOnce(() => null);

        const result = await getWatchlist(...mockArgs);

        expect(result).toEqual(
            expect.objectContaining({
                status: 400,
                message: expect.any(String),
                data: null,
            }),
        );
    });

    test("Should call the fetcher function", async () => {
        await getWatchlist(...mockArgs);

        expect(mockFetcher).toHaveBeenCalled();
    });

    test("Passing it the correct API endpoint as its first argument", async () => {
        await getWatchlist(...mockArgs);

        const args = mockFetcher.mock.calls[0];
        const [path] = args;

        expect(path).toBe(`${env.VITE_SERVER_DOMAIN}/api/watchlist`);
    });

    test("Passing it the abort controller's signal if the abort controller is defined", async () => {
        const adjustedMockArgs = structuredClone(mockArgs);
        adjustedMockArgs[0].abortController = new AbortController();

        await getWatchlist(...adjustedMockArgs);

        const args = mockFetcher.mock.calls[0];
        const [, init] = args;
        const { signal } = init;

        expect(signal instanceof AbortSignal).toBeTruthy();
    });

    test("Passing it the correct HTTP method (GET)", async () => {
        await getWatchlist(...mockArgs);

        const args = mockFetcher.mock.calls[0];
        const [, init] = args;
        const { method } = init;

        expect(method).toBe("GET");
    });

    test("Should return the return value of the fetcher function", async () => {
        // @ts-expect-error - Disabling type checking for function parameters in unit test
        mockFetcher.mockReturnValueOnce("test");

        const result = await getWatchlist(...mockArgs);

        expect(result).toBe("test");
    });
});

describe("The 'updateWatchlist' function...", () => {
    const mockArgs: Parameters<typeof updateWatchlist> = [
        {
            body: { variant: { productId: "productName1", variantId: "variantName1" } },
            abortController: undefined,
        },
    ];

    afterEach(() => {
        vi.restoreAllMocks();
    });

    test("Should return an object with status: 400 if the auth token is not found in local storage", async () => {
        mockGetTokenFromStorage.mockImplementationOnce(() => null);

        const result = await updateWatchlist(...mockArgs);

        expect(result).toEqual(
            expect.objectContaining({
                status: 400,
                message: expect.any(String),
                data: null,
            }),
        );
    });

    test("Should return an object with status: 400 if no variant is provided for the request body", async () => {
        const adjustedMockArgs = structuredClone(mockArgs);
        const { body } = adjustedMockArgs[0];
        // @ts-expect-error - Disabling type checking for function parameters in unit test
        body!.variant = undefined;

        const result = await updateWatchlist(...adjustedMockArgs);

        expect(result).toEqual(
            expect.objectContaining({
                status: 400,
                message: expect.any(String),
                data: null,
            }),
        );
    });

    test("Should call the fetcher function", async () => {
        await updateWatchlist(...mockArgs);

        expect(mockFetcher).toHaveBeenCalled();
    });

    test("Passing it the correct API endpoint as its first argument", async () => {
        await updateWatchlist(...mockArgs);

        const args = mockFetcher.mock.calls[0];
        const [path] = args;

        expect(path).toBe(`${env.VITE_SERVER_DOMAIN}/api/watchlist`);
    });

    test("Passing it the abort controller's signal if the abort controller is defined", async () => {
        const adjustedMockArgs = structuredClone(mockArgs);
        adjustedMockArgs[0].abortController = new AbortController();

        await updateWatchlist(...adjustedMockArgs);

        const args = mockFetcher.mock.calls[0];
        const [, init] = args;
        const { signal } = init;

        expect(signal instanceof AbortSignal).toBeTruthy();
    });

    test("Passing it the correct HTTP method (PUT)", async () => {
        await updateWatchlist(...mockArgs);

        const args = mockFetcher.mock.calls[0];
        const [, init] = args;
        const { method } = init;

        expect(method).toBe("PUT");
    });

    test("Should return the return value of the fetcher function", async () => {
        // @ts-expect-error - Disabling type checking for function parameters in unit test
        mockFetcher.mockReturnValueOnce("test");

        const result = await updateWatchlist(...mockArgs);

        expect(result).toBe("test");
    });
});
