import { screen, render } from "@test-utils";
import { createInputError } from ".";

describe("The 'createInputError' function...", () => {
    test("Should return a JSX Element with text content equal to the argument provided if it is a string with length greater than 0", () => {
        const result = createInputError("test");

        render(result);

        expect(screen.getByText("test")).toBeInTheDocument();
    });

    test("Should return null if the argument provided is a string but its length is 0", () => {
        const result = createInputError("");

        expect(result).toBeNull();
    });

    test("Should return null if the argument provided is not a string", () => {
        expect(createInputError(undefined)).toBeNull();
        expect(createInputError(null)).toBeNull();
        expect(createInputError([])).toBeNull();
        expect(createInputError({})).toBeNull();
        expect(createInputError(1)).toBeNull();
    });
});
