import { vi } from "vitest";
import { ApiResponse } from "@/api/types";
import { saveTokenFromAPIResponse } from ".";

const generateResponse = <T>(data: T | null): ApiResponse<T> => ({
    status: 200,
    message: "Success",
    data,
});

// Mock dependencies
const env = { VITE_TOKEN_LOCAL_LOCATION: "token" };
Object.entries(env).forEach((envVar) => vi.stubEnv(envVar[0], envVar[1]));

describe("The 'saveTokenFromAPIResponse' function...", () => {
    // fresh fake localStorage for every test
    const localStorageMock = (() => {
        let store: Record<string, string> = {};
        return {
            getItem: (key: string) => store[key] ?? null,
            setItem: (key: string, val: string) => {
                store[key] = String(val);
            },
            clear: () => {
                store = {};
            },
        };
    })();

    beforeEach(() => {
        vi.stubGlobal("localStorage", localStorageMock);
        localStorage.clear();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    test("Should return { success: false, message: 'DATA_NULL' } when data is null", async () => {
        const result = await saveTokenFromAPIResponse(generateResponse(null));

        expect(result).toEqual({ success: false, message: "DATA_NULL" });
        expect(localStorage.getItem(env.VITE_TOKEN_LOCAL_LOCATION)).toBeNull();
    });

    test("Should return { success: false, message: 'NO_TOKEN' } when no token is provided", async () => {
        const result = await saveTokenFromAPIResponse(generateResponse({}));

        expect(result).toEqual({ success: false, message: "NO_TOKEN" });
        expect(localStorage.getItem(env.VITE_TOKEN_LOCAL_LOCATION)).toBeNull();
    });

    test("Should return a 'QuotaExceededError' DOMException message when localStorage.setItem fails", async () => {
        const errorMessage = "Quota exceeded";
        vi.spyOn(localStorage, "setItem").mockImplementationOnce(() => {
            throw new DOMException(errorMessage);
        });

        const result = await saveTokenFromAPIResponse(generateResponse({ token: "token" }));

        expect(result).toEqual({ success: false, message: errorMessage });
    });

    test("Should set the token in local storage and return { success: true }", async () => {
        const result = await saveTokenFromAPIResponse(generateResponse({ token: "token" }));

        expect(localStorage.getItem(env.VITE_TOKEN_LOCAL_LOCATION)).toBe("token");
        expect(result).toEqual({ success: true });
    });
});
