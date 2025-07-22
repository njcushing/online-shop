import { vi } from "vitest";
import { screen, render } from "@test-utils";
import { Account } from ".";

// Mock dependencies
vi.mock("@/features/AccountDetails", () => ({
    Routes: [],
    AccountDetails: () => <div aria-label="AccountDetails component"></div>,
}));

describe("The Account component...", () => {
    test("Should render the AccountDetails component", () => {
        render(<Account />);

        const AccountDetailsComponent = screen.getByLabelText("AccountDetails component");
        expect(AccountDetailsComponent).toBeInTheDocument();
    });
});
