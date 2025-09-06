import { vi } from "vitest";
import { screen, render } from "@test-utils";
import { Checkout } from ".";

vi.mock("@/features/CheckoutContent", () => ({
    CheckoutContent: () => <div aria-label="CheckoutContent component"></div>,
}));

describe("The Checkout component...", () => {
    test("Should render the CheckoutContent component", () => {
        render(<Checkout />);

        expect(screen.getByLabelText("CheckoutContent component")).toBeInTheDocument();
    });
});
