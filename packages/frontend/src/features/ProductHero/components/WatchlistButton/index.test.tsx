import { screen, render } from "@test-utils";
import _ from "lodash";
import { IUserContext, UserContext } from "@/pages/Root";
import { IProductContext, ProductContext } from "@/pages/Product";
import { RecursivePartial } from "@/utils/types";
import { act } from "react";
import { WatchlistButton } from ".";

// Mock dependencies

// Mock contexts are only using fields relevant to component being tested
const mockUserContext: RecursivePartial<IUserContext> = {
    watchlist: { data: [], awaiting: false },
};

const mockVariant = { id: "variantId" } as unknown as IProductContext["variant"];
const mockProduct = { id: "productId" } as unknown as IProductContext["product"]["data"];
const mockProductContext: RecursivePartial<IProductContext> = {
    product: { data: mockProduct, awaiting: false },
    variant: mockVariant,
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
                    <WatchlistButton />
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

describe("The WatchlistButton component...", () => {
    describe("Should render a <button> element...", () => {
        describe("With label text equal to...", () => {
            test("'Remove from watchlist' if the product variant is on the user's watchlist", () => {
                renderFunc({
                    UserContextOverride: {
                        watchlist: { data: [{ productId: "productId", variantId: "variantId" }] },
                    } as unknown as IUserContext,
                });

                const button = screen.getByLabelText("Remove from watchlist");
                expect(button).toBeInTheDocument();
            });

            test("'Add to watchlist' if the product variant is not on the user's watchlist", () => {
                renderFunc();

                const button = screen.getByLabelText("Add to watchlist");
                expect(button).toBeInTheDocument();
            });
        });

        describe("That should be disabled if...", () => {
            test("The UserContext's watchlist data is still being awaited", () => {
                renderFunc({
                    UserContextOverride: {
                        watchlist: { awaiting: true },
                    } as unknown as IUserContext,
                });

                const button = screen.getByLabelText("Add to watchlist");
                expect(button).toBeDisabled();
            });

            test.only("The UserContext's watchlist data is falsy", () => {
                renderFunc({
                    UserContextOverride: {
                        watchlist: { data: null },
                    } as unknown as IUserContext,
                });

                const button = screen.getByLabelText("Add to watchlist");
                expect(button).toBeDisabled();
            });

            test("The ProductContext's product data is still being awaited", () => {
                renderFunc({
                    ProductContextOverride: {
                        product: { awaiting: true },
                    } as unknown as IProductContext,
                });

                const button = screen.getByLabelText("Add to watchlist");
                expect(button).toBeDisabled();
            });

            test("The ProductContext's product data is falsy", () => {
                renderFunc({
                    ProductContextOverride: {
                        product: { data: null },
                    } as unknown as IProductContext,
                });

                const button = screen.getByLabelText("Add to watchlist");
                expect(button).toBeDisabled();
            });

            test("The ProductContext's variant data is falsy", () => {
                renderFunc({
                    ProductContextOverride: {
                        variant: null,
                    } as unknown as IProductContext,
                });

                const button = screen.getByLabelText("Add to watchlist");
                expect(button).toBeDisabled();
            });
        });

        test("That should be enabled otherwise", () => {
            renderFunc();

            const button = screen.getByLabelText("Add to watchlist");
            expect(button).toBeEnabled();
        });
    });

    describe("Should render a <span> element with text content equal to 'Check'...", () => {
        test("If the product variant is currently on the user's watchlist", () => {
            renderFunc({
                UserContextOverride: {
                    watchlist: { data: [{ productId: "productId", variantId: "variantId" }] },
                } as unknown as IUserContext,
            });

            const check = screen.getByText("Check");
            expect(check).toBeInTheDocument();
        });

        test("Unless the product variant is not currently on the user's watchlist", () => {
            renderFunc();

            const check = screen.queryByText("Check");
            expect(check).not.toBeInTheDocument();
        });
    });
});
