import { vi } from "vitest";
import { screen, render } from "@test-utils";
import { act } from "react";
import { mockProducts } from "./index.mocks";
import { RecommendedProducts } from ".";

// Mock dependencies
type renderFuncArgs = {
    initRender?: boolean;
};
const renderFunc = async (args: renderFuncArgs = {}) => {
    const { initRender = false } = args;

    function Component() {
        return <RecommendedProducts />;
    }

    // When using initRender, must wrap 'expect' in 'await waitFor'
    const { rerender } = initRender
        ? render(<Component />)
        : await act(() => render(<Component />));

    return {
        rerenderFunc: () => rerender(<Component />),
        component: <Component />,
    };
};

vi.mock("@/features/ProductCard", () => ({
    ProductCard: vi.fn((props: unknown) => {
        return <div aria-label="ProductCard component" data-props={JSON.stringify(props)}></div>;
    }),
}));

vi.mock("@/utils/products/product", async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...(actual || {}),
        products: (await import("./index.mocks")).mockProducts,
    };
});

describe("The RecommendedProducts component...", () => {
    test("Should render a <heading> element", () => {
        renderFunc();

        const headingElement = screen.getByRole("heading");
        expect(headingElement).toBeInTheDocument();
    });

    test("Should render a ProductCard component for each product in the 'products' array", () => {
        renderFunc();

        const ProductCardComponents = screen.getAllByLabelText("ProductCard component");
        expect(ProductCardComponents).toHaveLength(mockProducts.length);
    });
});
