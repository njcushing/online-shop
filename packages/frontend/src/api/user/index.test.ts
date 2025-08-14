import { vi, Mock } from "vitest";
import { getUser, createAccount } from ".";

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

describe("The 'getUser' function...", () => {
    const mockArgs: Parameters<typeof getUser> = [
        {
            abortController: undefined,
        },
    ];

    afterEach(() => {
        vi.restoreAllMocks();
    });

    test("Should return an object with status: 400 if the auth token is not found in local storage", async () => {
        mockGetTokenFromStorage.mockImplementationOnce(() => null);

        const result = await getUser(...mockArgs);

        expect(result).toEqual(
            expect.objectContaining({
                status: 400,
                message: expect.any(String),
                data: null,
            }),
        );
    });

    test("Should call the fetcher function", async () => {
        await getUser(...mockArgs);

        expect(mockFetcher).toHaveBeenCalled();
    });

    test("Passing it the correct API endpoint as its first argument", async () => {
        await getUser(...mockArgs);

        const args = mockFetcher.mock.calls[0];
        const [path] = args;

        expect(path).toBe(`${env.VITE_SERVER_DOMAIN}/api`);
    });

    test("Passing it the abort controller's signal if the abort controller is defined", async () => {
        const adjustedMockArgs = structuredClone(mockArgs);
        adjustedMockArgs[0].abortController = new AbortController();

        await getUser(...adjustedMockArgs);

        const args = mockFetcher.mock.calls[0];
        const [, init] = args;
        const { signal } = init;

        expect(signal instanceof AbortSignal).toBeTruthy();
    });

    test("Passing it the correct HTTP method (GET)", async () => {
        await getUser(...mockArgs);

        const args = mockFetcher.mock.calls[0];
        const [, init] = args;
        const { method } = init;

        expect(method).toBe("GET");
    });

    test("Should return the return value of the fetcher function", async () => {
        // @ts-expect-error - Disabling type checking for function parameters in unit test
        mockFetcher.mockReturnValueOnce("test");

        const result = await getUser(...mockArgs);

        expect(result).toBe("test");
    });
});

describe("The 'createAccount' function...", () => {
    const mockArgs: Parameters<typeof createAccount> = [
        {
            params: undefined,
            body: {
                email: "emailAddress",
                password: "passwordString",
                confirmPassword: "passwordString",
            },
            abortController: undefined,
        },
    ];

    afterEach(() => {
        vi.restoreAllMocks();
    });

    test("Should call the fetcher function", async () => {
        await createAccount(...mockArgs);

        expect(mockFetcher).toHaveBeenCalled();
    });

    test("Passing it the correct API endpoint as its first argument", async () => {
        await createAccount(...mockArgs);

        const args = mockFetcher.mock.calls[0];
        const [path] = args;

        expect(path).toBe(`${env.VITE_SERVER_DOMAIN}/api/user`);
    });

    test("Passing it the abort controller's signal if the abort controller is defined", async () => {
        const adjustedMockArgs = structuredClone(mockArgs);
        adjustedMockArgs[0].abortController = new AbortController();

        await createAccount(...adjustedMockArgs);

        const args = mockFetcher.mock.calls[0];
        const [, init] = args;
        const { signal } = init;

        expect(signal instanceof AbortSignal).toBeTruthy();
    });

    test("Passing it the correct HTTP method (POST)", async () => {
        await createAccount(...mockArgs);

        const args = mockFetcher.mock.calls[0];
        const [, init] = args;
        const { method } = init;

        expect(method).toBe("POST");
    });

    test("Passing it the stringified body object that was passed into the function itself", async () => {
        await createAccount(...mockArgs);

        const args = mockFetcher.mock.calls[0];
        const [, init] = args;
        const { body } = init;

        expect(body).toBe(JSON.stringify(mockArgs[0].body));
    });

    test("Should return the return value of the fetcher function", async () => {
        // @ts-expect-error - Disabling type checking for function parameters in unit test
        mockFetcher.mockReturnValueOnce("test");

        const result = await createAccount(...mockArgs);

        expect(result).toBe("test");
    });
});
