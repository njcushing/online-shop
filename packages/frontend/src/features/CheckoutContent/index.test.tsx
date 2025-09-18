import { vi } from "vitest";
import { screen, render, within, userEvent, fireEvent } from "@test-utils";
import _ from "lodash";
import { act } from "react";
import { IUserContext, UserContext } from "@/pages/Root";
import { RecursivePartial } from "@/utils/types";
import { BrowserRouter } from "react-router-dom";
import { CheckoutContent } from ".";

const getProps = (component: HTMLElement) => {
    return JSON.parse(component.getAttribute("data-props")!);
};

// Mock dependencies
const mockUserContext: RecursivePartial<IUserContext> = {
    user: {
        response: {
            data: {} as unknown as IUserContext["user"]["response"]["data"],
        },
        attempt: () => {},
        awaiting: false,
    },
    cart: {
        // Only using fields relevant to the CheckoutContent component
        response: {
            data: {
                items: [],
                promotions: [],
            } as unknown as IUserContext["cart"]["response"]["data"],
        },
        attempt: () => {},
        awaiting: false,
    },

    defaultData: {
        cart: { items: [], promotions: [] },
    },
};

type renderFuncArgs = {
    UserContextOverride?: IUserContext;
};
const renderFunc = (args: renderFuncArgs = {}) => {
    const { UserContextOverride } = args;

    let UserContextValue!: IUserContext;

    const mergedUserContext = _.merge(_.cloneDeep(mockUserContext), UserContextOverride);

    const component = (
        <BrowserRouter
            future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
            }}
        >
            <UserContext.Provider value={mergedUserContext}>
                <UserContext.Consumer>
                    {(value) => {
                        UserContextValue = value;
                        return null;
                    }}
                </UserContext.Consumer>
                <CheckoutContent />
            </UserContext.Provider>
        </BrowserRouter>
    );

    const { rerender } = render(component);

    return {
        rerender,
        UserContextValue,
        component,
    };
};

vi.mock("@/features/Cart/components/CartSummary", () => ({
    CartSummary: vi.fn((props: unknown & { "data-testid": string }) => {
        return (
            <div
                data-testid={props["data-testid"]}
                aria-label="CartSummary component"
                data-props={JSON.stringify(props)}
            ></div>
        );
    }),
}));

vi.mock("@/features/CheckoutContent/components/PersonalInformationForm", () => ({
    PersonalInformationForm: vi.fn((props: unknown & { onSubmit: () => void }) => {
        return (
            <button
                type="button"
                onClick={() => props.onSubmit()}
                aria-label="PersonalInformationForm component"
                data-props={JSON.stringify(props)}
            ></button>
        );
    }),
}));

vi.mock("@/features/CheckoutContent/components/ShippingForm", () => ({
    ShippingForm: vi.fn((props: unknown & { onReturn: () => void; onSubmit: () => void }) => {
        return (
            <button
                type="button"
                onClick={() => props.onSubmit()}
                onBlur={() => props.onReturn()}
                aria-label="ShippingForm component"
                data-props={JSON.stringify(props)}
            ></button>
        );
    }),
}));

vi.mock("@/features/CheckoutContent/components/PaymentForm", () => ({
    PaymentForm: vi.fn((props: unknown & { onReturn: () => void; onSubmit: () => void }) => {
        return (
            <button
                type="button"
                onClick={() => props.onSubmit()}
                onBlur={() => props.onReturn()}
                aria-label="PaymentForm component"
                data-props={JSON.stringify(props)}
            ></button>
        );
    }),
}));

vi.mock("@/components/UI/Error", () => ({
    Error: vi.fn((props: unknown & { message: string; children: React.ReactNode }) => {
        return (
            <div aria-label="Error component" data-props={JSON.stringify(props)}>
                {props.message}
                {props.children}
            </div>
        );
    }),
}));

describe("The CheckoutContent component...", () => {
    afterEach(() => {
        window.history.pushState({}, "", "/");
    });

    describe("On narrower viewports...", () => {
        describe("Should render the CartSummary component...", () => {
            test("Passing the correct props", () => {
                renderFunc();

                const CartSummary = screen.getByTestId("CartSummary-narrow");
                expect(CartSummary).toBeInTheDocument();

                const props = CartSummary.getAttribute("data-props");
                expect(JSON.parse(props!)).toStrictEqual(
                    expect.objectContaining({
                        layout: "dropdown",
                    }),
                );
            });
        });
    });

    describe("Should render the PersonalInformationForm component...", () => {
        test("Passing the correct props ('isOpen' should be 'true' by default)", () => {
            renderFunc();

            const PersonalInformationForm = screen.getByLabelText(
                "PersonalInformationForm component",
            );
            expect(PersonalInformationForm).toBeInTheDocument();

            const props = PersonalInformationForm.getAttribute("data-props");
            expect(JSON.parse(props!)).toStrictEqual(
                expect.objectContaining({
                    isOpen: true,
                }),
            );
        });

        describe("That should, when its 'onSubmit' callback function is invoked...", () => {
            test("Have its 'isOpen' prop set to false", async () => {
                renderFunc();

                const PersonalInformationForm = screen.getByLabelText(
                    "PersonalInformationForm component",
                );

                expect(
                    JSON.parse(PersonalInformationForm.getAttribute("data-props")!),
                ).toStrictEqual(expect.objectContaining({ isOpen: true }));

                await act(async () => userEvent.click(PersonalInformationForm));

                expect(
                    JSON.parse(PersonalInformationForm.getAttribute("data-props")!),
                ).toStrictEqual(expect.objectContaining({ isOpen: false }));
            });

            test("Cause the ShippingForm component's 'isOpen' prop to be set to 'true'", async () => {
                renderFunc();

                const PersonalInformationForm = screen.getByLabelText(
                    "PersonalInformationForm component",
                );
                const ShippingForm = screen.getByLabelText("ShippingForm component");

                expect(JSON.parse(ShippingForm.getAttribute("data-props")!)).toStrictEqual(
                    expect.objectContaining({ isOpen: false }),
                );

                await act(async () => userEvent.click(PersonalInformationForm));

                expect(JSON.parse(ShippingForm.getAttribute("data-props")!)).toStrictEqual(
                    expect.objectContaining({ isOpen: true }),
                );
            });
        });
    });

    describe("Should render the ShippingForm component...", () => {
        test("Passing the correct props ('isOpen' should be 'false' by default)", () => {
            renderFunc();

            const ShippingForm = screen.getByLabelText("ShippingForm component");
            expect(ShippingForm).toBeInTheDocument();

            const props = ShippingForm.getAttribute("data-props");
            expect(JSON.parse(props!)).toStrictEqual(
                expect.objectContaining({
                    isOpen: false,
                }),
            );
        });

        describe("That should, when its 'onSubmit' callback function is invoked...", () => {
            beforeEach(async () => {
                // Open the form

                renderFunc();

                const PersonalInformationForm = screen.getByLabelText(
                    "PersonalInformationForm component",
                );

                await act(async () => userEvent.click(PersonalInformationForm));
            });

            test("Have its 'isOpen' prop set to false", async () => {
                const ShippingForm = screen.getByLabelText("ShippingForm component");

                expect(JSON.parse(ShippingForm.getAttribute("data-props")!)).toStrictEqual(
                    expect.objectContaining({ isOpen: true }),
                );

                await act(async () => userEvent.click(ShippingForm));

                expect(JSON.parse(ShippingForm.getAttribute("data-props")!)).toStrictEqual(
                    expect.objectContaining({ isOpen: false }),
                );
            });

            test("Cause the PaymentForm component's 'isOpen' prop to be set to 'true'", async () => {
                const ShippingForm = screen.getByLabelText("ShippingForm component");
                const PaymentForm = screen.getByLabelText("PaymentForm component");

                expect(JSON.parse(PaymentForm.getAttribute("data-props")!)).toStrictEqual(
                    expect.objectContaining({ isOpen: false }),
                );

                await act(async () => userEvent.click(ShippingForm));

                expect(JSON.parse(PaymentForm.getAttribute("data-props")!)).toStrictEqual(
                    expect.objectContaining({ isOpen: true }),
                );
            });
        });

        describe("That should, when its 'onReturn' callback function is invoked...", () => {
            beforeEach(async () => {
                // Open the form

                renderFunc();

                const PersonalInformationForm = screen.getByLabelText(
                    "PersonalInformationForm component",
                );

                await act(async () => userEvent.click(PersonalInformationForm));
            });

            test("Have its 'isOpen' prop set to false", async () => {
                const ShippingForm = screen.getByLabelText("ShippingForm component");

                expect(JSON.parse(ShippingForm.getAttribute("data-props")!)).toStrictEqual(
                    expect.objectContaining({ isOpen: true }),
                );

                await act(async () => fireEvent.blur(ShippingForm));

                expect(JSON.parse(ShippingForm.getAttribute("data-props")!)).toStrictEqual(
                    expect.objectContaining({ isOpen: false }),
                );
            });

            test("Cause the PersonalInformationForm component's 'isOpen' prop to be set to 'true'", async () => {
                const ShippingForm = screen.getByLabelText("ShippingForm component");
                const PersonalInformationForm = screen.getByLabelText(
                    "PersonalInformationForm component",
                );

                expect(
                    JSON.parse(PersonalInformationForm.getAttribute("data-props")!),
                ).toStrictEqual(expect.objectContaining({ isOpen: false }));

                await act(async () => fireEvent.blur(ShippingForm));

                expect(
                    JSON.parse(PersonalInformationForm.getAttribute("data-props")!),
                ).toStrictEqual(expect.objectContaining({ isOpen: true }));
            });
        });
    });

    describe("Should render the PaymentForm component...", () => {
        test("Passing the correct props ('isOpen' should be 'false' by default)", () => {
            renderFunc();

            const PaymentForm = screen.getByLabelText("PaymentForm component");
            expect(PaymentForm).toBeInTheDocument();

            const props = PaymentForm.getAttribute("data-props");
            expect(JSON.parse(props!)).toStrictEqual(
                expect.objectContaining({
                    isOpen: false,
                }),
            );
        });

        describe("That should, when its 'onReturn' callback function is invoked...", () => {
            beforeEach(async () => {
                // Open the form

                renderFunc();

                const PersonalInformationForm = screen.getByLabelText(
                    "PersonalInformationForm component",
                );
                const ShippingForm = screen.getByLabelText("ShippingForm component");

                await act(async () => userEvent.click(PersonalInformationForm));
                await act(async () => userEvent.click(ShippingForm));
            });

            test("Have its 'isOpen' prop set to false", async () => {
                const PaymentForm = screen.getByLabelText("PaymentForm component");

                expect(JSON.parse(PaymentForm.getAttribute("data-props")!)).toStrictEqual(
                    expect.objectContaining({ isOpen: true }),
                );

                await act(async () => fireEvent.blur(PaymentForm));

                expect(JSON.parse(PaymentForm.getAttribute("data-props")!)).toStrictEqual(
                    expect.objectContaining({ isOpen: false }),
                );
            });

            test("Cause the PaymentForm component's 'isOpen' prop to be set to 'true'", async () => {
                const PaymentForm = screen.getByLabelText("PaymentForm component");
                const ShippingForm = screen.getByLabelText("ShippingForm component");

                expect(JSON.parse(ShippingForm.getAttribute("data-props")!)).toStrictEqual(
                    expect.objectContaining({ isOpen: false }),
                );

                await act(async () => fireEvent.blur(PaymentForm));

                expect(JSON.parse(ShippingForm.getAttribute("data-props")!)).toStrictEqual(
                    expect.objectContaining({ isOpen: true }),
                );
            });
        });
    });

    describe("On wider viewports...", () => {
        describe("Should render the CartSummary component...", () => {
            test("Passing the correct props", () => {
                renderFunc();

                const CartSummary = screen.getByTestId("CartSummary-wide");
                expect(CartSummary).toBeInTheDocument();

                const props = CartSummary.getAttribute("data-props");
                expect(JSON.parse(props!)).toStrictEqual(
                    expect.objectContaining({
                        layout: "visible",
                    }),
                );
            });
        });

        describe("Should render a button...", () => {
            test("With an accessible name equal to: 'Pay now'", () => {
                renderFunc();

                const payNowButton = screen.getByRole("button", { name: "Pay now" });
                expect(payNowButton).toBeInTheDocument();
            });

            describe("That should be disabled if...", () => {
                test("The UserContext's cart data is still being awaited", () => {
                    renderFunc({
                        UserContextOverride: { cart: { awaiting: true } } as IUserContext,
                    });

                    const payNowButton = screen.getByRole("button", { name: "Pay now" });
                    expect(payNowButton).toBeDisabled();
                });

                test("The number of items in the user's cart is 0", () => {
                    renderFunc({
                        UserContextOverride: {
                            cart: { response: { data: { items: [] } } },
                        } as unknown as IUserContext,
                    });

                    const payNowButton = screen.getByRole("button", { name: "Pay now" });
                    expect(payNowButton).toBeDisabled();
                });
            });

            describe("That should be enabled if...", () => {
                test("The UserContext's cart data is not being awaited and the number of items in the user's cart exceeds 0", () => {
                    renderFunc({
                        UserContextOverride: {
                            cart: {
                                response: {
                                    data: {
                                        items: [
                                            {
                                                product: {},
                                                variant: { id: "variant1Id" },
                                                quantity: 1,
                                            },
                                        ],
                                    },
                                },
                            },
                        } as unknown as IUserContext,
                    });

                    const payNowButton = screen.getByRole("button", { name: "Pay now" });
                    expect(payNowButton).toBeEnabled();
                });
            });
        });
    });

    describe("Should display an Error component...", () => {
        test("If the UserContext's 'user.awaiting' field is false and 'user.response.data' field is falsy", () => {
            renderFunc({
                UserContextOverride: {
                    user: { response: { data: null }, awaiting: false },
                } as unknown as IUserContext,
            });

            const Error = screen.getByLabelText("Error component");
            expect(Error).toBeInTheDocument();
        });

        test("Passing the correct props", () => {
            renderFunc({
                UserContextOverride: {
                    user: { response: { data: null }, awaiting: false },
                } as unknown as IUserContext,
            });

            const Error = screen.getByLabelText("Error component");
            expect(Error).toBeInTheDocument();

            const props = getProps(Error);
            expect(props).toEqual(
                expect.objectContaining({
                    message: "Could not load user data",
                }),
            );
        });

        test("That should render a 'Retry' button that, on click, should invoke the UserContext's 'user.attempt' function", async () => {
            const attemptSpy = vi.fn();

            renderFunc({
                UserContextOverride: {
                    user: { response: { data: null }, attempt: attemptSpy, awaiting: false },
                } as unknown as IUserContext,
            });

            const Error = screen.getByLabelText("Error component");
            expect(Error).toBeInTheDocument();

            const retryButton = within(Error).getByRole("button", { name: "Retry" });
            expect(retryButton).toBeInTheDocument();

            expect(attemptSpy).not.toHaveBeenCalled();

            await act(async () => userEvent.click(retryButton));

            expect(attemptSpy).toHaveBeenCalled();
        });

        test("That should render a 'Dismiss' button that, on click, should unmount the Error component", async () => {
            renderFunc({
                UserContextOverride: {
                    user: { response: { data: null }, awaiting: false },
                } as unknown as IUserContext,
            });

            const Error = screen.getByLabelText("Error component");
            expect(Error).toBeInTheDocument();

            const dismissButton = within(Error).getByRole("button", { name: "Dismiss" });
            expect(dismissButton).toBeInTheDocument();

            await act(async () => userEvent.click(dismissButton));

            expect(screen.queryByLabelText("Error component")).not.toBeInTheDocument();
        });
    });

    describe("Should display an error section...", () => {
        test("If the UserContext's 'cart.awaiting' field is false and 'cart.response.data' field is falsy", () => {
            renderFunc({
                UserContextOverride: {
                    cart: { response: { data: null }, awaiting: false },
                } as unknown as IUserContext,
            });

            const errorSection = screen.getByRole("alert");
            expect(errorSection).toBeInTheDocument();
        });

        test("That should contain a link to the homepage", () => {
            renderFunc({
                UserContextOverride: {
                    cart: { response: { data: null }, awaiting: false },
                } as unknown as IUserContext,
            });

            const errorSection = screen.getByRole("alert");
            expect(errorSection).toBeInTheDocument();

            const homepageLink = within(errorSection).getByRole("link", { name: "click here" });
            expect(homepageLink).toBeInTheDocument();
            expect(homepageLink).toHaveAttribute("href", "/");
        });

        test("That should contain a button that, on click, should invoke the UserContext's 'cart.attempt' function", async () => {
            const attemptSpy = vi.fn();

            renderFunc({
                UserContextOverride: {
                    cart: { response: { data: null }, attempt: attemptSpy, awaiting: false },
                } as unknown as IUserContext,
            });

            const errorSection = screen.getByRole("alert");
            expect(errorSection).toBeInTheDocument();

            const tryAgainButton = within(errorSection).getByRole("button", { name: "Try again" });
            expect(tryAgainButton).toBeInTheDocument();

            expect(attemptSpy).not.toHaveBeenCalled();

            await act(async () => userEvent.click(tryAgainButton));

            expect(attemptSpy).toHaveBeenCalled();
        });
    });
});
