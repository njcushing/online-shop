import { vi } from "vitest";
import { screen, render, waitFor } from "@test-utils";
import _ from "lodash";
import { act } from "react";
import { RecursivePartial } from "@/utils/types";
import { BrowserRouter } from "react-router-dom";
import { Product as ProductDataType } from "@/utils/products/product";
import { IProductContext, ProductContext, Product } from ".";

// Mock dependencies
const mockProduct: RecursivePartial<ProductDataType> = {
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

    const mergedProductContext = _.merge(mockProductContext, ProductContextOverride);

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
vi.mock("@/api/product", async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...(actual || {}),
        mockGetProduct: () => mockMockGetProduct(),
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
    describe("Should provide context to all its descendant components...", () => {
        describe("Including the 'product' object...", () => {
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

        describe("Including the 'variant' object...", () => {
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
