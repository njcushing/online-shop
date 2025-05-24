import { vi } from "vitest";
import { screen, render } from "@test-utils";
import _ from "lodash";
import { act } from "react";
import { RecursivePartial } from "@/utils/types";
import { BrowserRouter } from "react-router-dom";
import { IProductContext, ProductContext, Product } from ".";

// Mock dependencies
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
};
const renderFunc = async (args: renderFuncArgs = {}) => {
    const { ProductContextOverride } = args;

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

    const { rerender } = await act(() => render(component));

    return {
        rerender,
        ProductContextValue,
        component,
    };
};

export const mockMockGetProduct = vi.fn(async () => ({ status: 200, message: "OK", data: null }));
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
                const { ProductContextValue } = await renderFunc();
                expect(ProductContextValue).toBeDefined();

                const { product } = ProductContextValue;
                expect(product).toBeDefined();

                expect(product).toEqual(expect.objectContaining({ data: null }));
            });

            test("And should later be populated by the 'response' field in the return value of the 'useAsync' hook", async () => {
                const { ProductContextValue } = await renderFunc();
                const { product } = ProductContextValue;

                expect(product).toEqual(expect.objectContaining({ data: null }));
            });
        });

        describe("Including the 'variant' object...", () => {
            test("Which should initially be set to 'null'", async () => {
                const { ProductContextValue } = await renderFunc();
                expect(ProductContextValue).toBeDefined();

                const { variant } = ProductContextValue;
                expect(variant).toBeDefined();

                expect(variant).toBeNull();
            });
        });
    });

    test("Should render the ProductHero component", async () => {
        renderFunc();

        const ProductHeroComponent = screen.getByLabelText("ProductHero component");
        expect(ProductHeroComponent).toBeInTheDocument();
    });

    test("Should render the ProductInformation component", async () => {
        renderFunc();

        const ProductInformationComponent = screen.getByLabelText("ProductInformation component");
        expect(ProductInformationComponent).toBeInTheDocument();
    });

    test("Should render the RecommendedProducts component", async () => {
        renderFunc();

        const RecommendedProductsComponent = screen.getByLabelText("RecommendedProducts component");
        expect(RecommendedProductsComponent).toBeInTheDocument();
    });
});
