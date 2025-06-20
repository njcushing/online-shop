import { vi } from "vitest";
import { screen, render, userEvent } from "@test-utils";
import _ from "lodash";
import { act } from "react";
import { BrowserRouter } from "react-router-dom";
import { AccountCreationForm, TAccountCreationForm } from ".";

const mockOnSuccess = vi.fn();
const mockProps: TAccountCreationForm = {
    onSuccess: mockOnSuccess,
};

type renderFuncArgs = {
    propsOverride?: TAccountCreationForm;
    initRender?: boolean;
};
const renderFunc = async (args: renderFuncArgs = {}) => {
    const { propsOverride, initRender = false } = args;

    function Component({ props }: { props?: renderFuncArgs["propsOverride"] }) {
        const mergedProps = _.merge(_.cloneDeep(mockProps), props);

        return <AccountCreationForm {...mergedProps} />;
    }

    function BrowserRouterWrapper({ props }: { props?: renderFuncArgs["propsOverride"] }) {
        return (
            // Using BrowserRouter for Link component(s)
            <BrowserRouter
                future={{
                    v7_startTransition: true,
                    v7_relativeSplatPath: true,
                }}
            >
                <Component props={props} />
            </BrowserRouter>
        );
    }

    // When using initRender, must wrap 'expect' in 'await waitFor'
    const { rerender } = initRender
        ? render(<BrowserRouterWrapper props={propsOverride} />)
        : await act(() => render(<BrowserRouterWrapper props={propsOverride} />));

    return {
        rerenderFunc: (newArgs: renderFuncArgs) => {
            rerender(<BrowserRouterWrapper props={newArgs.propsOverride} />);
        },
        component: <BrowserRouterWrapper props={propsOverride} />,
    };
};

describe("The AccountCreationForm component...", () => {
    afterEach(() => {
        mockOnSuccess.mockRestore();
    });

    test("Should render a <heading> element with the text content: 'Sign up to get started", () => {
        renderFunc();

        const headingElement = screen.getByText("Sign up to get started");
        expect(headingElement).toBeInTheDocument();
    });

    describe("Should render <button> elements for each of the OAuth options...", () => {
        test("Including one for Google", () => {
            renderFunc();

            const oAuthButtonGoogle = screen.getByRole("link", { name: "Sign up with Google" });
            expect(oAuthButtonGoogle).toBeInTheDocument();
        });

        test("Including one for Facebook", () => {
            renderFunc();

            const oAuthButtonFacebook = screen.getByRole("link", { name: "Sign up with Facebook" });
            expect(oAuthButtonFacebook).toBeInTheDocument();
        });

        test("Including one for X", () => {
            renderFunc();

            const oAuthButtonX = screen.getByRole("link", { name: "Sign up with X" });
            expect(oAuthButtonX).toBeInTheDocument();
        });

        test("Including one for GitHub", () => {
            renderFunc();

            const oAuthButtonGitHub = screen.getByRole("link", { name: "Sign up with GitHub" });
            expect(oAuthButtonGitHub).toBeInTheDocument();
        });
    });

    describe("Should render a <form> element...", () => {
        test("With a 'text' <input> element for the user's email address", () => {
            renderFunc();

            const inputEmail = screen.getByRole("textbox", { name: "Email address" });
            expect(inputEmail).toBeInTheDocument();
        });

        test("With a 'password' <input> element for the user's password", () => {
            renderFunc();

            const inputPassword = screen.getByLabelText("Password");
            expect(inputPassword).toBeInTheDocument();
            expect(inputPassword.tagName).toBe("INPUT");
        });

        test("With a 'password' <input> element for the user to confirm their password", () => {
            renderFunc();

            const inputConfirmPassword = screen.getByLabelText("Confirm password");
            expect(inputConfirmPassword).toBeInTheDocument();
            expect(inputConfirmPassword.tagName).toBe("INPUT");
        });

        test("With a 'Sign Up' submit button", () => {
            renderFunc();

            const signUpButton = screen.getByRole("button", { name: "Sign Up" });
            expect(signUpButton).toBeInTheDocument();
        });

        describe("That, on submission...", () => {
            describe("If successful...", async () => {
                test("Should invoke the callback function passed to the 'onSuccess' prop", async () => {
                    await renderFunc();

                    const inputEmail = screen.getByRole("textbox", { name: "Email address" });
                    await act(async () => userEvent.type(inputEmail, "name@email.com"));

                    const inputPassword = screen.getByLabelText("Password");
                    await act(async () => userEvent.type(inputPassword, "password"));

                    const inputConfirmPassword = screen.getByLabelText("Confirm password");
                    await act(async () => userEvent.type(inputConfirmPassword, "password"));

                    const signUpButton = screen.getByRole("button", { name: "Sign Up" });

                    await act(async () => userEvent.click(signUpButton));

                    expect(mockOnSuccess).toHaveBeenCalled();
                });
            });

            describe("If unsuccessful...", async () => {
                test("Should not invoke the callback function passed to the 'onSuccess' prop", async () => {
                    await renderFunc();

                    const signUpButton = screen.getByRole("button", { name: "Sign Up" });

                    await act(async () => userEvent.click(signUpButton));

                    expect(mockOnSuccess).not.toHaveBeenCalled();
                });

                test("Should display error messages for the invalid fields", async () => {
                    await renderFunc();

                    const signUpButton = screen.getByRole("button", { name: "Sign Up" });

                    expect(
                        screen.queryByText(
                            "Invalid email format. Please use the following format: example@email.com",
                        ),
                    ).not.toBeInTheDocument();
                    expect(
                        screen.queryByText(
                            "Please enter a password at least 8 characters in length",
                        ),
                    ).not.toBeInTheDocument();

                    await act(async () => userEvent.click(signUpButton));

                    expect(
                        screen.getByText(
                            "Invalid email format. Please use the following format: example@email.com",
                        ),
                    ).toBeInTheDocument();
                    expect(
                        screen.getAllByText(
                            "Please enter a password at least 8 characters in length",
                        ),
                    ).toHaveLength(2);

                    expect(screen.queryByText("Passwords do not match")).not.toBeInTheDocument();

                    const inputPassword = screen.getByLabelText("Password");
                    await act(async () => userEvent.type(inputPassword, "different"));

                    const inputConfirmPassword = screen.getByLabelText("Confirm password");
                    await act(async () => userEvent.type(inputConfirmPassword, "passwords"));

                    await act(async () => userEvent.click(signUpButton));

                    expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
                });
            });
        });
    });

    test("Should render a link to the login page", () => {
        renderFunc();

        const linkLogin = screen.getByRole("link", { name: "Log in here" });
        expect(linkLogin).toBeInTheDocument();
    });
});
