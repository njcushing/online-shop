import { vi } from "vitest";
import { mergeRefs } from ".";

describe("The 'mergeRefs' function...", () => {
    test("Should return a function to be passed to an element's 'ref' attribute", () => {
        const result = mergeRefs<HTMLDivElement>();
        expect(typeof result).toBe("function");
    });

    describe("Which, when called...", () => {
        test("Should call any callback function ref arguments with the element as an argument", () => {
            const callbackRef = vi.fn();
            const element = {} as HTMLDivElement;

            const result = mergeRefs<HTMLDivElement>(callbackRef);
            result(element);

            expect(callbackRef).toHaveBeenCalledWith(element);
        });

        test("Should assign the element to any mutable ref object arguments' 'current' field", () => {
            const mutableRef = { current: null } as React.MutableRefObject<HTMLDivElement | null>;
            const element = {} as HTMLDivElement;

            const result = mergeRefs<HTMLDivElement>(mutableRef);
            result(element);

            expect(mutableRef.current).toBe(element);
        });

        test("Should correctly handle multiple arguments", () => {
            const callbackRef = vi.fn();
            const mutableRef = { current: null } as React.MutableRefObject<HTMLDivElement | null>;
            const element = {} as HTMLDivElement;

            const result = mergeRefs<HTMLDivElement>(callbackRef, mutableRef);
            result(element);

            expect(callbackRef).toHaveBeenCalledWith(element);
            expect(mutableRef.current).toBe(element);
        });

        test("Should gracefully ignore all other types of arguments", () => {
            const element = {} as HTMLDivElement;

            // @ts-expect-error - Disabling type checking for function arguments in unit test
            const result = mergeRefs<HTMLDivElement>(null, undefined, "", 1, []);
            expect(() => result(element)).not.toThrow();
        });
    });
});
