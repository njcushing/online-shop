import { screen, render } from "@test-utils";
import { PrivacyPolicy } from ".";

describe("The PrivacyPolicy component...", () => {
    test("Should render the text 'Privacy Policy'", () => {
        render(<PrivacyPolicy />);

        expect(screen.getByText("Privacy Policy")).toBeInTheDocument();
    });
});
