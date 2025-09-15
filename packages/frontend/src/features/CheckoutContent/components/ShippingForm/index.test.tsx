import { vi } from "vitest";
import { screen, render, within, userEvent, waitFor } from "@test-utils";
import _ from "lodash";
import { act } from "react";
import { IUserContext, UserContext } from "@/pages/Root";
import { RecursivePartial } from "@/utils/types";
import { BrowserRouter } from "react-router-dom";
import { ShippingForm, TShippingForm } from ".";

// Mock dependencies
const mockProps: RecursivePartial<TShippingForm> = {
    isOpen: true,
    onReturn: undefined,
    onSubmit: undefined,
};

const mockUserContext: RecursivePartial<IUserContext> = {
    // Only using fields relevant to the ShippingForm component
    user: {
        response: {
            data: {
                profile: {
                    addresses: {
                        delivery: {
                            line1: "testLine1",
                            line2: "testLine2",
                            townCity: "testTownCity",
                            county: "testCounty",
                            postcode: "W1A 1AA",
                        },
                        billing: {
                            line1: "testLine1",
                            line2: "testLine2",
                            townCity: "testTownCity",
                            county: "testCounty",
                            postcode: "W1A 1AA",
                        },
                    },
                },
            } as unknown as IUserContext["user"]["response"]["data"],
        },
        awaiting: false,
    },
    cart: {
        response: {
            data: {
                items: [],
                promotions: [],
            } as unknown as IUserContext["cart"]["response"]["data"],
        },
        awaiting: false,
    },
    shipping: { value: "standard", setter: undefined },

    defaultData: {
        user: {
            profile: {
                addresses: {
                    delivery: { line1: "", line2: "", townCity: "", county: "", postcode: "" },
                    billing: { line1: "", line2: "", townCity: "", county: "", postcode: "" },
                },
            },
        },
    },
};

type renderFuncArgs = {
    UserContextOverride?: IUserContext;
    propsOverride?: TShippingForm;
    initRender?: boolean;
};
const renderFunc = async (args: renderFuncArgs = {}) => {
    const { UserContextOverride, propsOverride, initRender = false } = args;

    let UserContextValue!: IUserContext;

    function Component({
        context,
        props,
    }: {
        context?: { User?: renderFuncArgs["UserContextOverride"] };
        props?: renderFuncArgs["propsOverride"];
    }) {
        const mergedUserContext = _.merge(_.cloneDeep(mockUserContext), context?.User);
        const mergedProps = _.merge(_.cloneDeep(mockProps), props);

        return (
            <UserContext.Provider value={mergedUserContext}>
                <UserContext.Consumer>
                    {(value) => {
                        UserContextValue = value;
                        return null;
                    }}
                </UserContext.Consumer>
                <ShippingForm {...mergedProps} />
            </UserContext.Provider>
        );
    }

    function BrowserRouterWrapper({
        context,
        props,
    }: {
        context?: { User?: renderFuncArgs["UserContextOverride"] };
        props?: renderFuncArgs["propsOverride"];
    }) {
        return (
            // Using BrowserRouter for Link component(s)
            <BrowserRouter
                future={{
                    v7_startTransition: true,
                    v7_relativeSplatPath: true,
                }}
            >
                <Component context={context} props={props} />
            </BrowserRouter>
        );
    }

    // When using initRender, must wrap 'expect' in 'await waitFor'
    const { rerender } = initRender
        ? render(
              <BrowserRouterWrapper
                  context={{ User: UserContextOverride }}
                  props={propsOverride}
              />,
          )
        : await act(() =>
              render(
                  <BrowserRouterWrapper
                      context={{ User: UserContextOverride }}
                      props={propsOverride}
                  />,
              ),
          );

    return {
        rerenderFunc: (newArgs: renderFuncArgs) => {
            rerender(
                <BrowserRouterWrapper
                    context={{ User: newArgs.UserContextOverride }}
                    props={newArgs.propsOverride}
                />,
            );
        },
        getUserContextValue: () => UserContextValue,
        component: (
            <BrowserRouterWrapper context={{ User: UserContextOverride }} props={propsOverride} />
        ),
    };
};

describe("The ShippingForm component...", () => {
    describe("Should render a <form> element...", () => {
        test("With an accessible name equal to: 'checkout shipping'", () => {
            renderFunc();

            const form = screen.getByRole("form", { name: "checkout shipping" });
            expect(form).toBeInTheDocument();
        });

        describe("That should contain a <fieldset> element for the user's delivery address...", () => {
            test("With a <legend> element with text content equal to: 'Delivery address'", () => {
                renderFunc();

                const form = screen.getByRole("form");

                const fieldset = within(form).getByRole("group", { name: "Delivery address" });
                expect(fieldset).toBeInTheDocument();
            });

            describe("That should contain <input> elements for the user's delivery address fields...", () => {
                test("With appropriate accessible names", () => {
                    renderFunc();

                    const form = screen.getByRole("form");

                    const fieldset = within(form).getByRole("group", { name: "Delivery address" });

                    const line1 = within(fieldset).getByRole("textbox", { name: "Line 1" });
                    const line2 = within(fieldset).getByRole("textbox", { name: "Line 2" });
                    const townCity = within(fieldset).getByRole("textbox", { name: "Town/City" });
                    const county = within(fieldset).getByRole("textbox", { name: "County" });
                    const postcode = within(fieldset).getByRole("textbox", { name: "Postcode" });

                    expect(line1).toBeInTheDocument();
                    expect(line2).toBeInTheDocument();
                    expect(townCity).toBeInTheDocument();
                    expect(county).toBeInTheDocument();
                    expect(postcode).toBeInTheDocument();
                });

                test("With default values equal to the UserContext's 'user.response.data.profile.addresses.delivery' object's fields", () => {
                    renderFunc();

                    const form = screen.getByRole("form");

                    const fieldset = within(form).getByRole("group", { name: "Delivery address" });

                    const {
                        line1: line1Value,
                        line2: line2Value,
                        townCity: townCityValue,
                        county: countyValue,
                        postcode: postcodeValue,
                    } = mockUserContext.user!.response!.data!.profile!.addresses!.delivery!;

                    const line1 = within(fieldset).getByRole("textbox", { name: "Line 1" });
                    const line2 = within(fieldset).getByRole("textbox", { name: "Line 2" });
                    const townCity = within(fieldset).getByRole("textbox", { name: "Town/City" });
                    const county = within(fieldset).getByRole("textbox", { name: "County" });
                    const postcode = within(fieldset).getByRole("textbox", { name: "Postcode" });

                    expect(line1).toHaveValue(line1Value);
                    expect(line2).toHaveValue(line2Value);
                    expect(townCity).toHaveValue(townCityValue);
                    expect(county).toHaveValue(countyValue);
                    expect(postcode).toHaveValue(postcodeValue);
                });

                test("Or empty strings if the respective fields in the UserContext are falsy", () => {
                    renderFunc({
                        UserContextOverride: {
                            user: {
                                response: {
                                    data: {
                                        profile: {
                                            addresses: {
                                                delivery: {
                                                    line1: null,
                                                    line2: null,
                                                    townCity: null,
                                                    county: null,
                                                    postcode: null,
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        } as unknown as IUserContext,
                    });

                    const form = screen.getByRole("form");

                    const fieldset = within(form).getByRole("group", { name: "Delivery address" });

                    const line1 = within(fieldset).getByRole("textbox", { name: "Line 1" });
                    const line2 = within(fieldset).getByRole("textbox", { name: "Line 2" });
                    const townCity = within(fieldset).getByRole("textbox", { name: "Town/City" });
                    const county = within(fieldset).getByRole("textbox", { name: "County" });
                    const postcode = within(fieldset).getByRole("textbox", { name: "Postcode" });

                    expect(line1).toHaveValue("");
                    expect(line2).toHaveValue("");
                    expect(townCity).toHaveValue("");
                    expect(county).toHaveValue("");
                    expect(postcode).toHaveValue("");
                });
            });
        });

        describe("That should contain a 'billing address is the same as delivery address' checkbox <input> element...", () => {
            test("That should be checked by default", () => {
                renderFunc();

                const form = screen.getByRole("form");

                const checkbox = within(form).getByRole("checkbox");
                expect(checkbox).toBeInTheDocument();
                expect(checkbox).toBeChecked();
            });
        });

        describe("That should contain a <fieldset> element for the user's billing address...", () => {
            test("With a <legend> element with text content equal to: 'Billing address'", async () => {
                await renderFunc();

                const form = screen.getByRole("form");
                const checkbox = within(form).getByRole("checkbox");
                await act(async () => userEvent.click(checkbox));

                /**
                 * Fieldset is within animated collapsing element that hides its contents until its
                 * transition ends
                 */
                const fieldset = await waitFor(() => {
                    return within(form).getByRole("group", { name: "Billing address" });
                });
                expect(fieldset).toBeInTheDocument();
            });

            test("Unless the 'billing address is the same as delivery address' checkbox is checked", async () => {
                await renderFunc();

                const form = screen.getByRole("form");

                const fieldset = await waitFor(() => {
                    return within(form).queryByRole("group", { name: "Billing address" });
                });
                expect(fieldset).not.toBeInTheDocument();
            });

            describe("That should contain <input> elements for the user's billing address fields...", () => {
                test("With appropriate accessible names", async () => {
                    await renderFunc();

                    const form = screen.getByRole("form");
                    const checkbox = within(form).getByRole("checkbox");
                    await act(async () => userEvent.click(checkbox));

                    const fieldset = await waitFor(() => {
                        return within(form).getByRole("group", { name: "Billing address" });
                    });

                    const line1 = within(fieldset).getByRole("textbox", { name: "Line 1" });
                    const line2 = within(fieldset).getByRole("textbox", { name: "Line 2" });
                    const townCity = within(fieldset).getByRole("textbox", { name: "Town/City" });
                    const county = within(fieldset).getByRole("textbox", { name: "County" });
                    const postcode = within(fieldset).getByRole("textbox", { name: "Postcode" });

                    expect(line1).toBeInTheDocument();
                    expect(line2).toBeInTheDocument();
                    expect(townCity).toBeInTheDocument();
                    expect(county).toBeInTheDocument();
                    expect(postcode).toBeInTheDocument();
                });
            });
        });

        describe("That should contain a return button...", () => {
            test("With an accessible name equal to: 'Return to personal'", () => {
                renderFunc();

                const form = screen.getByRole("form");

                const returnButton = within(form).getByRole("button", {
                    name: "Return to personal",
                });
                expect(returnButton).toBeInTheDocument();
            });

            test("That, on click, should cause the callback function passed to the 'onReturn' prop to be invoked", async () => {
                const onReturnSpy = vi.fn();

                await renderFunc({
                    propsOverride: {
                        onReturn: onReturnSpy,
                    } as unknown as TShippingForm,
                });

                const form = screen.getByRole("form");

                const returnButton = within(form).getByRole("button", {
                    name: "Return to personal",
                });

                expect(onReturnSpy).toHaveBeenCalledTimes(0);

                await act(async () => userEvent.click(returnButton));

                expect(onReturnSpy).toHaveBeenCalledTimes(1);
            });
        });

        describe("That should contain a submit button...", () => {
            test("With an accessible name equal to: 'Continue to payment'", () => {
                renderFunc();

                const form = screen.getByRole("form");

                const submitButton = within(form).getByRole("button", {
                    name: "Continue to payment",
                });
                expect(submitButton).toBeInTheDocument();
            });

            describe("That, on click...", async () => {
                test("Should cause the callback function passed to the 'onSubmit' prop to be invoked", async () => {
                    const onSubmitSpy = vi.fn();

                    await renderFunc({
                        propsOverride: {
                            onSubmit: onSubmitSpy,
                        } as unknown as TShippingForm,
                    });

                    const form = screen.getByRole("form");

                    const submitButton = within(form).getByRole("button", {
                        name: "Continue to payment",
                    });

                    expect(onSubmitSpy).toHaveBeenCalledTimes(0);

                    await act(async () => userEvent.click(submitButton));

                    expect(onSubmitSpy).toHaveBeenCalledTimes(1);
                });

                test("Unless any of the form fields are invalid", async () => {
                    const onSubmitSpy = vi.fn();

                    await renderFunc({
                        UserContextOverride: {
                            user: {
                                response: {
                                    data: { profile: { addresses: { delivery: { line1: "" } } } },
                                },
                            },
                        } as unknown as IUserContext,
                        propsOverride: {
                            onSubmit: onSubmitSpy,
                        } as unknown as TShippingForm,
                    });

                    const form = screen.getByRole("form");

                    const submitButton = within(form).getByRole("button", {
                        name: "Continue to payment",
                    });

                    expect(onSubmitSpy).toHaveBeenCalledTimes(0);

                    await act(async () => userEvent.click(submitButton));

                    expect(onSubmitSpy).toHaveBeenCalledTimes(0);
                });
            });
        });
    });

    test("Unless the 'isOpen' prop is 'false'", () => {
        renderFunc({ propsOverride: { isOpen: false } as TShippingForm });

        const form = screen.queryByRole("form");
        expect(form).not.toBeInTheDocument();
    });
});
