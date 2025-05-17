import { vi } from "vitest";
import { getTokenFromStorage } from ".";

// Mock dependencies
vi.stubEnv("VITE_TOKEN_LOCAL_LOCATION", "token_location");

describe("The 'fetcher' function...", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    test("Should call localStorage's 'getItem' method", async () => {
        const mockGetItem = vi.spyOn(Storage.prototype, "getItem");

        getTokenFromStorage();

        expect(mockGetItem).toHaveBeenCalled();
    });

    test("With the correct key", async () => {
        const mockGetItem = vi.spyOn(Storage.prototype, "getItem");

        getTokenFromStorage();

        expect(mockGetItem).toHaveBeenCalledWith("token_location");
    });

    test("Should return the return value from the localStorage getItem method call", async () => {
        const mockGetItem = vi.spyOn(Storage.prototype, "getItem");
        mockGetItem.mockImplementationOnce(() => "token");

        const result = getTokenFromStorage();

        expect(result).toBe("token");
    });
});
