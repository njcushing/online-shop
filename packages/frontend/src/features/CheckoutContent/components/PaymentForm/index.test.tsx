import { vi } from "vitest";
import { screen, render, within, userEvent } from "@test-utils";
import _ from "lodash";
import { act } from "react";
import { IUserContext, UserContext } from "@/pages/Root";
import { RecursivePartial } from "@/utils/types";
import { BrowserRouter } from "react-router-dom";
import { PaymentForm, TPaymentForm } from ".";

// Mock dependencies
const mockProps: RecursivePartial<TPaymentForm> = {
    isOpen: true,
    onReturn: undefined,
    onSubmit: undefined,
};

const mockUserContext: RecursivePartial<IUserContext> = {
    // Only using fields relevant to the PaymentForm component
    user: {
        response: {
            data: {} as unknown as IUserContext["user"]["response"]["data"],
        },
        awaiting: false,
    },
    cart: {
        awaiting: false,
    },

    defaultData: {
        user: {},
    },
};

type renderFuncArgs = {
    UserContextOverride?: IUserContext;
    propsOverride?: TPaymentForm;
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
                <PaymentForm {...mergedProps} />
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

describe("The PaymentForm component...", () => {
    describe("Should render a <form> element...", () => {
        test("With an accessible name equal to: 'checkout payment'", () => {
            renderFunc();

            const form = screen.getByRole("form", { name: "checkout payment" });
            expect(form).toBeInTheDocument();
        });

        describe("That should contain a return button...", () => {
            test("With an accessible name equal to: 'Return to shipping'", () => {
                renderFunc();

                const form = screen.getByRole("form");

                const returnButton = within(form).getByRole("button", {
                    name: "Return to shipping",
                });
                expect(returnButton).toBeInTheDocument();
            });

            test("That, on click, should cause the callback function passed to the 'onReturn' prop to be invoked", async () => {
                const onReturnSpy = vi.fn();

                await renderFunc({
                    propsOverride: {
                        onReturn: onReturnSpy,
                    } as unknown as TPaymentForm,
                });

                const form = screen.getByRole("form");

                const returnButton = within(form).getByRole("button", {
                    name: "Return to shipping",
                });

                expect(onReturnSpy).toHaveBeenCalledTimes(0);

                await act(async () => userEvent.click(returnButton));

                expect(onReturnSpy).toHaveBeenCalledTimes(1);
            });
        });
    });

    test("Unless the 'isOpen' prop is 'false'", () => {
        renderFunc({ propsOverride: { isOpen: false } as TPaymentForm });

        const form = screen.queryByRole("form", { name: "checkout payment" });
        expect(form).not.toBeInTheDocument();
    });
});
