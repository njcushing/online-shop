import { vi } from "vitest";
import { getReview, getReviews } from ".";

// Mock dependencies
const env = { VITE_SERVER_DOMAIN: "server_domain" };
Object.entries(env).forEach((envVar) => vi.stubEnv(envVar[0], envVar[1]));

const mockFetcher = vi.fn((path: string, init: RequestInit) => ({ path, init }));
vi.mock("@/api/utils/fetcher", () => ({
    fetcher: (path: string, init: RequestInit) => mockFetcher(path, init),
}));

describe("The 'getReview' function...", () => {
    const mockArgs: Parameters<typeof getReview> = [
        {
            params: { reviewId: "review_id" },
            abortController: undefined,
        },
    ];

    afterEach(() => {
        vi.restoreAllMocks();
    });

    test("Should return an object with status: 400 if the auth token is not found in local storage", async () => {
        const mockGetItem = vi.spyOn(Storage.prototype, "getItem");
        mockGetItem.mockImplementationOnce(() => null);

        const result = await getReview(...mockArgs);

        expect(result).toEqual(
            expect.objectContaining({
                status: 400,
                message: expect.any(String),
                data: null,
            }),
        );
    });

    test("Should return an object with status: 400 if no review id is provided in the parameters", async () => {
        const mockGetItem = vi.spyOn(Storage.prototype, "getItem").mockReturnValueOnce("token");
        mockGetItem.mockImplementationOnce(() => "token");

        const adjustedMockArgs = structuredClone(mockArgs);
        const { params } = adjustedMockArgs[0];
        // @ts-expect-error - Disabling type checking for function parameters in unit test
        params!.reviewId = undefined;

        const result = await getReview(...adjustedMockArgs);

        expect(result).toEqual(
            expect.objectContaining({
                status: 400,
                message: expect.any(String),
                data: null,
            }),
        );
    });

    test("Should call the fetcher function", async () => {
        const mockGetItem = vi.spyOn(Storage.prototype, "getItem").mockReturnValueOnce("token");
        mockGetItem.mockImplementationOnce(() => "token");

        await getReview(...mockArgs);

        expect(mockFetcher).toHaveBeenCalled();
    });

    test("Passing it the correct API endpoint as its first argument", async () => {
        const mockGetItem = vi.spyOn(Storage.prototype, "getItem").mockReturnValueOnce("token");
        mockGetItem.mockImplementationOnce(() => "token");

        await getReview(...mockArgs);

        const args = mockFetcher.mock.calls[0];
        const [path] = args;

        expect(path).toBe(`${env.VITE_SERVER_DOMAIN}/api/review/${mockArgs[0].params?.reviewId}`);
    });

    test("Passing it the abort controller's signal if the abort controller is defined", async () => {
        const mockGetItem = vi.spyOn(Storage.prototype, "getItem").mockReturnValueOnce("token");
        mockGetItem.mockImplementationOnce(() => "token");

        const adjustedMockArgs = structuredClone(mockArgs);
        adjustedMockArgs[0].abortController = new AbortController();

        await getReview(...adjustedMockArgs);

        const args = mockFetcher.mock.calls[0];
        const [, init] = args;
        const { signal } = init;

        expect(signal instanceof AbortSignal).toBeTruthy();
    });

    test("Passing it the correct HTTP method (GET)", async () => {
        const mockGetItem = vi.spyOn(Storage.prototype, "getItem").mockReturnValueOnce("token");
        mockGetItem.mockImplementationOnce(() => "token");

        await getReview(...mockArgs);

        const args = mockFetcher.mock.calls[0];
        const [, init] = args;
        const { method } = init;

        expect(method).toBe("GET");
    });

    test("Should return the return value of the fetcher function", async () => {
        const mockGetItem = vi.spyOn(Storage.prototype, "getItem").mockReturnValueOnce("token");
        mockGetItem.mockImplementationOnce(() => "token");

        // @ts-expect-error - Disabling type checking for function parameters in unit test
        mockFetcher.mockReturnValueOnce("test");

        const result = await getReview(...mockArgs);

        expect(result).toBe("test");
    });
});

describe("The 'getReviews' function...", () => {
    const mockArgs: Parameters<typeof getReviews> = [
        {
            params: {
                productId: "product_id",
                filter: "All",
                sort: "Most Recent",
                start: 0,
                end: 0,
            },
            abortController: undefined,
        },
    ];

    afterEach(() => {
        vi.restoreAllMocks();
    });

    test("Should return an object with status: 400 if the auth token is not found in local storage", async () => {
        const mockGetItem = vi.spyOn(Storage.prototype, "getItem");
        mockGetItem.mockImplementationOnce(() => null);

        const result = await getReviews(...mockArgs);

        expect(result).toEqual(
            expect.objectContaining({
                status: 400,
                message: expect.any(String),
                data: null,
            }),
        );
    });

    test("Should return an object with status: 400 if no product id is provided in the parameters", async () => {
        const mockGetItem = vi.spyOn(Storage.prototype, "getItem").mockReturnValueOnce("token");
        mockGetItem.mockImplementationOnce(() => "token");

        const adjustedMockArgs = structuredClone(mockArgs);
        const { params } = adjustedMockArgs[0];
        params!.productId = undefined;

        const result = await getReviews(...adjustedMockArgs);

        expect(result).toEqual(
            expect.objectContaining({
                status: 400,
                message: expect.any(String),
                data: null,
            }),
        );
    });

    test("Should call the fetcher function", async () => {
        const mockGetItem = vi.spyOn(Storage.prototype, "getItem").mockReturnValueOnce("token");
        mockGetItem.mockImplementationOnce(() => "token");

        await getReviews(...mockArgs);

        expect(mockFetcher).toHaveBeenCalled();
    });

    test("Passing it the correct API endpoint as its first argument", async () => {
        const mockGetItem = vi.spyOn(Storage.prototype, "getItem").mockReturnValueOnce("token");
        mockGetItem.mockImplementationOnce(() => "token");

        await getReviews(...mockArgs);

        const args = mockFetcher.mock.calls[0];
        const [path] = args;

        const urlParams = new URLSearchParams();
        Object.entries(mockArgs[0].params!).forEach(([key, value]) =>
            urlParams.append(key, `${value}`),
        );

        expect(path).toBe(`${env.VITE_SERVER_DOMAIN}/api/reviews?${urlParams}`);
    });

    test("Passing it the abort controller's signal if the abort controller is defined", async () => {
        const mockGetItem = vi.spyOn(Storage.prototype, "getItem").mockReturnValueOnce("token");
        mockGetItem.mockImplementationOnce(() => "token");

        const adjustedMockArgs = structuredClone(mockArgs);
        adjustedMockArgs[0].abortController = new AbortController();

        await getReviews(...adjustedMockArgs);

        const args = mockFetcher.mock.calls[0];
        const [, init] = args;
        const { signal } = init;

        expect(signal instanceof AbortSignal).toBeTruthy();
    });

    test("Passing it the correct HTTP method (GET)", async () => {
        const mockGetItem = vi.spyOn(Storage.prototype, "getItem").mockReturnValueOnce("token");
        mockGetItem.mockImplementationOnce(() => "token");

        await getReviews(...mockArgs);

        const args = mockFetcher.mock.calls[0];
        const [, init] = args;
        const { method } = init;

        expect(method).toBe("GET");
    });

    test("Should return the return value of the fetcher function", async () => {
        const mockGetItem = vi.spyOn(Storage.prototype, "getItem").mockReturnValueOnce("token");
        mockGetItem.mockImplementationOnce(() => "token");

        // @ts-expect-error - Disabling type checking for function parameters in unit test
        mockFetcher.mockReturnValueOnce("test");

        const result = await getReviews(...mockArgs);

        expect(result).toBe("test");
    });
});
