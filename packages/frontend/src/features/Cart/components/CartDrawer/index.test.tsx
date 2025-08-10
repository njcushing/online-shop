import { vi } from "vitest";
import { screen, render, userEvent, within } from "@test-utils";
import _ from "lodash";
import { IUserContext, UserContext } from "@/pages/Root";
import { RecursivePartial } from "@/utils/types";
import { act } from "react";
import { BrowserRouter } from "react-router-dom";
import { CartDrawer, TCartDrawer } from ".";

// Mock dependencies
const mockProps: RecursivePartial<TCartDrawer> = {
    opened: true,
    onClose: undefined,
};

const mockUserContext: RecursivePartial<IUserContext> = {
    cart: {
        // Only using fields relevant to the CartDrawer component
        response: {
            data: [
                { product: {}, variant: { id: "variant1Id" }, quantity: 1 },
                { product: {}, variant: { id: "variant2Id" }, quantity: 1 },
                { product: {}, variant: { id: "variant3Id" }, quantity: 1 },
            ] as unknown as IUserContext["cart"]["response"]["data"],
        },
        awaiting: false,
    },
    defaultData: {
        // Only using fields relevant to the CartDrawer component
        cart: [
            { product: {}, variant: { id: "variant4Id" }, quantity: 1 },
            { product: {}, variant: { id: "variant5Id" }, quantity: 1 },
            { product: {}, variant: { id: "variant6Id" }, quantity: 1 },
            { product: {}, variant: { id: "variant7Id" }, quantity: 1 },
            { product: {}, variant: { id: "variant8Id" }, quantity: 1 },
        ] as unknown as IUserContext["defaultData"]["cart"],
    },
};

type renderFuncArgs = {
    UserContextOverride?: IUserContext;
    propsOverride?: TCartDrawer;
};
const renderFunc = (args: renderFuncArgs = {}) => {
    const { UserContextOverride, propsOverride } = args;

    let UserContextValue!: IUserContext;

    const mergedUserContext = _.merge(
        _.cloneDeep(structuredClone(mockUserContext)),
        UserContextOverride,
    );
    const mergedProps = _.merge(_.cloneDeep(structuredClone(mockProps)), propsOverride);

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
                <CartDrawer {...mergedProps} />
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

vi.mock("@settings", () => ({ settings: { freeDeliveryThreshold: 1 } }));

const mockCalculateSubtotal = vi.fn(() => 0);
vi.mock("@/utils/products/cart", async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...(actual || {}),
        calculateSubtotal: () => mockCalculateSubtotal(),
    };
});

vi.mock("@/features/Cart/components/CartItem", () => ({
    CartItem: vi.fn((props: unknown) => {
        return <input aria-label="CartItem component" data-props={JSON.stringify(props)}></input>;
    }),
}));

vi.mock("@/features/DeliveryProgress", () => ({
    DeliveryProgress: vi.fn((props: unknown) => {
        return (
            <input
                aria-label="DeliveryProgress component"
                data-props={JSON.stringify(props)}
            ></input>
        );
    }),
}));

describe("The CartDrawer component...", () => {
    afterEach(() => {
        window.history.pushState({}, "", "/");
    });

    describe("Should render a Mantine Drawer component...", () => {
        test("Which should be open if the 'opened' prop is set to 'true'", () => {
            renderFunc();

            const DrawerComponent = screen.getByRole("dialog");
            expect(DrawerComponent).toBeInTheDocument();
        });

        test("Which should be closed if the 'opened' prop is set to 'false'", () => {
            renderFunc({ propsOverride: { opened: false } });

            const DrawerComponent = screen.queryByRole("dialog");
            expect(DrawerComponent).not.toBeInTheDocument();
        });

        test("Using the title 'Your cart'", () => {
            renderFunc();

            const DrawerComponentTitle = screen.getByText("Your cart");
            expect(DrawerComponentTitle).toBeInTheDocument();
        });

        test("Which should invoke the callback passed to the 'onClose' prop when closed", async () => {
            const callback = vi.fn(() => {});

            renderFunc({ propsOverride: { onClose: callback } });

            const DrawerComponent = screen.getByRole("dialog");
            expect(DrawerComponent).toBeInTheDocument();

            const DrawerComponentCloseButton = within(DrawerComponent).getByRole("button");
            expect(DrawerComponentCloseButton).toBeInTheDocument();

            expect(callback).toHaveBeenCalledTimes(0);

            await userEvent.click(DrawerComponentCloseButton);

            expect(callback).toHaveBeenCalledTimes(1);
        });
    });

    describe("Should render CartItem components...", () => {
        test("For each item in the UserContext's 'cart' field's 'data' array", () => {
            renderFunc();

            const CartItemComponents = screen.getAllByLabelText("CartItem component");
            expect(CartItemComponents).toHaveLength(mockUserContext.cart!.response!.data!.length);
        });

        test("Passing the correct props", () => {
            renderFunc();

            const CartItemComponents = screen.getAllByLabelText("CartItem component");
            CartItemComponents.forEach((CartItemComponent, i) => {
                const props = CartItemComponent.getAttribute("data-props");
                expect(JSON.parse(props!)).toStrictEqual({
                    data: mockUserContext.cart!.response!.data![i],
                });
            });
        });

        test("Or for each item in the UserContext's 'defaultData' field's 'cart' array if the actual cart data is null", () => {
            renderFunc({
                UserContextOverride: {
                    cart: { response: { data: null } },
                } as unknown as IUserContext,
            });

            const CartItemComponents = screen.getAllByLabelText("CartItem component");
            expect(CartItemComponents).toHaveLength(mockUserContext.defaultData!.cart!.length);
        });

        test("Passing the correct props", () => {
            renderFunc({
                UserContextOverride: {
                    cart: { response: { data: null } },
                } as unknown as IUserContext,
            });

            const CartItemComponents = screen.getAllByLabelText("CartItem component");
            CartItemComponents.forEach((CartItemComponent, i) => {
                const props = CartItemComponent.getAttribute("data-props");
                expect(JSON.parse(props!)).toStrictEqual({
                    data: mockUserContext.defaultData!.cart![i],
                });
            });
        });
    });

    describe("Should render the subtotal of cart items' values...", () => {
        test("With the return value of the 'calculateSubtotal' function, in pence, in the format: £XX.XX", () => {
            mockCalculateSubtotal.mockReturnValueOnce(1000);

            renderFunc();

            const subtotal = screen.getByText("£10.00");
            expect(subtotal).toBeInTheDocument();
        });

        test("Unless the UserContext's cart data is still being awaited", () => {
            mockCalculateSubtotal.mockReturnValueOnce(1000);

            renderFunc({
                UserContextOverride: { cart: { awaiting: true } } as unknown as IUserContext,
            });

            // queryByText *does not* exclude hidden elements - must manually check visibility
            const subtotal = screen.queryByText("£10.00");
            expect(subtotal).not.toBeVisible();
        });
    });

    describe("Should render the DeliveryProgress component...", () => {
        test("As normal", () => {
            renderFunc();

            const DeliveryProgressComponent = screen.getByLabelText("DeliveryProgress component");
            expect(DeliveryProgressComponent).toBeInTheDocument();
        });

        test("Unless the UserContext's cart data is still being awaited", () => {
            renderFunc({
                UserContextOverride: { cart: { awaiting: true } } as unknown as IUserContext,
            });

            // queryByLabelText *does not* exclude hidden elements - must manually check visibility
            const DeliveryProgressComponent = screen.queryByLabelText("DeliveryProgress component");
            expect(DeliveryProgressComponent).not.toBeVisible();
        });
    });

    describe("Should render a Mantine Button component...", () => {
        test("With the role of 'link' and the text 'Proceed to Checkout'", () => {
            renderFunc();

            const ButtonComponent = screen.getByRole("link", { name: "Proceed to Checkout" });
            expect(ButtonComponent).toBeInTheDocument();
        });

        test("Which should be disabled if the UserContext's cart data is still being awaited", () => {
            renderFunc({
                UserContextOverride: { cart: { awaiting: true } } as unknown as IUserContext,
            });

            const ButtonComponent = screen.getByRole("link", { name: "Proceed to Checkout" });
            expect(ButtonComponent.getAttribute("data-disabled")).toBeTruthy();
        });

        test("Which should, when clicked, redirect the user to '/checkout'", async () => {
            renderFunc();

            const ButtonComponent = screen.getByRole("link", { name: "Proceed to Checkout" });
            expect(ButtonComponent).toBeInTheDocument();

            expect(window.location.pathname).toBe("/");

            await act(() => userEvent.click(ButtonComponent));

            expect(window.location.pathname).toBe("/checkout");
        });

        test("Unless the Button is disabled", async () => {
            renderFunc({
                UserContextOverride: { cart: { awaiting: true } } as unknown as IUserContext,
            });

            const ButtonComponent = screen.getByRole("link", { name: "Proceed to Checkout" });
            expect(ButtonComponent).toBeInTheDocument();

            expect(window.location.pathname).toBe("/");

            await act(() => userEvent.click(ButtonComponent));

            expect(window.location.pathname).toBe("/");
        });
    });
});
