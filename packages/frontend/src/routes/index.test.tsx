import { vi } from "vitest";
import { render, screen } from "@test-utils";
import { Router } from ".";

// Mock dependencies
vi.mock("@/pages/Root", () => ({
    Root: () => <div aria-label="Root component"></div>,
    Routes: [],
}));

vi.mock("@/pages/CreateAccount", () => ({
    CreateAccount: () => <div aria-label="CreateAccount component"></div>,
    Routes: [],
}));

vi.mock("@/pages/Login", () => ({
    Login: () => <div aria-label="Login component"></div>,
    Routes: [],
}));

vi.mock("@/pages/TermsAndConditions", () => ({
    TermsAndConditions: () => <div aria-label="TermsAndConditions component"></div>,
    Routes: [],
}));

vi.mock("@/pages/PrivacyPolicy", () => ({
    PrivacyPolicy: () => <div aria-label="PrivacyPolicy component"></div>,
    Routes: [],
}));

describe("The Router component...", () => {
    describe("Should return a new BrowserRouter component...", () => {
        test("That renders the Root page component on the '/' route", () => {
            window.history.pushState({}, "", "/");

            render(<Router />);

            const RootComponent = screen.getByLabelText("Root component");
            expect(RootComponent).toBeInTheDocument();
        });

        test("That renders the CreateAccount page component on the '/create-account' route", () => {
            window.history.pushState({}, "", "/create-account");

            render(<Router />);

            const CreateAccountComponent = screen.getByLabelText("CreateAccount component");
            expect(CreateAccountComponent).toBeInTheDocument();
        });

        test("That renders the Login page component on the '/login' route", () => {
            window.history.pushState({}, "", "/login");

            render(<Router />);

            const LoginComponent = screen.getByLabelText("Login component");
            expect(LoginComponent).toBeInTheDocument();
        });

        test("That renders the TermsAndConditions page component on the '/terms-and-conditions' route", () => {
            window.history.pushState({}, "", "/terms-and-conditions");

            render(<Router />);

            const TermsAndConditionsComponent = screen.getByLabelText(
                "TermsAndConditions component",
            );
            expect(TermsAndConditionsComponent).toBeInTheDocument();
        });

        test("That renders the PrivacyPolicy page component on the '/privacy-policy' route", () => {
            window.history.pushState({}, "", "/privacy-policy");

            render(<Router />);

            const PrivacyPolicyComponent = screen.getByLabelText("PrivacyPolicy component");
            expect(PrivacyPolicyComponent).toBeInTheDocument();
        });
    });
});
