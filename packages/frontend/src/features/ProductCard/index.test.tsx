import { vi } from "vitest";
import { screen, render, userEvent } from "@test-utils";
import { RecursivePartial } from "@/utils/types";
import { act } from "react";
import { BrowserRouter } from "react-router-dom";
import { ProductCard, TProductCard } from ".";

// Mock dependencies
const mockProduct: RecursivePartial<TProductCard["productData"]> = {
    // Only using fields relevant to the ProductCard component
    id: "productId",
    name: { full: "Product Name", shorthands: [] },
    slug: "product-slug",
    images: { dynamic: [], thumb: { src: "thumb-image-src", alt: "thumb-image-alt" } },
    rating: {
        meanValue: 3,
        totalQuantity: 500,
        quantities: { 5: 100, 4: 100, 3: 100, 2: 100, 1: 100 },
    },
    variants: [
        {
            id: "variant1Id",
            price: { base: 2000, current: 2000 },
            stock: 10,
            releaseDate: new Date(1).toISOString(),
        },
        {
            id: "variant2Id",
            price: { base: 1000, current: 1000 },
            stock: 20,
            releaseDate: new Date(2).toISOString(),
        },
        {
            id: "variant3Id",
            price: { base: 3000, current: 3000 },
            stock: 0,
            releaseDate: new Date(0).toISOString(),
        },
    ],
};

const mockProps: RecursivePartial<TProductCard> = {
    productData: mockProduct,
};

type renderFuncArgs = {
    propsOverride?: TProductCard;
};
const renderFunc = (args: renderFuncArgs = {}) => {
    const { propsOverride } = args;

    const component = (
        <BrowserRouter
            future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
            }}
        >
            <ProductCard {...((propsOverride || mockProps) as unknown as TProductCard)} />
        </BrowserRouter>
    );

    const { rerender } = render(component);

    return {
        rerender,
        component,
    };
};

vi.mock("@settings", () => ({ settings: { lowStockThreshold: 10 } }));

vi.mock("@/features/Price", () => ({
    Price: vi.fn((props: unknown) => {
        return <div aria-label="Price component" data-props={JSON.stringify(props)}></div>;
    }),
}));

describe("The ProductCard component...", () => {
    beforeEach(() => {
        window.history.pushState({}, "", "/");
    });

    describe("Should render a react-router-dom Link component...", () => {
        test("Which should redirect the user to: /p/productData.id/productData.slug", async () => {
            renderFunc();

            const LinkComponent = screen.getByRole("link");
            expect(LinkComponent).toBeInTheDocument();

            await act(async () => userEvent.click(LinkComponent));

            expect(window.location.pathname).toBe(`/p/${mockProduct.id}/${mockProduct.slug}`);
        });

        test("Which should have a 'data-visible' attribute equal to 'false' on mount", async () => {
            renderFunc();

            const LinkComponent = screen.getByRole("link");
            expect(LinkComponent).toBeInTheDocument();
            expect(LinkComponent.getAttribute("data-visible")).toBe("false");
        });

        test("Which should have a 'data-visible' attribute equal to 'true' if the component is within the viewport", async () => {
            let intersectionObserverCallbackRef: IntersectionObserverCallback | null = vi.fn();

            Object.defineProperty(window, "IntersectionObserver", {
                writable: true,
                configurable: true,
                value: vi.fn().mockImplementation((callback: IntersectionObserverCallback) => {
                    intersectionObserverCallbackRef = callback;
                    return { observe: vi.fn(), unobserve: vi.fn(), disconnect: vi.fn() };
                }),
            });

            const mockIntersectionObserverCallback = (
                ...args: Parameters<IntersectionObserverCallback>
            ) => {
                if (!intersectionObserverCallbackRef) return;
                intersectionObserverCallbackRef(...args);
            };

            renderFunc();

            const LinkComponent = screen.getByRole("link");
            expect(LinkComponent).toBeInTheDocument();
            expect(LinkComponent.getAttribute("data-visible")).toBe("false");

            act(() => {
                mockIntersectionObserverCallback(
                    [
                        {
                            target: LinkComponent,
                            isIntersecting: true,
                            intersectionRatio: 1,
                            boundingClientRect: {} as DOMRectReadOnly,
                            intersectionRect: {} as DOMRectReadOnly,
                            rootBounds: null,
                            time: Date.now(),
                        },
                    ],
                    {} as IntersectionObserver,
                );
            });

            expect(LinkComponent.getAttribute("data-visible")).toBe("true");
        });
    });

    test("Should render the product's 'thumb' image", async () => {
        renderFunc();

        const thumbImage = screen.getByRole("img");
        expect(thumbImage).toBeInTheDocument();
        expect(thumbImage.getAttribute("src")).toBe(mockProps.productData!.images!.thumb!.src);
        expect(thumbImage.getAttribute("alt")).toBe(mockProps.productData!.images!.thumb!.alt);
    });

    describe("Should render a 'product information banner'...", () => {
        test("With the text 'Out of stock' if the no variants have any stock", () => {
            const adjustedMockProps = structuredClone(mockProps);
            const { variants } = adjustedMockProps.productData!;
            adjustedMockProps.productData!.variants = variants!.map((variant) => {
                return { ...variant, stock: 0 };
            });

            renderFunc({ propsOverride: adjustedMockProps as unknown as TProductCard });

            const productInformationBanner = screen.getByText("Out of stock");
            expect(productInformationBanner).toBeInTheDocument();
        });

        test("With the text 'Low stock' if the variant with the most stock is below or equal to the 'lowStockThreshold'", () => {
            const adjustedMockProps = structuredClone(mockProps);
            const { variants } = adjustedMockProps.productData!;
            adjustedMockProps.productData!.variants = variants!.map((variant) => {
                return { ...variant, stock: 10 };
            });

            renderFunc({ propsOverride: adjustedMockProps as unknown as TProductCard });

            const productInformationBanner = screen.getByText("Low stock");
            expect(productInformationBanner).toBeInTheDocument();
        });

        test("With the text 'New in stock' if the newest variant has a recent 'releaseDate'", () => {
            const adjustedMockProps = structuredClone(mockProps);
            const { variants } = adjustedMockProps.productData!;
            variants![0]!.releaseDate = new Date().toISOString();

            renderFunc({ propsOverride: adjustedMockProps as unknown as TProductCard });

            const productInformationBanner = screen.getByText("New in stock");
            expect(productInformationBanner).toBeInTheDocument();
        });
    });

    test("Should render the product's full name", () => {
        renderFunc();

        const productFullName = screen.getByText(mockProps.productData!.name!.full!);
        expect(productFullName).toBeInTheDocument();
    });

    test("Should render the Price component with the correct props for the variant with the lowest price", () => {
        renderFunc();

        const PriceComponent = screen.getByLabelText("Price component");
        expect(PriceComponent).toBeInTheDocument();

        const props = PriceComponent.getAttribute("data-props");
        expect(JSON.parse(props!)).toEqual(expect.objectContaining({ base: 1000, current: 1000 }));
    });

    test("Should render the product's rating's 'meanValue' to two decimal places", () => {
        renderFunc();

        const ratingMeanValue = screen.getByText(
            mockProps.productData!.rating!.meanValue!.toFixed(2),
        );
        expect(ratingMeanValue).toBeInTheDocument();
    });

    test("Should render the product's total number of reviews", () => {
        renderFunc();

        const productReviewsQuantity = screen.getByText(
            mockProps.productData!.rating!.totalQuantity!,
            { exact: false }, // May be wrapped in parentheses
        );
        expect(productReviewsQuantity).toBeInTheDocument();
    });

    test("Should return null if 'productData' has an empty 'variants' array", () => {
        const adjustedMockProps = structuredClone(mockProps);
        adjustedMockProps.productData!.variants = [];

        renderFunc({ propsOverride: adjustedMockProps as unknown as TProductCard });

        // Link component should always render if component doesn't return null
        const LinkComponent = screen.queryByRole("link");
        expect(LinkComponent).not.toBeInTheDocument();
    });
});
