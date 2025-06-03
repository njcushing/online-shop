import { vi } from "vitest";
import { screen, render } from "@test-utils";
import { BrowserRouter } from "react-router-dom";
import { Footer } from ".";

// Mock dependencies
const renderFunc = () => {
    const component = (
        // Using BrowserRouter for Link component(s)
        <BrowserRouter
            future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
            }}
        >
            <Footer />
        </BrowserRouter>
    );

    const { rerender } = render(component);

    return {
        rerender,
        component,
    };
};

vi.mock("@/features/Logo", () => ({
    Logo: vi.fn((props: unknown) => {
        return <div aria-label="Logo component" data-props={JSON.stringify(props)}></div>;
    }),
}));

describe("The Footer component...", () => {
    beforeEach(() => {
        window.history.pushState({}, "", "/");
    });

    test("Should render the Logo component", () => {
        renderFunc();

        const LogoComponent = screen.getByLabelText("Logo component");
        expect(LogoComponent).toBeInTheDocument();
    });

    describe("Should render heading elements...", () => {
        test("With the visible text: 'Legal'", () => {
            renderFunc();

            expect(screen.getByRole("heading", { name: "Legal" })).toBeInTheDocument();
        });

        test("With the visible text: 'Help'", () => {
            renderFunc();

            expect(screen.getByRole("heading", { name: "Help" })).toBeInTheDocument();
        });

        test("With the visible text: 'Contact'", () => {
            renderFunc();

            expect(screen.getByRole("heading", { name: "Contact" })).toBeInTheDocument();
        });

        test("With the visible text: 'Socials'", () => {
            renderFunc();

            expect(screen.getByRole("heading", { name: "Socials" })).toBeInTheDocument();
        });
    });

    describe("Should render Mantine Link components...", () => {
        test("With the visible text: 'Terms & Conditions'", () => {
            renderFunc();

            expect(screen.getByRole("link", { name: "Terms & Conditions" })).toBeInTheDocument();
        });

        test("With the visible text: 'Privacy Policy'", () => {
            renderFunc();

            expect(screen.getByRole("link", { name: "Privacy Policy" })).toBeInTheDocument();
        });

        test("With the visible text: 'Rewards'", () => {
            renderFunc();

            expect(screen.getByRole("link", { name: "Rewards" })).toBeInTheDocument();
        });

        test("With the visible text: 'Delivery'", () => {
            renderFunc();

            expect(screen.getByRole("link", { name: "Delivery" })).toBeInTheDocument();
        });

        test("With the visible text: 'FAQs'", () => {
            renderFunc();

            expect(screen.getByRole("link", { name: "FAQs" })).toBeInTheDocument();
        });

        test("With the visible text: 'Email'", () => {
            renderFunc();

            expect(screen.getByRole("link", { name: "Email" })).toBeInTheDocument();
        });

        test("With the visible text: 'Instagram'", () => {
            renderFunc();

            expect(screen.getByRole("link", { name: "Instagram" })).toBeInTheDocument();
        });

        test("With the visible text: 'X'", () => {
            renderFunc();

            expect(screen.getByRole("link", { name: "X" })).toBeInTheDocument();
        });

        test("With the visible text: 'Facebook'", () => {
            renderFunc();

            expect(screen.getByRole("link", { name: "Facebook" })).toBeInTheDocument();
        });

        test("With the visible text: 'GitHub'", () => {
            renderFunc();

            expect(screen.getByRole("link", { name: "GitHub" })).toBeInTheDocument();
        });
    });
});
