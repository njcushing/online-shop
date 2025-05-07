import { generateDateWithinRandomRange } from ".";

describe("The 'generateDateWithinRandomRange' function...", () => {
    test("Should return a valid Date object with a value that lies between the start and end dates", () => {
        const start = new Date("2024-01-01T00:00:00Z");
        const end = new Date("2025-01-01T00:00:00Z");

        const result = generateDateWithinRandomRange(start, end);

        expect(result).toBeInstanceOf(Date);
        expect(result.getTime()).toBeGreaterThanOrEqual(start.getTime());
        expect(result.getTime()).toBeLessThanOrEqual(end.getTime());
    });

    test("Should still work if the start date is after the end date", () => {
        const start = new Date("2025-01-01T00:00:00Z");
        const end = new Date("2024-01-01T00:00:00Z");

        const result = generateDateWithinRandomRange(start, end);

        expect(result).toBeInstanceOf(Date);
        expect(result.getTime()).toBeGreaterThanOrEqual(end.getTime());
        expect(result.getTime()).toBeLessThanOrEqual(start.getTime());
    });
});
