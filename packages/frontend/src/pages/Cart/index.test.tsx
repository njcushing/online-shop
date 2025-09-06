import { vi } from "vitest";
import { screen, render } from "@test-utils";
import { Cart } from ".";

vi.mock("@/features/CartContent", () => ({
    CartContent: () => <div aria-label="CartContent component"></div>,
}));

describe("The Cart component...", () => {
    test("Should render the CartContent component", () => {
        render(<Cart />);

        expect(screen.getByLabelText("CartContent component")).toBeInTheDocument();
    });
});
