import { vi } from "vitest";
import { screen, render } from "@test-utils";
import _ from "lodash";
import { IUserContext, UserContext } from "@/pages/Root";
import { IProductContext, ProductContext } from "@/pages/Product";
import { RecursivePartial } from "@/utils/types";
import { act } from "react";
import { VariantAlerts } from ".";

// Mock dependencies
const mockUserContext: RecursivePartial<IUserContext> = {
    // Only using fields relevant to the VariantAlerts component
    cart: { data: [] as IUserContext["cart"]["data"] } as IUserContext["cart"],
};

const mockProductContext: RecursivePartial<IProductContext> = {
    // Only using fields relevant to the VariantAlerts component
    variant: { id: "variantId", stock: 10 } as IProductContext["variant"],
};

type renderFuncArgs = {
    UserContextOverride?: IUserContext;
    ProductContextOverride?: IProductContext;
    initRender?: boolean;
};
const renderFunc = async (args: renderFuncArgs = {}) => {
    const { UserContextOverride, ProductContextOverride, initRender = false } = args;

    let UserContextValue!: IUserContext;
    let ProductContextValue!: IProductContext;

    function Component({
        context,
    }: {
        context?: {
            User?: renderFuncArgs["UserContextOverride"];
            Product?: renderFuncArgs["ProductContextOverride"];
        };
    }) {
        const mergedUserContext = _.merge(
            _.cloneDeep(structuredClone(mockUserContext)),
            context?.User,
        );

        const mergedProductContext = _.merge(
            _.cloneDeep(structuredClone(mockProductContext)),
            context?.Product,
        );

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
                    <VariantAlerts />
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
              />,
          )
        : await act(() =>
              render(
                  <Component
                      context={{
                          User: UserContextOverride,
                          Product: ProductContextOverride,
                      }}
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
            />
        ),
    };
};

vi.mock("@settings", () => ({ settings: { lowStockThreshold: 5 } }));

describe("The VariantAlerts component...", () => {
    describe("Should render a Mantine Alert component regarding the ProductContext's variant's stock...", () => {
        test("With the title 'Low stock' if stock is between 1 and the 'lowStockThreshold', inclusive", () => {
            renderFunc({ ProductContextOverride: { variant: { stock: 5 } } as IProductContext });

            const stockAlertComponent = screen.getByRole("alert", { name: "Low stock" });
            expect(stockAlertComponent).toBeInTheDocument();
        });

        test("With the correct use of 'is'/'are' depending on the number left in stock", async () => {
            const { rerenderFunc } = await renderFunc({
                ProductContextOverride: { variant: { stock: 1 } } as IProductContext,
            });

            let stockAlertComponent = screen.getByRole("alert", { name: "Low stock" });
            expect(stockAlertComponent).toBeInTheDocument();
            expect(stockAlertComponent.textContent).toContain(" is ");

            rerenderFunc({
                ProductContextOverride: { variant: { stock: 5 } } as IProductContext,
            });

            stockAlertComponent = screen.getByRole("alert", { name: "Low stock" });
            expect(stockAlertComponent).toBeInTheDocument();
            expect(stockAlertComponent.textContent).toContain(" are ");
        });

        test("With the title 'Out of stock' if the stock is 0", () => {
            renderFunc({ ProductContextOverride: { variant: { stock: 0 } } as IProductContext });

            const stockAlertComponent = screen.getByRole("alert", { name: "Out of stock" });
            expect(stockAlertComponent).toBeInTheDocument();
        });

        test("Unless the stock exceeds the 'lowStockThreshold'", () => {
            renderFunc({ ProductContextOverride: { variant: { stock: 6 } } as IProductContext });

            expect(screen.queryByRole("alert", { name: "Low stock" })).not.toBeInTheDocument();
            expect(screen.queryByRole("alert", { name: "Out of stock" })).not.toBeInTheDocument();
        });

        test("Unless the ProductContext's 'variant' field is 'null'", () => {
            renderFunc({ ProductContextOverride: { variant: null } as IProductContext });

            expect(screen.queryByRole("alert", { name: "Low stock" })).not.toBeInTheDocument();
            expect(screen.queryByRole("alert", { name: "Out of stock" })).not.toBeInTheDocument();
        });
    });

    describe("Should render a Mantine Alert component regarding the UserContext's cart's data...", () => {
        // Cart Alert doesn't have a 'title' prop like the stock Alert, so ensure the latter is not
        // rendered by setting default variant stock to a value that exceeds the
        // 'lowStockThreshold'. This way, the cart Alert can be accessed with 'getByRole' instead of
        // the last entry of 'getAllByRole'.

        test("If the ProductContext's variant is within the cart, to show the quantity in the cart", () => {
            renderFunc({
                UserContextOverride: {
                    cart: { data: [{ variant: { id: "variantId" }, quantity: 10 }] },
                } as IUserContext,
            });

            const cartAlertComponent = screen.getByRole("alert");
            expect(cartAlertComponent).toBeInTheDocument();
            expect(cartAlertComponent.textContent).toContain("10");
        });

        test("Unless the UserContext's 'cart' array is empty", () => {
            renderFunc({
                UserContextOverride: {
                    cart: { data: [] as IUserContext["cart"]["data"] },
                } as IUserContext,
            });

            expect(screen.queryByRole("alert")).not.toBeInTheDocument();
        });

        test("Unless the UserContext's 'cart' array is 'null'", () => {
            renderFunc({ UserContextOverride: { cart: { data: null } } as IUserContext });

            expect(screen.queryByRole("alert")).not.toBeInTheDocument();
        });
    });
});
