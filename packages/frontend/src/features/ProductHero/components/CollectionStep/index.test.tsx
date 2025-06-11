import { screen, render, within } from "@test-utils";
import _ from "lodash";
import { act } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { TCollectionStep, CollectionStep } from ".";

// Mock dependencies

// Mock props are only using fields relevant to component being tested
const mockProducts = [
    {
        id: "product1Id",
        slug: "product-1-id-slug",
        name: {
            full: "Product 1 Name Full",
            shorthands: [{ type: "quantity", value: "Product 1 Name Shorthand" }],
        },
        images: { thumb: { src: "product1ThumbImgSrc", alt: "product1ThumbImgAlt" }, dynamic: [] },
    },
    {
        id: "product2Id",
        slug: "product-2-id-slug",
        name: {
            full: "Product 2 Name Full",
            shorthands: [{ type: "quantity", value: "Product 2 Name Shorthand" }],
        },
        images: { thumb: { src: "product2ThumbImgSrc", alt: "product2ThumbImgAlt" }, dynamic: [] },
    },
    {
        id: "product3Id",
        slug: "product-3-id-slug",
        name: {
            full: "Product 3 Name Full",
            shorthands: [{ type: "quantity", value: "Product 3 Name Shorthand" }],
        },
        images: { thumb: { src: "product3ThumbImgSrc", alt: "product3ThumbImgAlt" }, dynamic: [] },
    },
] as unknown as TCollectionStep["collectionData"]["products"];

const mockProps: TCollectionStep = {
    collectionData: {
        collection: { id: "collection1Id", type: "quantity" },
        products: mockProducts,
    },
};

type renderFuncArgs = {
    propsOverride?: TCollectionStep;
    initRender?: boolean;
};
const renderFunc = async (args: renderFuncArgs = {}) => {
    const { propsOverride, initRender = false } = args;

    function Component({ props }: { props?: renderFuncArgs["propsOverride"] }) {
        const mergedProps = _.merge(_.cloneDeep(mockProps), props);

        return <CollectionStep {...mergedProps} />;
    }

    function RouterProviderWrapper({ props }: { props?: renderFuncArgs["propsOverride"] }) {
        return (
            // Using RouterProvider for useParams hook from react-router-dom
            <RouterProvider
                router={createBrowserRouter(
                    [
                        {
                            path: "p/:productId/:productSlug",
                            element: <Component props={props} />,
                            errorElement: <div aria-label="Error element"></div>,
                        },
                    ],
                    { future: { v7_relativeSplatPath: true } },
                )}
                future={{ v7_startTransition: true }}
            />
        );
    }

    // When using initRender, must wrap 'expect' in 'await waitFor'
    const { rerender } = initRender
        ? render(<RouterProviderWrapper props={propsOverride} />)
        : await act(() => render(<RouterProviderWrapper props={propsOverride} />));

    return {
        rerenderFunc: (newArgs: renderFuncArgs) => {
            rerender(<RouterProviderWrapper props={newArgs.propsOverride} />);
        },
        component: <RouterProviderWrapper props={propsOverride} />,
    };
};

describe("The CollectionStep component...", () => {
    beforeEach(() => {
        const { id, slug } = mockProducts[0];
        window.history.pushState({}, "", `/p/${id}/${slug}`);
    });

    describe("Should render a title for the collection...", () => {
        test("With text content equal to 'Select a quantity' if the collecton's type is 'quantity'", () => {
            renderFunc();

            const title = screen.getByText("Select a quantity");
            expect(title).toBeInTheDocument();
        });

        test("With text content equal to 'Other products in this collection' otherwise", () => {
            // @ts-expect-error - Disabling type checking for mock prop values in unit test
            renderFunc({ propsOverride: { collectionData: { collection: { type: null } } } });

            const title = screen.getByText("Other products in this collection");
            expect(title).toBeInTheDocument();
        });
    });

    describe("For each product in the 'collectionData' prop's 'products' array...", () => {
        describe("Should render an element with a 'link' role...", () => {
            test("With text content equal to the product's shorthand name with the same type as the collection", () => {
                renderFunc();

                const links = screen.getAllByRole("link");

                mockProducts.forEach((product) => {
                    const { type } = mockProps.collectionData.collection;
                    const { name } = product;
                    const shorthand = name.shorthands.find((s) => s.type === type);
                    const { value } = shorthand!;

                    const matchedLink = links.find((link) => link.textContent === value);
                    expect(matchedLink).toBeDefined();
                });
            });

            test("Or its full name if it doesn't have a shorthand name with the same type as the collection", () => {
                const adjustedMockProducts = structuredClone(mockProducts);
                // @ts-expect-error - Disabling type checking for mock prop values in unit test
                adjustedMockProducts[0].name.shorthands[0].type = null;

                renderFunc({
                    propsOverride: {
                        collectionData: { products: adjustedMockProducts },
                    } as TCollectionStep,
                });

                const links = screen.getAllByRole("link");

                const matchedLinkShorthandName = links.find(
                    (link) => link.textContent === adjustedMockProducts[0].name.shorthands[0].value,
                );
                expect(matchedLinkShorthandName).toBeUndefined();

                const matchedLinkFullName = links.find(
                    (link) => link.textContent === adjustedMockProducts[0].name.full,
                );
                expect(matchedLinkFullName).toBeDefined();
            });

            test("With an 'href' attribute equal to: '/p/:productId/:productSlug'", () => {
                renderFunc();

                const links = screen.getAllByRole("link");

                mockProducts.forEach((product) => {
                    const { id, slug } = product;

                    const matchedLink = links.find(
                        (link) => link.getAttribute("href") === `/p/${id}/${slug}`,
                    );
                    expect(matchedLink).toBeDefined();
                });
            });

            test("With a 'data-selected' attribute equal to 'true' if the :productId URL param matches the product's id (and vice versa)", () => {
                renderFunc();

                const links = screen.getAllByRole("link");

                mockProducts.forEach((product, i) => {
                    const { type } = mockProps.collectionData.collection;
                    const { name } = product;
                    const shorthand = name.shorthands.find((s) => s.type === type);
                    const { value } = shorthand!;

                    const matchedLink = links.find((link) => link.textContent === value);

                    if (i === 0) expect(matchedLink!.getAttribute("data-selected")).toBe("true");
                    if (i !== 0) expect(matchedLink!.getAttribute("data-selected")).toBe("false");
                });
            });

            test("With a 'tabIndex' equal to '-1' if the :productId URL param matches the product's id, and 0 otherwise", () => {
                renderFunc();

                const links = screen.getAllByRole("link");

                mockProducts.forEach((product, i) => {
                    const { type } = mockProps.collectionData.collection;
                    const { name } = product;
                    const shorthand = name.shorthands.find((s) => s.type === type);
                    const { value } = shorthand!;

                    const matchedLink = links.find((link) => link.textContent === value);

                    if (i === 0) expect(matchedLink!.tabIndex).toBe(-1);
                    if (i !== 0) expect(matchedLink!.tabIndex).toBe(0);
                });
            });

            test("With a child <img> element with 'src' and 'alt' attributes equal to the product's 'thumb' image", () => {
                renderFunc();

                const links = screen.getAllByRole("link");

                mockProducts.forEach((product) => {
                    const { type } = mockProps.collectionData.collection;
                    const { name, images } = product;
                    const shorthand = name.shorthands.find((s) => s.type === type);
                    const { value } = shorthand!;

                    const matchedLink = links.find((link) => link.textContent === value);
                    const imageElement = within(matchedLink!).getByRole("img");

                    const { src, alt } = images.thumb;

                    expect(imageElement).toBeInTheDocument();
                    expect(imageElement.getAttribute("src")).toBe(src);
                    expect(imageElement.getAttribute("alt")).toBe(alt);
                });
            });
        });
    });
});
