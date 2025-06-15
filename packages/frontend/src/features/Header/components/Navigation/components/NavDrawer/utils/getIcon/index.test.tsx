import React from "react";
import { getIcon } from ".";

describe("The 'getIcon' function...", () => {
    test("Should return a JSX element when the provided string is matched in a switch statement", () => {
        expect(React.isValidElement(getIcon("Coffee"))).toBe(true);
        expect(React.isValidElement(getIcon("Tea"))).toBe(true);
        expect(React.isValidElement(getIcon("Equipment"))).toBe(true);
        expect(React.isValidElement(getIcon("Accessories"))).toBe(true);
        expect(React.isValidElement(getIcon("Gifts & Subscriptions"))).toBe(true);
    });

    test("Should return 'null' when the provided string is not matched in a switch statement", () => {
        expect(getIcon("Invalid Name")).toBeNull();
    });
});
