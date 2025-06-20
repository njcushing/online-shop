import { vi } from "vitest";
import { screen, render, userEvent } from "@test-utils";
import _ from "lodash";
import { act } from "react";
import { BrowserRouter } from "react-router-dom";
import { LoginForm, TLoginForm } from ".";

const mockOnSuccess = vi.fn();
const mockProps: TLoginForm = {
    onSuccess: mockOnSuccess,
};

type renderFuncArgs = {
    propsOverride?: TLoginForm;
    initRender?: boolean;
};
const renderFunc = async (args: renderFuncArgs = {}) => {
    const { propsOverride, initRender = false } = args;

    function Component({ props }: { props?: renderFuncArgs["propsOverride"] }) {
        const mergedProps = _.merge(_.cloneDeep(mockProps), props);

        return <LoginForm {...mergedProps} />;
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

describe("The LoginForm component...", () => {
    afterEach(() => {
        mockOnSuccess.mockRestore();
    });

    test("Should render a <heading> element with the text content: 'Log in to continue'", () => {
        renderFunc();

        const headingElement = screen.getByText("Log in to continue");
        expect(headingElement).toBeInTheDocument();
    });

    describe("Should render <button> elements for each of the OAuth options...", () => {
        test("Including one for Google", () => {
            renderFunc();

            const oAuthButtonGoogle = screen.getByRole("link", { name: "Sign in with Google" });
            expect(oAuthButtonGoogle).toBeInTheDocument();
        });

        test("Including one for Facebook", () => {
            renderFunc();

            const oAuthButtonFacebook = screen.getByRole("link", { name: "Sign in with Facebook" });
            expect(oAuthButtonFacebook).toBeInTheDocument();
        });

        test("Including one for X", () => {
            renderFunc();

            const oAuthButtonX = screen.getByRole("link", { name: "Sign in with X" });
            expect(oAuthButtonX).toBeInTheDocument();
        });

        test("Including one for GitHub", () => {
            renderFunc();

            const oAuthButtonGitHub = screen.getByRole("link", { name: "Sign in with GitHub" });
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

        test("With a 'Log In' submit button", () => {
            renderFunc();

            const logInButton = screen.getByRole("button", { name: "Log In" });
            expect(logInButton).toBeInTheDocument();
        });

        describe("That, on submission...", () => {
            describe("If successful...", async () => {
                test("Should invoke the callback function passed to the 'onSuccess' prop", async () => {
                    await renderFunc();

                    const inputEmail = screen.getByRole("textbox", { name: "Email address" });
                    await act(async () => userEvent.type(inputEmail, "name@email.com"));

                    const inputPassword = screen.getByLabelText("Password");
                    await act(async () => userEvent.type(inputPassword, "password"));

                    const logInButton = screen.getByRole("button", { name: "Log In" });

                    await act(async () => userEvent.click(logInButton));

                    expect(mockOnSuccess).toHaveBeenCalled();
                });
            });

            describe("If unsuccessful...", async () => {
                test("Should not invoke the callback function passed to the 'onSuccess' prop", async () => {
                    await renderFunc();

                    const logInButton = screen.getByRole("button", { name: "Log In" });

                    await act(async () => userEvent.click(logInButton));

                    expect(mockOnSuccess).not.toHaveBeenCalled();
                });

                test("Should display error messages for the invalid fields", async () => {
                    await renderFunc();

                    const logInButton = screen.getByRole("button", { name: "Log In" });

                    expect(
                        screen.queryByText("Please enter your email address"),
                    ).not.toBeInTheDocument();
                    expect(
                        screen.queryByText("Please enter your password"),
                    ).not.toBeInTheDocument();

                    await act(async () => userEvent.click(logInButton));

                    expect(screen.getByText("Please enter your email address")).toBeInTheDocument();
                    expect(screen.getByText("Please enter your password")).toBeInTheDocument();
                });
            });
        });
    });

    test("Should render a link to a page for handling forgotten passwords", () => {
        renderFunc();

        const linkForgotPassword = screen.getByRole("link", { name: "Forgot your password?" });
        expect(linkForgotPassword).toBeInTheDocument();
    });

    test("Should render a link to the account creation page", () => {
        renderFunc();

        const linkCreateAccount = screen.getByRole("link", { name: "Create one for free" });
        expect(linkCreateAccount).toBeInTheDocument();
    });
});
