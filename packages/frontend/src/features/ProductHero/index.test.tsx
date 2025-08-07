import { vi } from "vitest";
import { screen, render } from "@test-utils";
import _ from "lodash";
import { IUserContext, UserContext } from "@/pages/Root";
import { IProductContext, ProductContext } from "@/pages/Product";
import { RecursivePartial } from "@/utils/types";
import { act } from "react";
import { ProductHero } from ".";

// Mock dependencies
const mockUserContext: RecursivePartial<IUserContext> = {
    cart: { data: [] as IUserContext["cart"]["data"], awaiting: false } as IUserContext["cart"],
    watchlist: {
        data: [
            { productId: "productId", variantId: "variantId" },
        ] as IUserContext["watchlist"]["data"],
        awaiting: false,
    } as IUserContext["watchlist"],
};

const mockVariant = {
    id: "variantId",
    price: { base: 1000, current: 1000 },
    stock: 10,
    options: { variantOption1: "variantOption1Value1", variantOption2: "variantOption2Value1" },
};
const mockProduct = {
    id: "productId",
    name: { full: "Product Name" },
    images: { thumb: { src: "productThumbImgSrc", alt: "productThumbImgAlt" }, dynamic: [] },
    rating: {
        meanValue: 4.54,
        totalQuantity: 200,
        quantities: { 1: 10, 2: 2, 3: 8, 4: 30, 5: 150 },
    },
    allowance: 100,
    variants: [mockVariant],
    variantOptionOrder: ["variantOption1", "variantOption2", "variantOption3"],
};
const mockProductContextDefaultData: RecursivePartial<IProductContext>["defaultData"] = {
    product: mockProduct,
    variant: mockVariant,
    variantOptions: new Map<string, Set<string>>([
        ["variantOption1", new Set(["variantOption1Value1"])],
        ["variantOption2", new Set(["variantOption2Value1"])],
    ]),
    collectionSteps: [
        { collection: { id: "collection1Id", type: "quantity" }, products: [mockProduct] },
        { collection: { id: "collection2Id", type: "quantity" }, products: [] },
    ],
};
const mockProductContext: RecursivePartial<IProductContext> = {
    product: {
        data: mockProductContextDefaultData.product,
        awaiting: false,
    } as IProductContext["product"],
    variant: mockProductContextDefaultData.variant as IProductContext["variant"],
    selectedVariantOptions: {},

    defaultData: mockProductContextDefaultData,
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
                    <div data-testid="product-hero-wrapper">
                        <ProductHero />
                    </div>
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

vi.mock("@/features/DeliveryProgress", () => ({
    DeliveryProgress: vi.fn((props: unknown) => {
        return (
            <div aria-label="DeliveryProgress component" data-props={JSON.stringify(props)}></div>
        );
    }),
}));

vi.mock("@/features/Price", () => ({
    Price: vi.fn((props: unknown) => {
        return <div aria-label="Price component" data-props={JSON.stringify(props)}></div>;
    }),
}));

vi.mock("@/features/ProductHero/components/ImageCarousel", () => ({
    ImageCarousel: vi.fn((props: unknown) => {
        return <div aria-label="ImageCarousel component" data-props={JSON.stringify(props)}></div>;
    }),
}));

vi.mock("@/features/ProductHero/components/CollectionStep", () => ({
    CollectionStep: vi.fn((props: unknown) => {
        return <div aria-label="CollectionStep component" data-props={JSON.stringify(props)}></div>;
    }),
}));

vi.mock("@/features/ProductHero/components/VariantStep", () => ({
    VariantStep: vi.fn((props: unknown) => {
        return <div aria-label="VariantStep component" data-props={JSON.stringify(props)}></div>;
    }),
}));

vi.mock("@/features/ProductHero/components/VariantAlerts", () => ({
    VariantAlerts: vi.fn((props: unknown) => {
        return <div aria-label="VariantAlerts component" data-props={JSON.stringify(props)}></div>;
    }),
}));

vi.mock("@/features/ProductHero/components/WatchlistButton", () => ({
    WatchlistButton: vi.fn((props: unknown) => {
        return (
            <button
                type="button"
                aria-label="WatchlistButton component"
                data-props={JSON.stringify(props)}
            ></button>
        );
    }),
}));

vi.mock("@/components/Inputs/Quantity", () => ({
    Quantity: vi.fn((props: unknown) => {
        return <div aria-label="Quantity component" data-props={JSON.stringify(props)}></div>;
    }),
}));

const mockFindCollections = vi.fn(() => mockProductContextDefaultData.collectionSteps);
const mockFilterVariantOptions = vi.fn(() => mockProductContextDefaultData.variantOptions);
vi.mock("@/utils/products/product", async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...(actual || {}),
        findCollections: () => mockFindCollections(),
        filterVariantOptions: () => mockFilterVariantOptions(),
    };
});

const mockCalculateMaxAddableVariantStock = vi.fn(() => 10);
vi.mock("@/utils/products/utils/calculateMaxAddableVariantStock", async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...(actual || {}),
        calculateMaxAddableVariantStock: () => mockCalculateMaxAddableVariantStock(),
    };
});

describe("The ProductHero component...", () => {
    test("Should render the ImageCarousel component", () => {
        renderFunc();

        const ImageCarouselComponent = screen.getByLabelText("Price component");
        expect(ImageCarouselComponent).toBeInTheDocument();
    });

    describe("Should render a heading element...", () => {
        test("With text content equal to the product's full name", () => {
            renderFunc();

            const { name } = mockProductContext.product!.data!;

            const productFullName = screen.getByRole("heading", { name: name.full });
            expect(productFullName).toBeInTheDocument();
        });

        test("Unless the ProductContext's product data is still being awaited", () => {
            renderFunc({
                ProductContextOverride: { product: { awaiting: true } } as IProductContext,
            });

            const { name } = mockProductContext.product!.data!;

            const productFullName = screen.queryByRole("heading", { name: name.full });
            expect(productFullName).not.toBeInTheDocument();
        });
    });

    describe("Should render a CollectionStep component...", () => {
        test("For each collection entry returned by the 'findCollections' function", () => {
            renderFunc();

            const CollectionStepComponents = screen.getAllByLabelText("CollectionStep component");
            expect(CollectionStepComponents).toHaveLength(mockFindCollections()!.length);
        });

        test("Unless the ProductContext's product data is still being awaited", () => {
            renderFunc({
                ProductContextOverride: {
                    product: { awaiting: true },
                } as unknown as IProductContext,
            });

            // queryAllByLabelText *does not* exclude hidden elements - must manually check visibility
            const CollectionStepComponents = screen.queryAllByLabelText("CollectionStep component");
            expect(CollectionStepComponents).toHaveLength(mockFindCollections()!.length);
            CollectionStepComponents.forEach((CollectionStepComponent) => {
                expect(CollectionStepComponent).not.toBeVisible();
            });
        });
    });

    describe("Should render a VariantStep component...", () => {
        test("For each variant option returned by the 'filterVariantOptions' function", () => {
            renderFunc();

            const VariantStepComponents = screen.getAllByLabelText("VariantStep component");
            expect(VariantStepComponents).toHaveLength(mockFilterVariantOptions()!.size!);
        });

        test("Unless the ProductContext's product data is still being awaited", () => {
            renderFunc({
                ProductContextOverride: { product: { awaiting: true } } as IProductContext,
            });

            // queryAllByLabelText *does not* exclude hidden elements - must manually check visibility
            const VariantStepComponents = screen.queryAllByLabelText("VariantStep component");
            expect(VariantStepComponents).toHaveLength(mockFilterVariantOptions()!.size!);
            VariantStepComponents.forEach((VariantStepComponent) => {
                expect(VariantStepComponent).not.toBeVisible();
            });
        });
    });

    describe("Should render the Price component...", () => {
        test("Passing the correct props", () => {
            renderFunc();

            const PriceComponent = screen.getByLabelText("Price component");
            expect(PriceComponent).toBeInTheDocument();

            const props = PriceComponent.getAttribute("data-props");
            expect(JSON.parse(props!)).toStrictEqual(
                expect.objectContaining({
                    base: mockVariant.price.base,
                    current: mockVariant.price.current,
                }),
            );
        });

        test("Unless the ProductContext's product data is still being awaited", () => {
            renderFunc({
                ProductContextOverride: { product: { awaiting: true } } as IProductContext,
            });

            // queryByLabelText *does not* exclude hidden elements - must manually check visibility
            const PriceComponent = screen.queryByLabelText("Price component");
            expect(PriceComponent).not.toBeVisible();
        });
    });

    describe("Should render the Quantity component...", () => {
        test("Passing the correct props", () => {
            renderFunc();

            const QuantityComponent = screen.getByLabelText("Quantity component");
            expect(QuantityComponent).toBeInTheDocument();

            const props = QuantityComponent.getAttribute("data-props");
            expect(JSON.parse(props!)).toStrictEqual(
                expect.objectContaining({
                    defaultValue: 1,
                    min: 1,
                    disabled: false,
                }),
            );
        });

        test("With a 'max' prop equal to the return value of the 'calculateMaxAddableVariantStock' function", () => {
            renderFunc();

            const QuantityComponent = screen.getByLabelText("Quantity component");
            const props = QuantityComponent.getAttribute("data-props");
            expect(JSON.parse(props!)).toStrictEqual(
                expect.objectContaining({
                    max: mockCalculateMaxAddableVariantStock(),
                }),
            );
        });

        describe("Which should be disabled if...", () => {
            test("The UserContext's cart data is still being awaited", () => {
                renderFunc({ UserContextOverride: { cart: { awaiting: true } } as IUserContext });

                const QuantityComponent = screen.getByLabelText("Quantity component");
                const props = QuantityComponent.getAttribute("data-props");
                expect(JSON.parse(props!)).toStrictEqual(
                    expect.objectContaining({
                        disabled: true,
                    }),
                );
            });

            test("The ProductContext's product data is still being awaited", () => {
                renderFunc({
                    ProductContextOverride: { product: { awaiting: true } } as IProductContext,
                });

                const QuantityComponent = screen.getByLabelText("Quantity component");
                const props = QuantityComponent.getAttribute("data-props");
                expect(JSON.parse(props!)).toStrictEqual(
                    expect.objectContaining({
                        disabled: true,
                    }),
                );
            });

            test("The maximum addable stock as calculated by the 'calculateMaxAddableVariantStock' function is 0", () => {
                mockCalculateMaxAddableVariantStock.mockReturnValueOnce(0);

                renderFunc();

                const QuantityComponent = screen.getByLabelText("Quantity component");
                const props = QuantityComponent.getAttribute("data-props");
                expect(JSON.parse(props!)).toStrictEqual(
                    expect.objectContaining({
                        disabled: true,
                    }),
                );
            });
        });
    });

    describe("Should render an 'Add to Cart' <button> element...", () => {
        test("With text content equal to: 'Add to Cart'", () => {
            renderFunc();

            const AddToCartButton = screen.getByRole("button", { name: "Add to Cart" });
            expect(AddToCartButton).toBeInTheDocument();
        });

        describe("Which should be disabled if...", () => {
            test("The UserContext's cart data is still being awaited", () => {
                renderFunc({ UserContextOverride: { cart: { awaiting: true } } as IUserContext });

                const AddToCartButton = screen.getByRole("button", { name: "Add to Cart" });
                expect(AddToCartButton).toBeDisabled();
            });

            test("The ProductContext's product data is still being awaited", () => {
                renderFunc({
                    ProductContextOverride: { product: { awaiting: true } } as IProductContext,
                });

                const AddToCartButton = screen.getByRole("button", { name: "Add to Cart" });
                expect(AddToCartButton).toBeDisabled();
            });

            test("The maximum addable stock as calculated by the 'calculateMaxAddableVariantStock' function is 0", () => {
                mockCalculateMaxAddableVariantStock.mockReturnValueOnce(0);

                renderFunc();

                const AddToCartButton = screen.getByRole("button", { name: "Add to Cart" });
                expect(AddToCartButton).toBeDisabled();
            });
        });
    });

    test("Should render the WatchlistButton component", () => {
        renderFunc();

        const WatchlistButtonComponent = screen.getByLabelText("WatchlistButton component");
        expect(WatchlistButtonComponent).toBeInTheDocument();
    });

    describe("Should render the DeliveryProgress component...", () => {
        test("As expected", () => {
            renderFunc();

            const DeliveryProgressComponent = screen.getByLabelText("DeliveryProgress component");
            expect(DeliveryProgressComponent).toBeInTheDocument();
        });

        test("Unless the ProductContext's product data is still being awaited", () => {
            renderFunc({
                ProductContextOverride: { product: { awaiting: true } } as IProductContext,
            });

            // queryByLabelText *does not* exclude hidden elements - must manually check visibility
            const DeliveryProgressComponent = screen.queryByLabelText("DeliveryProgress component");
            expect(DeliveryProgressComponent).not.toBeVisible();
        });
    });

    describe("Should return null...", () => {
        test("If the ProductContext's product data is not being awaited and the 'product.data' field is falsy", () => {
            renderFunc({
                ProductContextOverride: {
                    product: { data: null, awaiting: false },
                } as IProductContext,
            });

            const wrapper = screen.getByTestId("product-hero-wrapper");
            expect(wrapper).toBeEmptyDOMElement();
        });

        test("If the ProductContext's product data is not being awaited and the 'variant' field is falsy", () => {
            renderFunc({
                ProductContextOverride: {
                    product: { data: mockProduct, awaiting: false },
                    variant: null,
                } as unknown as IProductContext,
            });

            const wrapper = screen.getByTestId("product-hero-wrapper");
            expect(wrapper).toBeEmptyDOMElement();
        });
    });
});
