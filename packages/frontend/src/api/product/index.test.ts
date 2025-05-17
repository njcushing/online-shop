import { vi } from "vitest";
import { getProduct } from ".";

// Mock dependencies
const env = { VITE_SERVER_DOMAIN: "server_domain" };
Object.entries(env).forEach((envVar) => vi.stubEnv(envVar[0], envVar[1]));

const mockFetcher = vi.fn((path: string, init: RequestInit) => ({ path, init }));
vi.mock("@/api/utils/fetcher", () => ({
    fetcher: (path: string, init: RequestInit) => mockFetcher(path, init),
}));

describe("The 'getProduct' function...", () => {
    const mockArgs: Parameters<typeof getProduct> = [
        {
            params: { productId: "product_id" },
            abortController: undefined,
        },
    ];

    afterEach(() => {
        vi.restoreAllMocks();
    });

    test("Should return an object with status: 400 if no product id is provided in the parameters", async () => {
        const mockGetItem = vi.spyOn(Storage.prototype, "getItem").mockReturnValueOnce("token");
        mockGetItem.mockImplementationOnce(() => "token");

        const adjustedMockArgs = structuredClone(mockArgs);
        const { params } = adjustedMockArgs[0];
        params!.productId = undefined;

        const result = await getProduct(...adjustedMockArgs);

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

        await getProduct(...mockArgs);

        expect(mockFetcher).toHaveBeenCalled();
    });

    test("Passing it the correct API endpoint as its first argument", async () => {
        const mockGetItem = vi.spyOn(Storage.prototype, "getItem").mockReturnValueOnce("token");
        mockGetItem.mockImplementationOnce(() => "token");

        await getProduct(...mockArgs);

        const args = mockFetcher.mock.calls[0];
        const [path] = args;

        expect(path).toBe(`${env.VITE_SERVER_DOMAIN}/api/product/${mockArgs[0].params?.productId}`);
    });

    test("Passing it the abort controller's signal if the abort controller is defined", async () => {
        const mockGetItem = vi.spyOn(Storage.prototype, "getItem").mockReturnValueOnce("token");
        mockGetItem.mockImplementationOnce(() => "token");

        const adjustedMockArgs = structuredClone(mockArgs);
        adjustedMockArgs[0].abortController = new AbortController();

        await getProduct(...adjustedMockArgs);

        const args = mockFetcher.mock.calls[0];
        const [, init] = args;
        const { signal } = init;

        expect(signal instanceof AbortSignal).toBeTruthy();
    });

    test("Passing it the correct HTTP method (GET)", async () => {
        const mockGetItem = vi.spyOn(Storage.prototype, "getItem").mockReturnValueOnce("token");
        mockGetItem.mockImplementationOnce(() => "token");

        await getProduct(...mockArgs);

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

        const result = await getProduct(...mockArgs);

        expect(result).toBe("test");
    });
});
