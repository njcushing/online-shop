import { createPriceAdjustmentString } from ".";

describe("The 'createPriceAdjustmentString' function...", () => {
    describe("Should return a string..", () => {
        test("That is empty if both arguments are identical", () => {
            const result = createPriceAdjustmentString(1000, 1000);
            expect(result).toBe("");
        });

        test("Representing the percentage change between the arguments", () => {
            const result = createPriceAdjustmentString(1500, 1000);
            expect(result).toBe("+50%");
        });

        test("With a leading '+' if the first argument is greater than the second", () => {
            const result = createPriceAdjustmentString(2000, 1000);
            expect(result).toBe("+100%");
        });

        test("With a leading '-' if the first argument is lower than the second", () => {
            const result = createPriceAdjustmentString(500, 1000);
            expect(result).toBe("-50%");
        });
    });
});
