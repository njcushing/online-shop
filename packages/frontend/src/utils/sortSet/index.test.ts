import { sortSet } from ".";

describe("The 'sortSet' function...", () => {
    test("Should correctly sort a Set containing strings", async () => {
        const result = sortSet(new Set(["e", "c", "b", "d", "a"]));
        expect(result).toStrictEqual(new Set(["a", "b", "c", "d", "e"]));
    });

    test("Should sort values in ascending order if they can be parsed as numbers", async () => {
        const result = sortSet(new Set(["2", "8", "5", "1", "6"]));
        expect(result).toStrictEqual(new Set(["1", "2", "5", "6", "8"]));
    });

    test("Should sort values that can be parsed as numbers first, then strings", async () => {
        const result = sortSet(new Set(["2", "e", "b", "8", "c", "5", "1", "a", "d", "6"]));
        expect(result).toStrictEqual(new Set(["1", "2", "5", "6", "8", "a", "b", "c", "d", "e"]));
    });
});
