import { vi } from "vitest";
import { screen, render } from "@test-utils";
import { PrivacyPolicy } from ".";

vi.mock("@/features/PrivacyPolicy/components/PrivacyPolicyContent", () => ({
    PrivacyPolicyContent: () => <div aria-label="PrivacyPolicyContent component"></div>,
}));

describe("The PrivacyPolicy component...", () => {
    test("Should render the PrivacyPolicyContent component", () => {
        render(<PrivacyPolicy />);

        const PrivacyPolicyContentComponent = screen.getByLabelText(
            "PrivacyPolicyContent component",
        );
        expect(PrivacyPolicyContentComponent).toBeInTheDocument();
    });
});
