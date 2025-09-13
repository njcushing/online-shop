import { vi } from "vitest";
import { screen, render } from "@test-utils";
import _ from "lodash";
import { act } from "react";
import { IUserContext, UserContext } from "@/pages/Root";
import { RecursivePartial } from "@/utils/types";
import { BrowserRouter } from "react-router-dom";
import { CartItem, TCartItem } from ".";

// Mock dependencies
const mockProps: RecursivePartial<TCartItem> = {
    data: {
        product: {
            name: { full: "productName" },
            images: { thumb: { src: "productImgSrc", alt: "productImgAlt" } },
            allowance: 100,
        },
        variant: {
            price: { base: 100, current: 100, subscriptionDiscountPercentage: 10 },
            stock: 10,
            options: {
                option1Name: "option1Value",
                option2Name: "option2Value",
                option3Name: "option3Value",
            },
            image: { src: "variantImgSrc", alt: "variantImgAlt" },
            allowanceOverride: 5,
        },
        quantity: 1,
        info: {
            subscription: { frequency: "one_week" },
        },
    },
    editableQuantity: true,
    disableLink: false,
    classNames: {
        container: "",
        content: "",
        name: "",
        variantOptionName: "",
        variantOptionValue: "",
        quantity: "",
        price: {},
    },
};

const mockUserContext: RecursivePartial<IUserContext> = {
    cart: { response: { data: { items: [], promotions: [] } }, awaiting: false },
};

type renderFuncArgs = {
    UserContextOverride?: IUserContext;
    propsOverride?: TCartItem;
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
                <CartItem {...mergedProps} />
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

vi.mock("@settings", () => ({ settings: { freeDeliveryThreshold: 1 } }));

const mockCalculateUnitPrice = vi.fn(() => 0);
vi.mock("@/utils/products/utils/calculateUnitPrice", async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...(actual || {}),
        calculateUnitPrice: () => mockCalculateUnitPrice(),
    };
});

vi.mock("@/components/Inputs/Quantity", () => ({
    Quantity: vi.fn((props: unknown) => {
        return <input aria-label="Quantity component" data-props={JSON.stringify(props)}></input>;
    }),
}));

vi.mock("@/features/Price", () => ({
    Price: vi.fn((props: unknown) => {
        return <input aria-label="Price component" data-props={JSON.stringify(props)}></input>;
    }),
}));

vi.mock("@/utils/products/product", async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...(actual || {}),
        variantOptions: [
            {
                id: "option1Name",
                name: "Option 1 Name",
                values: [{ id: "option1Value", name: "Option 1 Value" }],
            },
        ],
    };
});

describe("The CartItem component...", () => {
    describe("Should render a Mantine Image component...", () => {
        test("With props pertaining to the variant's image as a priority", () => {
            renderFunc();

            const img = screen.getByRole("img");
            expect(img).toBeInTheDocument();
            expect(img.getAttribute("src")).toBe(mockProps.data!.variant!.image!.src);
            expect(img.getAttribute("alt")).toBe(mockProps.data!.variant!.image!.alt);
        });

        test("With the product's thumb image as a backup if the variant has no image", () => {
            renderFunc({
                propsOverride: { data: { variant: { image: null } } } as unknown as TCartItem,
            });

            const img = screen.getByRole("img");
            expect(img).toBeInTheDocument();
            expect(img.getAttribute("src")).toBe(mockProps.data!.product!.images!.thumb!.src);
            expect(img.getAttribute("alt")).toBe(mockProps.data!.product!.images!.thumb!.alt);
        });

        test("Unless the UserContext's cart data is still being awaited", () => {
            renderFunc({
                UserContextOverride: { cart: { awaiting: true } } as IUserContext,
            });

            // queryByRole *does* exclude hidden elements
            const img = screen.queryByRole("img");
            expect(img).not.toBeInTheDocument();
        });
    });

    describe("Should render the product's full name...", () => {
        describe("If the 'disableLink' prop is 'false'", () => {
            test("As a react-router-dom Link component", () => {
                renderFunc();

                const fullName = screen.getByRole("link", {
                    name: mockProps.data!.product!.name!.full!,
                });
                expect(fullName).toBeInTheDocument();
            });

            test("With an 'href' attribute equal to the product page and its specific variant", () => {
                renderFunc();

                const { data } = mockProps;
                const { product, variant } = data!;
                const { id, slug, name } = product!;
                const { full } = name!;
                const { options } = variant!;

                const variantUrlParams = new URLSearchParams();
                Object.entries(options!).forEach(([key, value]) =>
                    variantUrlParams.append(key, `${value}`),
                );

                const fullName = screen.getByRole("link", { name: full });
                expect(fullName.getAttribute("href")).toBe(`/p/${id}/${slug}?${variantUrlParams}`);
            });
        });

        describe("If the 'disableLink' prop is 'true'", () => {
            test("As a <p> element", () => {
                renderFunc({ propsOverride: { disableLink: true } as TCartItem });

                const fullName = screen.getByText(mockProps.data!.product!.name!.full!);
                expect(fullName).toBeInTheDocument();
                expect(fullName.tagName).toBe("P");
            });
        });

        test("Unless the UserContext's cart data is still being awaited", () => {
            renderFunc({
                propsOverride: { disableLink: true } as TCartItem,
                UserContextOverride: { cart: { awaiting: true } } as IUserContext,
            });

            // queryByText *does not* exclude hidden elements - must manually check visibility
            const fullName = screen.queryByText(mockProps.data!.product!.name!.full!);
            expect(fullName).not.toBeVisible();
        });
    });

    describe("Should render informaton about each of the variant's options...", () => {
        test("Including the name and value from the defined variant options", () => {
            renderFunc();

            const QuantityComponent = screen.getByLabelText("Quantity component");
            expect(QuantityComponent).toBeInTheDocument();

            expect(screen.getByText("Option 1 Name", { exact: false })).toBeInTheDocument();
            expect(screen.getByText("Option 1 Value")).toBeInTheDocument();
        });

        test("Or the key and value as a backup", () => {
            renderFunc();

            const QuantityComponent = screen.getByLabelText("Quantity component");
            expect(QuantityComponent).toBeInTheDocument();

            expect(screen.getByText("option2Name", { exact: false })).toBeInTheDocument();
            expect(screen.getByText("option2Value")).toBeInTheDocument();

            expect(screen.getByText("option3Name", { exact: false })).toBeInTheDocument();
            expect(screen.getByText("option3Value")).toBeInTheDocument();
        });

        test("Unless the UserContext's cart data is still being awaited", () => {
            renderFunc({
                UserContextOverride: { cart: { awaiting: true } } as IUserContext,
            });

            const QuantityComponent = screen.getByLabelText("Quantity component");
            expect(QuantityComponent).toBeInTheDocument();

            // queryByText *does not* exclude hidden elements - must manually check visibility
            expect(screen.queryByText("Option 1 Name", { exact: false })).not.toBeVisible();
            expect(screen.queryByText("Option 1 Value")).not.toBeVisible();

            expect(screen.queryByText("option2Name", { exact: false })).not.toBeVisible();
            expect(screen.queryByText("option2Value")).not.toBeVisible();

            expect(screen.queryByText("option3Name", { exact: false })).not.toBeVisible();
            expect(screen.queryByText("option3Value")).not.toBeVisible();
        });
    });

    describe("If the 'editableQuantity' prop is 'true'...", () => {
        describe("Should render the Quantity component...", () => {
            test("Passing the correct props when the variant has a valid 'allowanceOverride' value", () => {
                renderFunc();

                const QuantityComponent = screen.getByLabelText("Quantity component");
                expect(QuantityComponent).toBeInTheDocument();

                const props = QuantityComponent.getAttribute("data-props");
                expect(JSON.parse(props!)).toEqual(
                    expect.objectContaining({
                        min: 1,
                        max: 5, // Minimum value between variant's stock and allowanceOverride
                        disabled: false,
                    }),
                );
            });

            test("Passing the correct props when the variant doesn't have a valid 'allowanceOverride' value", () => {
                renderFunc({
                    propsOverride: {
                        data: { variant: { allowanceOverride: null } },
                    } as unknown as TCartItem,
                });

                const QuantityComponent = screen.getByLabelText("Quantity component");
                expect(QuantityComponent).toBeInTheDocument();

                const props = QuantityComponent.getAttribute("data-props");
                expect(JSON.parse(props!)).toEqual(
                    expect.objectContaining({
                        min: 1,
                        max: 10, // Minimum value between variant's stock and product's allowance
                        disabled: false,
                    }),
                );
            });

            test("Unless the UserContext's cart data is still being awaited", () => {
                renderFunc({
                    UserContextOverride: { cart: { awaiting: true } } as IUserContext,
                });

                // queryByLabelText *does not* exclude hidden elements - must manually check visibility
                const QuantityComponent = screen.queryByLabelText("Quantity component");
                expect(QuantityComponent).not.toBeVisible();
            });
        });
    });

    describe("If the cart item is a subscription and the product variant's 'subscriptionDiscountPercentage' is greater than 0...", () => {
        test("Should render an element with textContent explaining the subscription discount", () => {
            renderFunc({
                propsOverride: { editableQuantity: false } as TCartItem,
            });

            const { data } = mockProps;
            const { variant } = data!;
            const { price } = variant!;
            const { subscriptionDiscountPercentage } = price!;

            const subscriptionDiscount = screen.getByText(`${subscriptionDiscountPercentage}%`);
            expect(subscriptionDiscount).toBeInTheDocument();
        });
    });

    describe("If the 'editableQuantity' prop is 'false'...", () => {
        test("Should render an element with textContent equal to: 'X units', where 'X' is the quantity of the item", () => {
            renderFunc({
                propsOverride: { editableQuantity: false } as TCartItem,
            });

            const QuantityComponent = screen.queryByLabelText("Quantity component");
            expect(QuantityComponent).not.toBeInTheDocument();

            const quantityElement = screen.getByText(`${mockProps.data?.quantity} unit`);
            expect(quantityElement).toBeInTheDocument();
        });

        test("With the word 'unit' or 'units' correctly dependant on whether the item's quantity is equal to or above 1, respectively", () => {
            renderFunc({
                propsOverride: { data: { quantity: 10 }, editableQuantity: false } as TCartItem,
            });

            const QuantityComponent = screen.queryByLabelText("Quantity component");
            expect(QuantityComponent).not.toBeInTheDocument();

            const quantityElement = screen.getByText("10 units");
            expect(quantityElement).toBeInTheDocument();
        });
    });

    describe("Should render the Price component...", () => {
        test("Passing the correct props", () => {
            mockCalculateUnitPrice.mockReturnValueOnce(mockProps.data!.variant!.price!.current!);

            renderFunc();

            const PriceComponent = screen.getByLabelText("Price component");
            expect(PriceComponent).toBeInTheDocument();

            const props = PriceComponent.getAttribute("data-props");
            expect(JSON.parse(props!)).toEqual(
                expect.objectContaining({
                    base: mockProps.data!.variant!.price!.base,
                    current: mockProps.data!.variant!.price!.current,
                    multiply: mockProps.data!.quantity,
                }),
            );

            mockCalculateUnitPrice.mockRestore();
        });

        test("Unless the UserContext's cart data is still being awaited", () => {
            renderFunc({
                UserContextOverride: { cart: { awaiting: true } } as IUserContext,
            });

            // queryByLabelText *does not* exclude hidden elements - must manually check visibility
            const PriceComponent = screen.queryByLabelText("Price component");
            expect(PriceComponent).not.toBeVisible();
        });
    });
});
