import { vi } from "vitest";
import { screen, render, within, userEvent } from "@test-utils";
import _ from "lodash";
import { act } from "react";
import { IRootContext, RootContext, IUserContext, UserContext } from "@/pages/Root";
import { RecursivePartial } from "@/utils/types";
import { BrowserRouter } from "react-router-dom";
import { CartSummary, TCartSummary } from ".";

// Mock dependencies
const mockProps: RecursivePartial<TCartSummary> = {
    layout: "visible",
    headerText: "CartSummary Header",
    hideEditLink: false,
    classNames: {
        root: "cart-summary",
        header: "cart-summary-header",
        editLink: "edit-cart-link",
        itemsContainer: "cart-items",
        emptyCartMessage: "empty-cart-message",
        costBreakdown: {
            group: "cost-breakdown-group",
            line: "cost-breakdown-line",
        },
        promotions: {
            container: "promotions",
            group: "promotion-options-container",
            code: "promotion-code",
            description: "promotion-description",
            discountValue: "promotion-discount-value",
            deleteButton: "delete-promotion-button",
        },
        collapse: {
            root: "collapse",
            button: {
                root: "collapse-button-root",
                label: "collapse-button-label",
                right: "collapse-button-right",
                editLinkContainer: "collapse-button-edit-link-container",
            },
            top: "collapse-content-top",
            bottom: "collapse-content-bottom",
        },
    },
};

const mockRootContext: RecursivePartial<IRootContext> = {
    headerInfo: { active: false, open: true, height: 0, forceClose: () => {} },
};

const mockUserContext: RecursivePartial<IUserContext> = {
    // Only using fields relevant to the CartSummary component
    cart: {
        response: {
            data: {
                items: [
                    { product: { id: "1" }, variant: { id: "1-1" } },
                    { product: { id: "1" }, variant: { id: "1-3" } },
                    { product: { id: "2" }, variant: { id: "2-1" } },
                    { product: { id: "3" }, variant: { id: "3-1" } },
                    { product: { id: "3" }, variant: { id: "3-2" } },
                ],
                promotions: [
                    {
                        code: "PROMO1",
                        description: "PROMO1 description",
                        threshold: 0,
                        discount: { value: 20, type: "percentage" },
                    },
                    {
                        code: "PROMO2",
                        description: "PROMO2 description",
                        threshold: 0,
                        discount: { value: 200, type: "fixed" },
                    },
                    {
                        code: "PROMO3",
                        description: "PROMO3 description",
                        threshold: 20000,
                        discount: { value: 100, type: "precentage" },
                    },
                ],
            } as unknown as IUserContext["cart"]["response"]["data"],
        },
        awaiting: false,
    },
    shipping: { value: "standard", setter: undefined },

    defaultData: { cart: { items: [], promotions: [] } },
};

type renderFuncArgs = {
    RootContextOverride?: IRootContext;
    UserContextOverride?: IUserContext;
    propsOverride?: TCartSummary;
    initRender?: boolean;
};
const renderFunc = async (args: renderFuncArgs = {}) => {
    const { RootContextOverride, UserContextOverride, propsOverride, initRender = false } = args;

    let RootContextValue!: IRootContext;
    let UserContextValue!: IUserContext;

    function Component({
        context,
        props,
    }: {
        context?: {
            Root?: renderFuncArgs["RootContextOverride"];
            User?: renderFuncArgs["UserContextOverride"];
        };
        props?: renderFuncArgs["propsOverride"];
    }) {
        const mergedRootContext = _.merge(_.cloneDeep(mockRootContext), context?.Root);
        const mergedUserContext = _.merge(_.cloneDeep(mockUserContext), context?.User);
        const mergedProps = _.merge(_.cloneDeep(mockProps), props);

        return (
            <RootContext.Provider value={mergedRootContext}>
                <RootContext.Consumer>
                    {(value) => {
                        RootContextValue = value;
                        return null;
                    }}
                </RootContext.Consumer>
                <UserContext.Provider value={mergedUserContext}>
                    <UserContext.Consumer>
                        {(value) => {
                            UserContextValue = value;
                            return null;
                        }}
                    </UserContext.Consumer>
                    <CartSummary {...mergedProps} />
                </UserContext.Provider>
            </RootContext.Provider>
        );
    }

    function BrowserRouterWrapper({
        context,
        props,
    }: {
        context?: {
            Root?: renderFuncArgs["RootContextOverride"];
            User?: renderFuncArgs["UserContextOverride"];
        };
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
                  context={{ Root: RootContextOverride, User: UserContextOverride }}
                  props={propsOverride}
              />,
          )
        : await act(() =>
              render(
                  <BrowserRouterWrapper
                      context={{ Root: RootContextOverride, User: UserContextOverride }}
                      props={propsOverride}
                  />,
              ),
          );

    return {
        rerenderFunc: (newArgs: renderFuncArgs) => {
            rerender(
                <BrowserRouterWrapper
                    context={{
                        Root: newArgs.RootContextOverride,
                        User: newArgs.UserContextOverride,
                    }}
                    props={newArgs.propsOverride}
                />,
            );
        },
        getRootContextValue: () => RootContextValue,
        getUserContextValue: () => UserContextValue,
        component: (
            <BrowserRouterWrapper
                context={{ Root: RootContextOverride, User: UserContextOverride }}
                props={propsOverride}
            />
        ),
    };
};

const mockCalculateCartSubtotalReturnValue = {
    cost: { products: 10000, total: 6200 },
    discount: {
        products: 1200,
        subscriptions: 800,
        promotions: {
            total: 1800,
            individual: [
                { code: "PROMO2", value: 200 },
                { code: "PROMO1", value: 1600 },
                { code: "PROMO3", value: 0 },
            ],
        },
    },
};
const mockCalculateCartSubtotal = vi.fn(() => mockCalculateCartSubtotalReturnValue);
vi.mock("@/utils/products/utils/calculateCartSubtotal", async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...(actual || {}),
        calculateCartSubtotal: () => mockCalculateCartSubtotal(),
    };
});

vi.mock("@/features/Cart/components/CartItem", () => ({
    CartItem: vi.fn((props: unknown & { data: { variant: { id: string } } }) => {
        return (
            <div
                aria-label="CartItem component"
                data-props={JSON.stringify(props)}
            >{`CartItem component: ${props.data.variant.id}`}</div>
        );
    }),
}));

vi.mock("@settings", () => ({
    settings: { freeDeliveryThreshold: 100, expressDeliveryCost: 599 },
}));

describe("The CartSummary component...", () => {
    describe("If the 'layout' prop is 'visible'...", () => {
        describe("Should render a heading element...", () => {
            test("With text content equal to the value of the 'headerText' prop", () => {
                renderFunc();

                const heading = screen.getByRole("heading", { name: mockProps.headerText });
                expect(heading).toBeInTheDocument();
            });

            test("Or text content equal to 'Cart summary' by default", () => {
                renderFunc({ propsOverride: { headerText: null } as unknown as TCartSummary });

                const heading = screen.getByRole("heading", { name: "Cart summary" });
                expect(heading).toBeInTheDocument();
            });
        });
    });

    describe("If the 'layout' prop is 'dropdown'...", () => {
        describe("Should render a button element...", () => {
            describe("Containing a text element for the button's label text...", () => {
                test("With text content equal to the value of the 'headerText' prop", () => {
                    renderFunc({ propsOverride: { layout: "dropdown" } });

                    const buttonLabel = screen.getByText(`${mockProps.headerText}`);
                    expect(buttonLabel).toBeInTheDocument();
                });

                test("Or 'Order Details' by default", () => {
                    renderFunc({
                        propsOverride: {
                            layout: "dropdown",
                            headerText: null,
                        } as unknown as TCartSummary,
                    });

                    const buttonLabel = screen.getByText("Order Details");
                    expect(buttonLabel).toBeInTheDocument();
                });

                test("Unless the UserContext's 'cart.awaiting' field is 'true'", () => {
                    renderFunc({
                        UserContextOverride: {
                            cart: { awaiting: true },
                        } as unknown as IUserContext,
                        propsOverride: { layout: "dropdown" },
                    });

                    // queryByText *does not* exclude hidden elements; must manually check visibility
                    const buttonLabel = screen.queryByText(`${mockProps.headerText}`);
                    expect(buttonLabel).not.toBeVisible();
                });
            });

            describe("Containing a text element for the cart's subtotal...", () => {
                test("In the format: £XX.XX", () => {
                    renderFunc({
                        propsOverride: {
                            layout: "dropdown",
                            headerText: null,
                        } as unknown as TCartSummary,
                    });

                    const { total } = mockCalculateCartSubtotalReturnValue.cost;

                    const cartSubtotal = screen.getByText(`£${(total / 100).toFixed(2)}`);
                    expect(cartSubtotal).toBeInTheDocument();
                });

                test("Unless the UserContext's 'cart.awaiting' field is 'true'", () => {
                    renderFunc({
                        UserContextOverride: {
                            cart: { awaiting: true },
                        } as unknown as IUserContext,
                        propsOverride: { layout: "dropdown" },
                    });

                    const { total } = mockCalculateCartSubtotalReturnValue.cost;

                    // queryByText *does not* exclude hidden elements; must manually check visibility
                    const cartSubtotal = screen.queryByText(`£${(total / 100).toFixed(2)}`);
                    expect(cartSubtotal).not.toBeVisible();
                });
            });

            test("That should, on click, open the dropdown (causing more content to appear, such as the 'Edit' Link component)", async () => {
                await renderFunc({ propsOverride: { layout: "dropdown" } });

                const button = screen.getByRole("button", {
                    name: new RegExp(`${mockProps.headerText}`, "i"),
                });

                let editLink = screen.queryByRole("link", { name: "Edit" });
                expect(editLink).not.toBeInTheDocument();

                await act(async () => userEvent.click(button));

                editLink = screen.getByRole("link", { name: "Edit" });
                expect(editLink).toBeInTheDocument();
            });
        });
    });

    describe("If the 'layout' prop is 'visible', or if it is 'dropdown' and the dropdown is opened...", () => {
        describe("Should render a react-router-dom Link component...", () => {
            test("With text content equal to 'Edit'", () => {
                renderFunc();

                const editLink = screen.getByRole("link", { name: "Edit" });
                expect(editLink).toBeInTheDocument();
            });

            test("With an 'href' attribute equal to '/cart'", () => {
                renderFunc();

                const editLink = screen.getByRole("link", { name: "Edit" });
                expect(editLink).toHaveAttribute("href", "/cart");
            });

            test("Unless the 'hideEditLink' prop is 'true'", () => {
                renderFunc({ propsOverride: { hideEditLink: true } });

                const editLink = screen.queryByRole("link", { name: "Edit" });
                expect(editLink).not.toBeInTheDocument();
            });
        });

        describe("Should render a <ul> element...", () => {
            test("As expected", () => {
                renderFunc();

                const ulElement = screen.getByRole("list");
                expect(ulElement).toBeInTheDocument();
            });

            describe("That should contain CartItem components...", () => {
                test("For each entry in the UserContext's 'cart.response.data.items' array field", () => {
                    renderFunc();

                    const ulElement = screen.getByRole("list");

                    const { items } = mockUserContext.cart!.response!.data!;

                    items.forEach((item) => {
                        const { variant } = item!;
                        const { id } = variant!;

                        const CartItem = within(ulElement).getByText(`CartItem component: ${id}`);
                        expect(CartItem).toBeInTheDocument();
                    });
                });
            });

            test("Unless the UserContext's 'cart.response.data.items' field is empty", () => {
                renderFunc({
                    UserContextOverride: {
                        cart: { response: { data: { items: null } } },
                    } as unknown as IUserContext,
                });

                const ulElement = screen.queryByRole("list");
                expect(ulElement).not.toBeInTheDocument();
            });
        });

        test("Should render an element with the text: 'Your cart is empty.' if the UserContext's 'cart.response.data.items' field is empty...", () => {
            renderFunc({
                UserContextOverride: {
                    cart: { response: { data: { items: null } } },
                } as unknown as IUserContext,
            });

            const emptyCartMessage = screen.getByText("Your cart is empty.");
            expect(emptyCartMessage).toBeInTheDocument();
        });

        describe("Should render a cost breakdown...", () => {
            describe("Including the products' subtotal...", () => {
                test("In the format £XX.XX", () => {
                    renderFunc();

                    const { products } = mockCalculateCartSubtotalReturnValue.cost;

                    const productsCostSubtotal = screen.getByText(
                        `£${(products / 100).toFixed(2)}`,
                    );
                    expect(productsCostSubtotal).toBeInTheDocument();
                });

                test("Unless the UserContext's 'cart.awaiting' field is 'true'", () => {
                    renderFunc({
                        UserContextOverride: { cart: { awaiting: true } } as IUserContext,
                    });

                    const { products } = mockCalculateCartSubtotalReturnValue.cost;

                    // queryByText *does not* exclude hidden elements; must manually check visibility
                    const productsCostSubtotal = screen.queryByText(
                        `£${(products / 100).toFixed(2)}`,
                    );
                    expect(productsCostSubtotal).not.toBeVisible();
                });
            });

            describe("Including the products' discounts...", () => {
                test("In the format: -£XX.XX", () => {
                    renderFunc();

                    const { products } = mockCalculateCartSubtotalReturnValue.discount;

                    const productDiscountsSubtotal = screen.getByText(
                        `-£${(products / 100).toFixed(2)}`,
                    );
                    expect(productDiscountsSubtotal).toBeInTheDocument();
                });

                test("Unless the products' discounts value is 0", () => {
                    mockCalculateCartSubtotal.mockReturnValueOnce(
                        _.merge(_.cloneDeep(mockCalculateCartSubtotalReturnValue), {
                            discount: { products: 0 },
                        }),
                    );

                    renderFunc();

                    const productDiscountsSubtotal = screen.queryByText(`-£0.00`);
                    expect(productDiscountsSubtotal).not.toBeInTheDocument();
                });
            });

            describe("Including the subscription discounts...", () => {
                test("In the format: -£XX.XX", () => {
                    renderFunc();

                    const { subscriptions } = mockCalculateCartSubtotalReturnValue.discount;

                    const subscriptionDiscountsSubtotal = screen.getByText(
                        `-£${(subscriptions / 100).toFixed(2)}`,
                    );
                    expect(subscriptionDiscountsSubtotal).toBeInTheDocument();
                });

                test("Unless the subscription discounts value is 0", () => {
                    mockCalculateCartSubtotal.mockReturnValueOnce(
                        _.merge(_.cloneDeep(mockCalculateCartSubtotalReturnValue), {
                            discount: { subscriptions: 0 },
                        }),
                    );

                    renderFunc();

                    const subscriptionDiscountsSubtotal = screen.queryByText(`-£0.00`);
                    expect(subscriptionDiscountsSubtotal).not.toBeInTheDocument();
                });
            });

            describe("Including the promotion discounts...", () => {
                test("In the format: -£XX.XX", () => {
                    renderFunc();

                    const { promotions } = mockCalculateCartSubtotalReturnValue.discount;
                    const { total } = promotions;

                    const promotionDiscountsSubtotal = screen.getByText(
                        `-£${(total / 100).toFixed(2)}`,
                    );
                    expect(promotionDiscountsSubtotal).toBeInTheDocument();
                });

                test("Unless the promotion discounts value is 0", () => {
                    mockCalculateCartSubtotal.mockReturnValueOnce(
                        _.merge(_.cloneDeep(mockCalculateCartSubtotalReturnValue), {
                            discount: { promotions: { total: 0 } },
                        }),
                    );

                    renderFunc();

                    const promotionDiscountsSubtotal = screen.queryByText(`-£0.00`);
                    expect(promotionDiscountsSubtotal).not.toBeInTheDocument();
                });
            });

            describe("Including the information for each promotion applied to the cart...", () => {
                test("Including the promotion's code", () => {
                    renderFunc();

                    const { promotions } = mockUserContext.cart!.response!.data!;

                    promotions.forEach((promotion) => {
                        const { code } = promotion;

                        const promotionCode = screen.getByText(code);
                        expect(promotionCode).toBeInTheDocument();
                    });
                });

                test("Including the promotion's description", () => {
                    renderFunc();

                    const { promotions } = mockUserContext.cart!.response!.data!;

                    promotions.forEach((promotion) => {
                        const { description } = promotion;

                        const promotionDescription = screen.getByText(description);
                        expect(promotionDescription).toBeInTheDocument();
                    });
                });

                test("Including the promotion's discount value in the format: £XX.XX", () => {
                    renderFunc();

                    const { promotions } = mockUserContext.cart!.response!.data!;
                    const { individual } = mockCalculateCartSubtotalReturnValue.discount.promotions;

                    promotions.forEach((promotion) => {
                        const { code } = promotion;

                        const value = individual.find((p) => p.code === code)?.value || 0;

                        const promotionValue = screen.getByText(`£${(value / 100).toFixed(2)}`);
                        expect(promotionValue).toBeInTheDocument();
                    });
                });
            });

            describe("Should render a text input for applying promotions...", () => {
                test("With a label equal to: 'Enter a promotional code'", () => {
                    renderFunc();

                    const label = "Enter a promotional code";
                    const promotionInput = screen.getByRole("textbox", { name: label });
                    expect(promotionInput);
                });
            });

            describe("Including the postage cost...", () => {
                describe("Which, if the UserContext's 'shipping.value' field is 'standard'", () => {
                    test("Should display 'FREE'", () => {
                        renderFunc();

                        const postageSubtotal = screen.getByText("FREE");
                        expect(postageSubtotal).toBeInTheDocument();
                    });
                });

                describe("Which, if the UserContext's 'shipping.value' field is 'express'", () => {
                    test("Should be displayed in the format: £XX.XX", () => {
                        mockCalculateCartSubtotal.mockReturnValueOnce(
                            _.merge(_.cloneDeep(mockCalculateCartSubtotalReturnValue), {
                                cost: { total: 1 },
                            }),
                        );

                        renderFunc({
                            UserContextOverride: {
                                shipping: { value: "express" },
                            } as IUserContext,
                        });

                        const postageSubtotal = screen.getByText("£5.99");
                        expect(postageSubtotal).toBeInTheDocument();
                    });

                    test("Unless the cart subtotal exceeds the free delivery threshold, in which case 'FREE' should be displayed", () => {
                        renderFunc({
                            UserContextOverride: {
                                shipping: { value: "express" },
                            } as IUserContext,
                        });

                        const postageSubtotal = screen.getByText("FREE");
                        expect(postageSubtotal).toBeInTheDocument();
                    });
                });

                test("Unless the cart is empty", () => {
                    mockCalculateCartSubtotal.mockReturnValueOnce(
                        _.merge(_.cloneDeep(mockCalculateCartSubtotalReturnValue), {
                            cost: { total: 1 },
                        }),
                    );

                    renderFunc({
                        UserContextOverride: {
                            cart: { response: { data: { items: null } } },
                            shipping: { value: "express" },
                        } as unknown as IUserContext,
                    });

                    const postageSubtotal = screen.queryByText("£5.99");
                    expect(postageSubtotal).not.toBeInTheDocument();
                });

                test("Unless the UserContext's 'cart.awaiting' field is 'true'", () => {
                    mockCalculateCartSubtotal.mockReturnValueOnce(
                        _.merge(_.cloneDeep(mockCalculateCartSubtotalReturnValue), {
                            cost: { total: 1 },
                        }),
                    );

                    renderFunc({
                        UserContextOverride: {
                            cart: { awaiting: true },
                            shipping: { value: "express" },
                        } as unknown as IUserContext,
                    });

                    // queryByText *does not* exclude hidden elements; must manually check visibility
                    const postageSubtotal = screen.queryByText("£5.99");
                    expect(postageSubtotal).not.toBeVisible();
                });
            });

            describe("Including the cart's subtotal...", () => {
                test("In the format: £XX.XX", () => {
                    renderFunc();

                    const { total } = mockCalculateCartSubtotalReturnValue.cost;

                    const cartSubtotal = screen.getByText(`£${(total / 100).toFixed(2)}`);
                    expect(cartSubtotal).toBeInTheDocument();
                });

                test("Unless the cart is empty", () => {
                    renderFunc({
                        UserContextOverride: {
                            cart: { response: { data: { items: null } } },
                        } as unknown as IUserContext,
                    });

                    const { total } = mockCalculateCartSubtotalReturnValue.cost;

                    const cartSubtotal = screen.queryByText(`£${(total / 100).toFixed(2)}`);
                    expect(cartSubtotal).not.toBeInTheDocument();
                });

                test("Unless the UserContext's 'cart.awaiting' field is 'true'", () => {
                    renderFunc({
                        UserContextOverride: {
                            cart: { awaiting: true },
                        } as unknown as IUserContext,
                    });

                    const { total } = mockCalculateCartSubtotalReturnValue.cost;

                    // queryByText *does not* exclude hidden elements; must manually check visibility
                    const cartSubtotal = screen.queryByText(`£${(total / 100).toFixed(2)}`);
                    expect(cartSubtotal).not.toBeVisible();
                });
            });
        });
    });
});
