import { vi } from "vitest";
import { screen, render } from "@test-utils";
import _ from "lodash";
import { IUserContext, UserContext } from "@/pages/Root";
import { RecursivePartial } from "@/utils/types";
import { BrowserRouter } from "react-router-dom";
import { CartContent } from ".";

// Mock dependencies
const mockUserContext: RecursivePartial<IUserContext> = {
    cart: {
        // Only using fields relevant to the CartContent component
        response: {
            data: {
                items: [],
                promotions: [],
            } as unknown as IUserContext["cart"]["response"]["data"],
        },
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
                <CartContent />
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
    CartSummary: vi.fn((props: unknown) => {
        return <div aria-label="CartSummary component" data-props={JSON.stringify(props)}></div>;
    }),
}));

vi.mock("@/features/Cart/components/CartItem", () => ({
    CartItem: vi.fn((props: unknown) => {
        return <div aria-label="CartItem component" data-props={JSON.stringify(props)}></div>;
    }),
}));

describe("The CartContent component...", () => {
    afterEach(() => {
        window.history.pushState({}, "", "/");
    });

    test("Should render the CartSummary component passing the correct props", () => {
        renderFunc();

        const CartSummary = screen.getByLabelText("CartSummary component");
        expect(CartSummary).toBeInTheDocument();

        const props = CartSummary.getAttribute("data-props");
        expect(JSON.parse(props!)).toStrictEqual(
            expect.objectContaining({
                layout: "visible",
                headerText: "Your Cart",
                hideEditLink: true,
                CartItemProps: expect.objectContaining({
                    editableQuantity: true,
                }),
            }),
        );
    });

    describe("Should render a react-router-dom Link component...", () => {
        test("With an accessible name equal to: 'Proceed to checkout'", () => {
            renderFunc();

            const checkoutLink = screen.getByRole("link", { name: "Proceed to checkout" });
            expect(checkoutLink).toBeInTheDocument();
        });

        test("With an 'href' attribute equal to: '/checkout'", () => {
            renderFunc();

            const checkoutLink = screen.getByRole("link", { name: "Proceed to checkout" });
            expect(checkoutLink).toHaveAttribute("href", "/checkout");
        });

        describe("That should have a 'data-disabled' attribute equal to 'true' if...", () => {
            test("The UserContext's cart data is still being awaited", () => {
                renderFunc({ UserContextOverride: { cart: { awaiting: true } } as IUserContext });

                const checkoutLink = screen.getByRole("link", { name: "Proceed to checkout" });
                expect(checkoutLink).toHaveAttribute("data-disabled", "true");
            });

            test("The number of items in the user's cart is 0", () => {
                renderFunc({
                    UserContextOverride: {
                        cart: { response: { data: { items: [] } } },
                    } as unknown as IUserContext,
                });

                const checkoutLink = screen.queryByRole("link", { name: "Proceed to checkout" });
                expect(checkoutLink).toHaveAttribute("data-disabled", "true");
            });
        });

        describe("That should have a 'data-disabled' attribute equal to 'false' if...", () => {
            test("The UserContext's cart data is not being awaited and the number of items in the user's cart exceeds 0", () => {
                renderFunc({
                    UserContextOverride: {
                        cart: {
                            response: {
                                data: {
                                    items: [
                                        { product: {}, variant: { id: "variant1Id" }, quantity: 1 },
                                    ],
                                },
                            },
                        },
                    } as unknown as IUserContext,
                });

                const checkoutLink = screen.queryByRole("link", { name: "Proceed to checkout" });
                expect(checkoutLink).toHaveAttribute("data-disabled", "false");
            });
        });
    });
});
