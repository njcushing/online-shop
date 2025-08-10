import { createQueryContextObject } from ".";

describe("The 'createQueryContextObject' function...", () => {
    describe("Should return an object...", () => {
        const result = createQueryContextObject();

        describe("Containing a 'response' object field...", () => {
            const { response } = result;

            test("Which should contain a numeric 'status' field", () => {
                const { status } = response;

                expect(typeof status).toBe("number");
            });

            test("Which should contain a string 'message' field", () => {
                const { message } = response;

                expect(typeof message).toBe("string");
            });

            test("Which should contain a null 'data' field", () => {
                const { data } = response;

                expect(data).toBeNull();
            });
        });

        test("Containing a 'setParams' function field", () => {
            const { setParams } = result;

            expect(typeof setParams).toBe("function");
            setParams([{}]);
        });

        test("Containing an 'attempt' function field", () => {
            const { attempt } = result;

            expect(typeof attempt).toBe("function");
            attempt();
        });

        test("Containing an 'abort' function field", () => {
            const { abort } = result;

            expect(typeof abort).toBe("function");
            abort();
        });

        test("Containing an 'awaiting' boolean field", () => {
            const { awaiting } = result;

            expect(typeof awaiting).toBe("boolean");
        });
    });
});
