import { screen, render } from "@test-utils";
import { TermsAndConditions } from ".";

describe("The TermsAndConditions component...", () => {
    test("Should render the text 'Terms and Conditions'", () => {
        render(<TermsAndConditions />);

        expect(screen.getByText("Terms and Conditions")).toBeInTheDocument();
    });
});
