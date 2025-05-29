import { vi } from "vitest";
import { screen, render, waitFor } from "@test-utils";
import _ from "lodash";
import { act } from "react";
import { RecursivePartial } from "@/utils/types";
import { BrowserRouter } from "react-router-dom";
import { IProductContext, ProductContext, Product } from ".";

// Mock dependencies
const mockProduct: RecursivePartial<IProductContext["product"]["data"]> = {
    // Only using fields relevant to the Product component
    id: "productId",
    slug: "product-slug",
    variants: [
        { id: "variant1Id", name: "Variant 1 Name", options: { option1: "option1Value1" } },
        { id: "variant2Id", name: "Variant 2 Name", options: { option1: "option1Value2" } },
        { id: "variant3Id", name: "Variant 3 Name", options: { option1: "option1Value3" } },
        { id: "variant4Id", name: "Variant 4 Name", options: { option1: "option1Value4" } },
        { id: "variant5Id", name: "Variant 5 Name", options: { option1: "option1Value5" } },
    ],
    variantOptionOrder: ["option1"],
};

const mockProductContext: RecursivePartial<IProductContext> = {
    product: { data: null, status: 200, message: "Success", awaiting: true },
    variant: null,
    selectedVariantOptions: {},
    setSelectedVariantOptions: () => {},

    defaultData: {
        product: {},
        variant: {},
        variantOptions: {},
        collectionSteps: [],
    },
};

type renderFuncArgs = {
    ProductContextOverride?: IProductContext;
    initRender?: boolean;
};
const renderFunc = async (args: renderFuncArgs = {}) => {
    const { ProductContextOverride, initRender = false } = args;

    let ProductContextValue!: IProductContext;

    const mergedProductContext = _.merge(_.cloneDeep(mockProductContext), ProductContextOverride);

    const component = (
        // Using BrowserRouter for useSearchParams hook from react-router-dom
        <BrowserRouter
            future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
            }}
        >
            <ProductContext.Provider value={mergedProductContext}>
                <Product>
                    <ProductContext.Consumer>
                        {(value) => {
                            ProductContextValue = value;
                            return null;
                        }}
                    </ProductContext.Consumer>
                </Product>
            </ProductContext.Provider>
        </BrowserRouter>
    );

    // When using initRender, must wrap 'expect' in 'await waitFor'
    const { rerender } = initRender ? render(component) : await act(() => render(component));

    return {
        rerender,
        getProductContextValue: () => ProductContextValue,
        component,
    };
};

export const mockMockGetProduct = vi.fn(async () => ({
    status: 200,
    message: "Success",
    data: mockProduct,
}));
vi.mock("@/api/mocks", async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...(actual || {}),
        mockGetProduct: () => mockMockGetProduct(),
    };
});

// Args not required for mock function - disabling linter error
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const mockFindVariantFromOptions = vi.fn((...args: unknown[]) => mockProduct.variants![0]);
vi.mock("@/utils/products/product", async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...(actual || {}),
        findVariantFromOptions: (...args: unknown[]) => mockFindVariantFromOptions(args),
    };
});

vi.mock("@/features/ProductHero", () => ({
    ProductHero: () => <div aria-label="ProductHero component"></div>,
}));

vi.mock("@/features/ProductInformation", () => ({
    ProductInformation: () => <div aria-label="ProductInformation component"></div>,
}));

vi.mock("@/features/RecommendedProducts", () => ({
    RecommendedProducts: () => <div aria-label="RecommendedProducts component"></div>,
}));

describe("The Product component...", () => {
    afterEach(() => {
        // The Product component updates URL search params internally (e.g. - when setting
        // 'selectedVariantOptions' state), so I'm ensuring each test starts from the same URL path
        // for the sake of consistency.
        window.history.pushState({}, "", "/");
    });

    describe("Should provide context to all its descendant components...", () => {
        describe("Including the 'product' field...", () => {
            test("Which should initially have the 'data' field set to 'null'", async () => {
                const { getProductContextValue } = await renderFunc({ initRender: true });
                const ProductContextValue = getProductContextValue();
                expect(ProductContextValue).toBeDefined();

                const { product } = ProductContextValue;
                expect(product).toBeDefined();

                await waitFor(async () => {
                    expect(product).toEqual(expect.objectContaining({ data: null }));
                });
            });

            test("Which should be populated by the 'response' field in the return value of the 'useAsync' hook", async () => {
                const { getProductContextValue } = await renderFunc();
                const ProductContextValue = getProductContextValue();

                const { product } = ProductContextValue;

                expect(product).toEqual(expect.objectContaining(await mockMockGetProduct()));
            });
        });

        describe("Including the 'variant' field...", () => {
            test("Which should initially be set to 'null'", async () => {
                const { getProductContextValue } = await renderFunc({ initRender: true });
                const ProductContextValue = getProductContextValue();
                expect(ProductContextValue).toBeDefined();

                const { variant } = ProductContextValue;
                expect(variant).toBeDefined();

                await waitFor(async () => {
                    expect(variant).toBeNull();
                });
            });

            test("Which should be populated by the return value of the 'findVariantFromOptions' function", async () => {
                const { getProductContextValue } = await renderFunc();
                const ProductContextValue = getProductContextValue();

                const { variant } = ProductContextValue;

                expect(variant).toStrictEqual(mockFindVariantFromOptions());
            });
        });

        describe("Including the 'selectedVariantOptions' field...", () => {
            test("Which should initially be set to an object containing the URL search params", async () => {
                const mockURLParamValues = {
                    option1Name: "option1Value1",
                    option2Name: "option2Value1",
                    option3Name: "option3Value1",
                };
                const mockURLParams = new URLSearchParams();
                Object.entries(mockURLParamValues).forEach(([key, value]) => {
                    mockURLParams.append(key, `${value}`);
                });

                window.history.pushState({}, "", `?${mockURLParams}`);

                const { getProductContextValue } = await renderFunc({ initRender: true });
                const ProductContextValue = getProductContextValue();
                expect(ProductContextValue).toBeDefined();

                const { selectedVariantOptions } = ProductContextValue;
                expect(selectedVariantOptions).toBeDefined();

                await waitFor(async () => {
                    expect(selectedVariantOptions).toStrictEqual(mockURLParamValues);
                });
            });

            test("Which should be populated by the internal 'variant' state's 'options' field", async () => {
                const { getProductContextValue } = await renderFunc();
                const ProductContextValue = getProductContextValue();

                const { selectedVariantOptions } = ProductContextValue;

                expect(selectedVariantOptions).toStrictEqual(mockFindVariantFromOptions()?.options);
            });

            test("And should update the URL search params accordingly", async () => {
                await renderFunc();

                const urlSearchParamsEntries = Object.fromEntries(
                    new URLSearchParams(window.location.search).entries(),
                );

                expect(urlSearchParamsEntries).toStrictEqual(mockFindVariantFromOptions()?.options);
            });
        });

        describe("Including a setter function for updating the 'selectedVariantOptions' field...", async () => {
            test("Which, when called, should cause the 'findVariantFromOptions' to be called with the new state value", async () => {
                const { getProductContextValue } = await renderFunc();
                const ProductContextValue = getProductContextValue();

                const { setSelectedVariantOptions } = ProductContextValue;
                expect(setSelectedVariantOptions).toBeDefined();

                mockFindVariantFromOptions.mockRestore();

                const mockSelectedVariantOptions = {
                    option1Name: "option1Value1",
                    option2Name: "option2Value1",
                    option3Name: "option3Value1",
                };
                await act(async () => setSelectedVariantOptions(mockSelectedVariantOptions));

                const args = mockFindVariantFromOptions.mock.calls[0][0];
                const selectedVariantOptionsArg = (args as unknown[])[1];

                expect(selectedVariantOptionsArg).toStrictEqual(mockSelectedVariantOptions);
            });
        });

        describe("Which, when consumed by a component other than the Product component...", () => {
            test("Should match the shape of the expected context, but have fields containing default values", async () => {
                let ProductContextValue!: IProductContext;

                render(
                    <div>
                        <ProductContext.Consumer>
                            {(value) => {
                                ProductContextValue = value;
                                return null;
                            }}
                        </ProductContext.Consumer>
                    </div>,
                );

                expect(ProductContextValue).toBeDefined();

                const { product, variant, selectedVariantOptions, setSelectedVariantOptions } =
                    ProductContextValue;

                expect(product).toBeDefined();
                expect(variant).toBeDefined();
                expect(selectedVariantOptions).toBeDefined();
                expect(() => setSelectedVariantOptions({})).not.toThrow();
            });
        });
    });

    test("Should render the ProductHero component", async () => {
        await renderFunc();

        const ProductHeroComponent = screen.getByLabelText("ProductHero component");
        expect(ProductHeroComponent).toBeInTheDocument();
    });

    test("Should render the ProductInformation component", async () => {
        await renderFunc();

        const ProductInformationComponent = screen.getByLabelText("ProductInformation component");
        expect(ProductInformationComponent).toBeInTheDocument();
    });

    test("Should render the RecommendedProducts component", async () => {
        await renderFunc();

        const RecommendedProductsComponent = screen.getByLabelText("RecommendedProducts component");
        expect(RecommendedProductsComponent).toBeInTheDocument();
    });
});
