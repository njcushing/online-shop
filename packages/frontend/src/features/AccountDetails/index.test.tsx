import { vi } from "vitest";
import { screen, render } from "@test-utils";
import { act } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AccountDetails, Routes } from ".";

// Mock dependencies
// Mock props and contexts are only using fields relevant to component being tested

type renderFuncArgs = {
    initRender?: boolean;
};
const renderFunc = async (args: renderFuncArgs = {}) => {
    const { initRender = false } = args;

    function Component() {
        return <AccountDetails />;
    }

    function BrowserRouterWrapper() {
        const browserRouter = createBrowserRouter(
            [
                {
                    path: "account",
                    element: <Component />,
                    children: Routes,
                },
            ],
            { future: { v7_relativeSplatPath: true } },
        );

        return <RouterProvider router={browserRouter} future={{ v7_startTransition: true }} />;
    }

    // When using initRender, must wrap 'expect' in 'await waitFor'
    const { rerender } = initRender
        ? render(<BrowserRouterWrapper />)
        : await act(() => render(<BrowserRouterWrapper />));

    return {
        rerenderFunc: () => {
            rerender(<BrowserRouterWrapper />);
        },
        component: <BrowserRouterWrapper />,
    };
};

vi.mock("@/features/AccountDetails/components/PersonalInformation", () => ({
    PersonalInformation: vi.fn((props: unknown) => {
        return (
            <div
                aria-label="PersonalInformation component"
                data-props={JSON.stringify(props)}
            ></div>
        );
    }),
}));

vi.mock("@/features/AccountDetails/components/Addresses", () => ({
    Addresses: vi.fn((props: unknown) => {
        return <div aria-label="Addresses component" data-props={JSON.stringify(props)}></div>;
    }),
}));

vi.mock("@/features/AccountDetails/components/Security", () => ({
    Security: vi.fn((props: unknown) => {
        return <div aria-label="Security component" data-props={JSON.stringify(props)}></div>;
    }),
}));

vi.mock("@/features/AccountDetails/components/OrderHistory", () => ({
    OrderHistory: vi.fn((props: unknown) => {
        return <div aria-label="OrderHistory component" data-props={JSON.stringify(props)}></div>;
    }),
}));

vi.mock("@/features/AccountDetails/components/Subscriptions", () => ({
    Subscriptions: vi.fn((props: unknown) => {
        return <div aria-label="Subscriptions component" data-props={JSON.stringify(props)}></div>;
    }),
}));

describe("The AccountDetails component...", () => {
    beforeEach(() => {
        window.history.pushState({}, "", "/account");
    });

    describe("Should render a react-router-dom Link component to the homepage...", () => {
        test("With text content equal to: 'Home' and an 'href' attribute equal to '/'", () => {
            renderFunc();

            const HomeLinkComponent = screen.getByRole("link", { name: "Home" });
            expect(HomeLinkComponent).toBeInTheDocument();
            expect(HomeLinkComponent.getAttribute("href")).toBe("/");
        });
    });

    describe("Should render a react-router-dom Link component to the account page...", () => {
        describe("With text content equal to: 'Account' and an 'href' attribute equal to '/account'...", () => {
            test("Only if the user is currently on a subroute of /account", () => {
                window.history.pushState({}, "", "/account/personal-information");

                renderFunc();

                const AccountLinkComponent = screen.getByRole("link", { name: "Account" });
                expect(AccountLinkComponent).toBeInTheDocument();
                expect(AccountLinkComponent.getAttribute("href")).toBe("/account");
            });

            test("Otherwise, it should just be a normal text element", () => {
                window.history.pushState({}, "", "/account");

                renderFunc();

                const AccountLinkComponent = screen.queryByRole("link", { name: "Account" });
                expect(AccountLinkComponent).not.toBeInTheDocument();

                expect(screen.getByText("Account")).toBeInTheDocument();
            });
        });
    });

    describe("Should render a text element for the subroute of /account the user is currently on...", () => {
        test("With appropriate text content for that subroute", () => {
            window.history.pushState({}, "", "/account/personal-information");

            renderFunc();

            const subrouteTextElement = screen.getByText("Personal Information");
            expect(subrouteTextElement).toBeInTheDocument();
        });
    });

    describe("Should a <nav> element...", () => {
        describe("That should contain Mantine NavLink components...", () => {
            describe("For each defined subroute the user can navigate to...", () => {
                test("Including the 'Personal Information' (/personal-information) subroute", () => {
                    renderFunc();

                    const SubrouteLinkComponent = screen.getByRole("link", {
                        name: "Personal Information",
                    });
                    expect(SubrouteLinkComponent).toBeInTheDocument();
                    expect(SubrouteLinkComponent.getAttribute("href")).toBe(
                        "/account/personal-information",
                    );
                });

                test("Including the 'Addresses' (/addresses) subroute", () => {
                    renderFunc();

                    const SubrouteLinkComponent = screen.getByRole("link", { name: "Addresses" });
                    expect(SubrouteLinkComponent).toBeInTheDocument();
                    expect(SubrouteLinkComponent.getAttribute("href")).toBe("/account/addresses");
                });

                test("Including the 'Security' (/security) subroute", () => {
                    renderFunc();

                    const SubrouteLinkComponent = screen.getByRole("link", { name: "Security" });
                    expect(SubrouteLinkComponent).toBeInTheDocument();
                    expect(SubrouteLinkComponent.getAttribute("href")).toBe("/account/security");
                });

                test("Including the 'Payment Information' (/payment-information) subroute", () => {
                    renderFunc();

                    const SubrouteLinkComponent = screen.getByRole("link", {
                        name: "Payment Information",
                    });
                    expect(SubrouteLinkComponent).toBeInTheDocument();
                    expect(SubrouteLinkComponent.getAttribute("href")).toBe(
                        "/account/payment-information",
                    );
                });

                test("Including the 'Order History' (/order-history) subroute", () => {
                    renderFunc();

                    const SubrouteLinkComponent = screen.getByRole("link", {
                        name: "Order History",
                    });
                    expect(SubrouteLinkComponent).toBeInTheDocument();
                    expect(SubrouteLinkComponent.getAttribute("href")).toBe(
                        "/account/order-history",
                    );
                });

                test("Including the 'Subscriptions' (/subscriptions) subroute", () => {
                    renderFunc();

                    const SubrouteLinkComponent = screen.getByRole("link", {
                        name: "Subscriptions",
                    });
                    expect(SubrouteLinkComponent).toBeInTheDocument();
                    expect(SubrouteLinkComponent.getAttribute("href")).toBe(
                        "/account/subscriptions",
                    );
                });
            });
        });
    });

    describe("Should render the correct content for each subroute...", () => {
        test("Including the PersonalInformation component on the /personal-information subroute", () => {
            window.history.pushState({}, "", "/account/personal-information");

            renderFunc();

            const PersonalInformationComponent = screen.getByLabelText(
                "PersonalInformation component",
            );
            expect(PersonalInformationComponent).toBeInTheDocument();
        });

        test("Including the Addresses component on the /addresses subroute", () => {
            window.history.pushState({}, "", "/account/addresses");

            renderFunc();

            const AddressesComponent = screen.getByLabelText("Addresses component");
            expect(AddressesComponent).toBeInTheDocument();
        });

        test("Including the Security component on the /security subroute", () => {
            window.history.pushState({}, "", "/account/security");

            renderFunc();

            const SecurityComponent = screen.getByLabelText("Security component");
            expect(SecurityComponent).toBeInTheDocument();
        });

        test("Including the OrderHistory component on the /order-history subroute", () => {
            window.history.pushState({}, "", "/account/order-history");

            renderFunc();

            const OrderHistoryComponent = screen.getByLabelText("OrderHistory component");
            expect(OrderHistoryComponent).toBeInTheDocument();
        });
    });
});
