import { vi } from "vitest";
import { screen, render, within, userEvent } from "@test-utils";
import _ from "lodash";
import { act } from "react";
import { IUserContext, UserContext } from "@/pages/Root";
import { RecursivePartial } from "@/utils/types";
import { BrowserRouter } from "react-router-dom";
import { PersonalInformationForm, TPersonalInformationForm } from ".";

// Mock dependencies
const mockProps: RecursivePartial<TPersonalInformationForm> = {
    isOpen: true,
    onSubmit: undefined,
};

const mockUserContext: RecursivePartial<IUserContext> = {
    // Only using fields relevant to the PersonalInformationForm component
    user: {
        response: {
            data: {
                profile: {
                    personal: {
                        firstName: "testFirstName",
                        lastName: "testLastName",
                        phone: "+441234567890",
                        email: "email@address.com",
                    },
                },
            } as unknown as IUserContext["user"]["response"]["data"],
        },
        awaiting: false,
    },
    cart: {
        awaiting: false,
    },

    defaultData: {
        user: { profile: { personal: { firstName: "", lastName: "", phone: "", email: "" } } },
    },
};

type renderFuncArgs = {
    UserContextOverride?: IUserContext;
    propsOverride?: TPersonalInformationForm;
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
                <PersonalInformationForm {...mergedProps} />
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

describe("The PersonalInformationForm component...", () => {
    describe("Should render a <form> element...", () => {
        test("With an accessible name equal to: 'checkout personal information'", () => {
            renderFunc();

            const form = screen.getByRole("form", { name: "checkout personal information" });
            expect(form).toBeInTheDocument();
        });

        describe("That should contain an <input> element for the user's first name...", () => {
            test("With an accessible name equal to: 'First name'", () => {
                renderFunc();

                const form = screen.getByRole("form");

                const firstNameInput = within(form).getByRole("textbox", { name: "First name" });
                expect(firstNameInput).toBeInTheDocument();
            });

            test("With a default value equal to the UserContext's 'user.response.data.profile.personal.firstName' field", () => {
                renderFunc();

                const form = screen.getByRole("form");

                const defaultInputValue =
                    mockUserContext.user!.response!.data!.profile!.personal!.firstName;

                const firstNameInput = within(form).getByRole("textbox", { name: "First name" });
                expect(firstNameInput).toHaveValue(defaultInputValue);
            });

            test("Or an empty string if the UserContext's 'user.response.data.profile.personal.firstName' field is falsy", () => {
                renderFunc({
                    UserContextOverride: {
                        user: {
                            response: { data: { profile: { personal: { firstName: null } } } },
                        },
                    } as unknown as IUserContext,
                });

                const form = screen.getByRole("form");

                const firstNameInput = within(form).getByRole("textbox", { name: "First name" });
                expect(firstNameInput).toHaveValue("");
            });
        });

        describe("That should contain an <input> element for the user's last name...", () => {
            test("With an accessible name equal to: 'Last name'", () => {
                renderFunc();

                const form = screen.getByRole("form");

                const lastNameInput = within(form).getByRole("textbox", { name: "Last name" });
                expect(lastNameInput).toBeInTheDocument();
            });

            test("With a default value equal to the UserContext's 'user.response.data.profile.personal.lastName' field", () => {
                renderFunc();

                const form = screen.getByRole("form");

                const defaultInputValue =
                    mockUserContext.user!.response!.data!.profile!.personal!.lastName;

                const lastNameInput = within(form).getByRole("textbox", { name: "Last name" });
                expect(lastNameInput).toHaveValue(defaultInputValue);
            });

            test("Or an empty string if the UserContext's 'user.response.data.profile.personal.lastName' field is falsy", () => {
                renderFunc({
                    UserContextOverride: {
                        user: {
                            response: { data: { profile: { personal: { lastName: null } } } },
                        },
                    } as unknown as IUserContext,
                });

                const form = screen.getByRole("form");

                const lastNameInput = within(form).getByRole("textbox", { name: "Last name" });
                expect(lastNameInput).toHaveValue("");
            });
        });

        describe("That should contain an <input> element for the user's email address...", () => {
            test("With an accessible name equal to: 'Email address'", () => {
                renderFunc();

                const form = screen.getByRole("form");

                const emailInput = within(form).getByRole("textbox", { name: "Email address" });
                expect(emailInput).toBeInTheDocument();
            });

            test("With a default value equal to the UserContext's 'user.response.data.profile.personal.email' field", () => {
                renderFunc();

                const form = screen.getByRole("form");

                const defaultInputValue =
                    mockUserContext.user!.response!.data!.profile!.personal!.email;

                const emailInput = within(form).getByRole("textbox", { name: "Email address" });
                expect(emailInput).toHaveValue(defaultInputValue);
            });

            test("Or an empty string if the UserContext's 'user.response.data.profile.personal.email' field is falsy", () => {
                renderFunc({
                    UserContextOverride: {
                        user: {
                            response: { data: { profile: { personal: { email: null } } } },
                        },
                    } as unknown as IUserContext,
                });

                const form = screen.getByRole("form");

                const emailInput = within(form).getByRole("textbox", { name: "Email address" });
                expect(emailInput).toHaveValue("");
            });
        });

        describe("That should contain an <input> element for the user's phone number...", () => {
            test("With an accessible name equal to: 'Phone number (optional)'", () => {
                renderFunc();

                const form = screen.getByRole("form");

                const phoneInput = within(form).getByRole("textbox", {
                    name: "Phone number (optional)",
                });
                expect(phoneInput).toBeInTheDocument();
            });

            test("With a default value equal to the UserContext's 'user.response.data.profile.personal.phone' field", () => {
                renderFunc();

                const form = screen.getByRole("form");

                const defaultInputValue =
                    mockUserContext.user!.response!.data!.profile!.personal!.phone;

                const phoneInput = within(form).getByRole("textbox", {
                    name: "Phone number (optional)",
                });
                expect(phoneInput).toHaveValue(defaultInputValue);
            });

            test("Or an empty string if the UserContext's 'user.response.data.profile.personal.phone' field is falsy", () => {
                renderFunc({
                    UserContextOverride: {
                        user: {
                            response: { data: { profile: { personal: { phone: null } } } },
                        },
                    } as unknown as IUserContext,
                });

                const form = screen.getByRole("form");

                const phoneInput = within(form).getByRole("textbox", {
                    name: "Phone number (optional)",
                });
                expect(phoneInput).toHaveValue("");
            });
        });

        describe("That should contain a submit button...", () => {
            test("With an accessible name equal to: 'Continue to shipping'", () => {
                renderFunc();

                const form = screen.getByRole("form");

                const submitButton = within(form).getByRole("button", {
                    name: "Continue to shipping",
                });
                expect(submitButton).toBeInTheDocument();
            });

            describe("That, on click...", async () => {
                test("Should cause the callback function passed to the 'onSubmit' prop to be invoked", async () => {
                    const onSubmitSpy = vi.fn();

                    await renderFunc({
                        propsOverride: {
                            onSubmit: onSubmitSpy,
                        } as unknown as TPersonalInformationForm,
                    });

                    const form = screen.getByRole("form");

                    const submitButton = within(form).getByRole("button", {
                        name: "Continue to shipping",
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
                                response: { data: { profile: { personal: { firstName: "" } } } },
                            },
                        } as unknown as IUserContext,
                        propsOverride: {
                            onSubmit: onSubmitSpy,
                        } as unknown as TPersonalInformationForm,
                    });

                    const form = screen.getByRole("form");

                    const submitButton = within(form).getByRole("button", {
                        name: "Continue to shipping",
                    });

                    expect(onSubmitSpy).toHaveBeenCalledTimes(0);

                    await act(async () => userEvent.click(submitButton));

                    expect(onSubmitSpy).toHaveBeenCalledTimes(0);
                });
            });
        });

        test("Unless the 'isOpen' prop is 'false'", () => {
            renderFunc({ propsOverride: { isOpen: false } as TPersonalInformationForm });

            const form = screen.queryByRole("form");
            expect(form).not.toBeInTheDocument();
        });
    });
});
