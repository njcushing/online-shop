import { vi } from "vitest";
import { createAccount } from ".";

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

// Mock dependencies
const env = { VITE_SERVER_DOMAIN: "server_domain" };
Object.entries(env).forEach((envVar) => vi.stubEnv(envVar[0], envVar[1]));

const mockFetcher = vi.fn((path: string, init: RequestInit) => ({ path, init }));
vi.mock("@/api/utils/fetcher", () => ({
    fetcher: (path: string, init: RequestInit) => mockFetcher(path, init),
}));

describe("The 'createAccount' function...", () => {
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
