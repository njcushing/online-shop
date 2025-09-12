import { vi } from "vitest";
import { screen, render } from "@test-utils";
import { BrowserRouter } from "react-router-dom";
import { RecursivePartial } from "@/utils/types";
import _ from "lodash";
import { Footer, TFooter } from ".";

// Mock dependencies

const mockProps: RecursivePartial<TFooter> = {
    reduced: false,
};

type renderFuncArgs = {
    propsOverride?: TFooter;
};
const renderFunc = (args: renderFuncArgs = {}) => {
    const { propsOverride } = args;

    const mergedProps = _.merge(_.cloneDeep(mockProps), propsOverride);

    const component = (
        <BrowserRouter
            future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
            }}
        >
            <Footer {...mergedProps} />
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

    describe("If the 'reduced' prop passed to the component is 'false'...", () => {
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

                expect(
                    screen.getByRole("link", { name: "Terms & Conditions" }),
                ).toBeInTheDocument();
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

    describe("If the 'reduced' prop passed to the component is 'true'...", () => {
        test("Should render the Logo component", () => {
            renderFunc({ propsOverride: { reduced: true } });

            const LogoComponent = screen.getByLabelText("Logo component");
            expect(LogoComponent).toBeInTheDocument();
        });

        describe("Should render Mantine Link components...", () => {
            test("With the visible text: 'Help'", () => {
                renderFunc({ propsOverride: { reduced: true } });

                expect(screen.getByRole("link", { name: "Help" })).toBeInTheDocument();
            });

            test("With the visible text: 'Terms & Conditions'", () => {
                renderFunc({ propsOverride: { reduced: true } });

                expect(
                    screen.getByRole("link", { name: "Terms & Conditions" }),
                ).toBeInTheDocument();
            });

            test("With the visible text: 'Privacy Policy'", () => {
                renderFunc({ propsOverride: { reduced: true } });

                expect(screen.getByRole("link", { name: "Privacy Policy" })).toBeInTheDocument();
            });
        });
    });
});
