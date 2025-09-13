import { vi } from "vitest";
import { screen, render, within, userEvent, fireEvent } from "@test-utils";
import _ from "lodash";
import { IUserContext, UserContext } from "@/pages/Root";
import { IProductContext, ProductContext } from "@/pages/Product";
import { frequencies } from "@/utils/products/subscriptions";
import { RecursivePartial } from "@/utils/types";
import { act } from "react";
import { SubscriptionToggle, TSubscriptionToggle } from ".";

// Mock dependencies
const mockProps: TSubscriptionToggle = {
    checked: true,
    selectedFrequency: "one_week",
    onToggle: () => {},
    onFrequencyChange: () => {},
};

const mockUserContext: RecursivePartial<IUserContext> = {
    // Only using fields relevant to the SubscriptionToggle component
    cart: {
        response: {
            data: { items: [], promotions: [] } as IUserContext["cart"]["response"]["data"],
        },
        awaiting: false,
    } as IUserContext["cart"],
};

const mockProductContext: RecursivePartial<IProductContext> = {
    // Only using fields relevant to the SubscriptionToggle component
    product: { awaiting: false },
    variant: {
        canSubscribe: true,
        price: {
            current: 1250,
            base: 1250,
            subscriptionDiscountPercentage: 10,
        },
    } as IProductContext["variant"],

    defaultData: {
        variant: {
            canSubscribe: true,
            price: {
                current: 1250,
                base: 1250,
                subscriptionDiscountPercentage: 0,
            },
        },
    },
};

type renderFuncArgs = {
    UserContextOverride?: IUserContext;
    ProductContextOverride?: IProductContext;
    propsOverride?: TSubscriptionToggle;
    initRender?: boolean;
};
const renderFunc = async (args: renderFuncArgs = {}) => {
    const { UserContextOverride, ProductContextOverride, propsOverride, initRender = false } = args;

    let UserContextValue!: IUserContext;
    let ProductContextValue!: IProductContext;

    function Component({
        context,
        props,
    }: {
        context?: {
            User?: renderFuncArgs["UserContextOverride"];
            Product?: renderFuncArgs["ProductContextOverride"];
        };
        props?: TSubscriptionToggle;
    }) {
        const mergedUserContext = _.merge(
            _.cloneDeep(structuredClone(mockUserContext)),
            context?.User,
        );

        const mergedProductContext = _.merge(
            _.cloneDeep(structuredClone(mockProductContext)),
            context?.Product,
        );

        const mergedProps = _.merge(_.cloneDeep(mockProps), props);

        return (
            <UserContext.Provider value={mergedUserContext}>
                <UserContext.Consumer>
                    {(value) => {
                        UserContextValue = value;
                        return null;
                    }}
                </UserContext.Consumer>
                <ProductContext.Provider value={mergedProductContext}>
                    <ProductContext.Consumer>
                        {(value) => {
                            ProductContextValue = value;
                            return null;
                        }}
                    </ProductContext.Consumer>
                    <SubscriptionToggle {...mergedProps} />
                </ProductContext.Provider>
            </UserContext.Provider>
        );
    }

    // When using initRender, must wrap 'expect' in 'await waitFor'
    const { rerender } = initRender
        ? render(
              <Component
                  context={{
                      User: UserContextOverride,
                      Product: ProductContextOverride,
                  }}
                  props={propsOverride}
              />,
          )
        : await act(() =>
              render(
                  <Component
                      context={{
                          User: UserContextOverride,
                          Product: ProductContextOverride,
                      }}
                      props={propsOverride}
                  />,
              ),
          );

    return {
        rerenderFunc: (newArgs: renderFuncArgs) => {
            rerender(
                <Component
                    context={{
                        User: newArgs.UserContextOverride,
                        Product: newArgs.ProductContextOverride,
                    }}
                    props={newArgs.propsOverride}
                />,
            );
        },
        getUserContextValue: () => UserContextValue,
        getProductContextValue: () => ProductContextValue,
        component: (
            <Component
                context={{
                    User: UserContextOverride,
                    Product: ProductContextOverride,
                }}
                props={propsOverride}
            />
        ),
    };
};

vi.mock("@settings", () => ({ settings: { lowStockThreshold: 5 } }));

describe("The SubscriptionToggle component...", () => {
    describe("Should render a <button> element for toggling the Mantine Collapse component...", () => {
        test("With a 'role' attribute equal to 'radio'", () => {
            renderFunc();

            const radioButton = screen.getByRole("radio");
            expect(radioButton.tagName).toBe("BUTTON");
        });

        test("That should be checked by default if the 'checked' prop is 'true'", () => {
            renderFunc({ propsOverride: { checked: true } as TSubscriptionToggle });

            const radioButton = screen.getByRole("radio");
            expect(radioButton.ariaChecked).toBe("true");
        });

        test("That should not be checked by default if the 'checked' prop is 'false'", () => {
            renderFunc({ propsOverride: { checked: false } as TSubscriptionToggle });

            const radioButton = screen.getByRole("radio");
            expect(radioButton.ariaChecked).toBe("false");
        });

        test("That should, on click, invoke the callback function provided by the 'onToggle' prop", async () => {
            const onToggleSpy = vi.fn();

            renderFunc({
                propsOverride: { onToggle: onToggleSpy } as unknown as TSubscriptionToggle,
            });

            const radioButton = screen.getByRole("radio");

            expect(onToggleSpy).toHaveBeenCalledTimes(0);

            await act(async () => userEvent.click(radioButton));

            expect(onToggleSpy).toHaveBeenCalledTimes(1);
        });

        test("Unless the ProductContext's product data is still being awaited", () => {
            renderFunc({
                ProductContextOverride: { product: { awaiting: true } } as IProductContext,
            });

            const radioButton = screen.queryByRole("radio");
            expect(radioButton).not.toBeInTheDocument();
        });

        test("Unless the variant's 'canSubscribe' field is 'false'", () => {
            renderFunc({
                ProductContextOverride: { variant: { canSubscribe: false } } as IProductContext,
            });

            const radioButton = screen.queryByRole("radio");
            expect(radioButton).not.toBeInTheDocument();
        });
    });

    describe("Should render a <select> element for selecting the delivery frequency...", () => {
        test("With label text equal to: 'Select a delivery frequency'", () => {
            renderFunc();

            const selectElement = screen.getByRole("combobox", {
                name: "Select a delivery frequency",
            });
            expect(selectElement).toBeInTheDocument();
        });

        test("With <option> elements for each subscription frequency", () => {
            renderFunc();

            const selectElement = screen.getByRole("combobox", {
                name: "Select a delivery frequency",
            });

            Object.values(frequencies).forEach((frequency) => {
                const { optionName } = frequency;

                const frequencyOption = within(selectElement).getByRole("option", {
                    name: optionName,
                });
                expect(frequencyOption).toBeInTheDocument();
            });
        });

        test("That, on change, should invoke the callback function passed to the 'onFrequencyChange' prop with the new value", async () => {
            const onFrequencyChangeSpy = vi.fn();

            renderFunc({
                propsOverride: {
                    onFrequencyChange: onFrequencyChangeSpy,
                } as unknown as TSubscriptionToggle,
            });

            const selectElement = screen.getByRole("combobox", {
                name: "Select a delivery frequency",
            });

            expect(onFrequencyChangeSpy).toHaveBeenCalledTimes(0);

            await act(async () =>
                fireEvent.change(selectElement, { target: { value: "two_weeks" } }),
            );

            expect(onFrequencyChangeSpy).toHaveBeenCalledTimes(1);
            expect(onFrequencyChangeSpy).toHaveBeenCalledWith("two_weeks");
        });

        test("Unless the ProductContext's product data is still being awaited", () => {
            renderFunc({
                ProductContextOverride: { product: { awaiting: true } } as IProductContext,
            });

            const selectElement = screen.queryByRole("combobox", {
                name: "Select a delivery frequency",
            });
            expect(selectElement).not.toBeInTheDocument();
        });

        test("Unless the variant's 'canSubscribe' field is 'false'", () => {
            renderFunc({
                ProductContextOverride: { variant: { canSubscribe: false } } as IProductContext,
            });

            const selectElement = screen.queryByRole("combobox", {
                name: "Select a delivery frequency",
            });
            expect(selectElement).not.toBeInTheDocument();
        });

        test("Unless the 'checked' prop is 'false'", () => {
            renderFunc({ propsOverride: { checked: false } as TSubscriptionToggle });

            const selectElement = screen.queryByRole("combobox", {
                name: "Select a delivery frequency",
            });
            expect(selectElement).not.toBeInTheDocument();
        });
    });
});
