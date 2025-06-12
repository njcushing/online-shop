import { vi } from "vitest";
import { screen, render, waitFor, userEvent, within } from "@test-utils";
import _ from "lodash";
import { act } from "react";
import { RecursivePartial } from "@/utils/types";
import { BrowserRouter } from "react-router-dom";
import { IRootContext, RootContext } from "@/pages/Root";
import { IProductContext, ProductContext } from "@/pages/Product";
import { ProductReviews } from ".";

// Mock dependencies
const mockReviews = [
    {
        id: "review1Id",
        productId: "productId",
        variantId: "variant1Id",
        userId: "userId",
        rating: 4,
        comment: "Review 1 Comment",
        datePosted: new Date().toISOString(),
    },
    {
        id: "review2Id",
        productId: "productId",
        variantId: "variant2Id",
        userId: "userId",
        rating: 5,
        comment: "Review 2 Comment",
        datePosted: new Date().toISOString(),
    },
    {
        id: "review3Id",
        productId: "productId",
        variantId: "variant3Id",
        userId: "userId",
        rating: 3,
        comment: "Review 3 Comment",
        datePosted: new Date().toISOString(),
    },
];

// Mock contexts are only using fields relevant to component being tested
const mockRootContext: RecursivePartial<IRootContext> = {
    headerInfo: { active: false, open: true, height: 0, forceClose: () => {} },
};

const mockProduct = {
    id: "productId",
    rating: {
        meanValue: 4.0,
        totalQuantity: 3,
        quantities: { 5: 1, 4: 1, 3: 1, 2: 0, 1: 0 },
    },
    reviews: mockReviews.flatMap((review) => (review.productId === "productId" ? review.id : [])),
};
const mockDefaultProduct = {
    id: "defaultProductId",
    rating: { meanValue: 1.0, totalQuantity: 1, quantities: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 1 } },
    reviews: ["defaultReview1Id"],
};
const mockProductContext: RecursivePartial<IProductContext> = {
    product: {
        data: mockProduct,
        awaiting: false,
    } as IProductContext["product"],

    defaultData: { product: mockDefaultProduct },
};

type renderFuncArgs = {
    RootContextOverride?: IRootContext;
    ProductContextOverride?: IProductContext;
    initRender?: boolean;
};
const renderFunc = async (args: renderFuncArgs = {}) => {
    const { RootContextOverride, ProductContextOverride, initRender = false } = args;

    let RootContextValue!: IRootContext;
    let ProductContextValue!: IProductContext;

    function Component({
        context,
    }: {
        context?: {
            Root?: renderFuncArgs["RootContextOverride"];
            Product?: renderFuncArgs["ProductContextOverride"];
        };
    }) {
        const mergedRootContext = _.merge(_.cloneDeep(mockRootContext), context?.Root);
        const mergedProductContext = _.merge(_.cloneDeep(mockProductContext), context?.Product);

        return (
            <RootContext.Provider value={mergedRootContext}>
                <RootContext.Consumer>
                    {(value) => {
                        RootContextValue = value;
                        return null;
                    }}
                </RootContext.Consumer>
                <ProductContext.Provider value={mergedProductContext}>
                    <ProductContext.Consumer>
                        {(value) => {
                            ProductContextValue = value;
                            return null;
                        }}
                    </ProductContext.Consumer>
                    <div data-testid="product-reviews-wrapper">
                        <ProductReviews />
                    </div>
                </ProductContext.Provider>
            </RootContext.Provider>
        );
    }

    function BrowserRouterWrapper({
        context,
    }: {
        context?: {
            Root?: renderFuncArgs["RootContextOverride"];
            Product?: renderFuncArgs["ProductContextOverride"];
        };
    }) {
        return (
            <BrowserRouter
                future={{
                    v7_startTransition: true,
                    v7_relativeSplatPath: true,
                }}
            >
                <Component context={context} />
            </BrowserRouter>
        );
    }

    // When using initRender, must wrap 'expect' in 'await waitFor'
    const { rerender } = initRender
        ? render(
              <BrowserRouterWrapper
                  context={{
                      Root: RootContextOverride,
                      Product: ProductContextOverride,
                  }}
              />,
          )
        : await act(() =>
              render(
                  <BrowserRouterWrapper
                      context={{
                          Root: RootContextOverride,
                          Product: ProductContextOverride,
                      }}
                  />,
              ),
          );

    return {
        rerenderFunc: (newArgs: renderFuncArgs) => {
            rerender(
                <BrowserRouterWrapper
                    context={{
                        Root: newArgs.RootContextOverride,
                        Product: newArgs.ProductContextOverride,
                    }}
                />,
            );
        },
        getRootContextValue: () => RootContextValue,
        getProductContextValue: () => ProductContextValue,
        component: (
            <BrowserRouterWrapper
                context={{
                    Root: RootContextOverride,
                    Product: ProductContextOverride,
                }}
            />
        ),
    };
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const mockMockGetReviews = vi.fn(async (...args) => ({
    status: 200,
    message: "Success",
    data: mockReviews,
}));
vi.mock("@/api/mocks", async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...(actual || {}),
        mockGetReviews: (...args: unknown[]) => mockMockGetReviews(args),
    };
});

vi.mock("./components/ProductRatingBars", () => ({
    ProductRatingBars: vi.fn((props: unknown & { onClick: (tier: number) => unknown }) => {
        const { onClick } = props;
        return (
            <div aria-label="ProductRatingBars component" data-props={JSON.stringify(props)}>
                <button type="button" onClick={() => onClick && onClick(1)}>
                    1
                </button>
                <button type="button" onClick={() => onClick && onClick(2)}>
                    2
                </button>
                <button type="button" onClick={() => onClick && onClick(3)}>
                    3
                </button>
                <button type="button" onClick={() => onClick && onClick(4)}>
                    4
                </button>
                <button type="button" onClick={() => onClick && onClick(5)}>
                    5
                </button>
            </div>
        );
    }),
}));

vi.mock("./components/Review", () => ({
    Review: vi.fn((props: unknown & { id: string }) => {
        return (
            <div aria-label="Review component" data-props={JSON.stringify(props)}>
                Review {props.id}
            </div>
        );
    }),
}));

describe("The ProductReviews component...", () => {
    describe("Should render the ProductRatingBars component...", () => {
        test("As expected", () => {
            renderFunc();

            const ProductRatingBarsComponent = screen.getByLabelText("ProductRatingBars component");
            expect(ProductRatingBarsComponent).toBeInTheDocument();
        });

        describe("And, when its 'onClick' prop is called...", () => {
            test("If the rating doesn't match the current filter, the 'mockGetReviews' function should be called with the selected rating", async () => {
                await renderFunc();

                const ProductRatingBarsComponent = screen.getByLabelText(
                    "ProductRatingBars component",
                );
                const ProductRatingBarsButton3 = within(ProductRatingBarsComponent).getByRole(
                    "button",
                    { name: "3" },
                );

                mockMockGetReviews.mockRestore();

                await act(async () => userEvent.click(ProductRatingBarsButton3));

                expect(mockMockGetReviews).toHaveBeenCalledTimes(1);
                expect(mockMockGetReviews).toHaveBeenCalledWith(
                    expect.arrayContaining([
                        expect.objectContaining({
                            params: expect.objectContaining({
                                filter: "3",
                            }),
                        }),
                    ]),
                );
            });

            test("If the rating matches the current filter, the 'mockGetReviews' function should be called with 'filter: undefined'", async () => {
                await renderFunc();

                const ProductRatingBarsComponent = screen.getByLabelText(
                    "ProductRatingBars component",
                );
                const ProductRatingBarsButton3 = within(ProductRatingBarsComponent).getByRole(
                    "button",
                    { name: "3" },
                );

                mockMockGetReviews.mockRestore();

                await act(async () => userEvent.click(ProductRatingBarsButton3));

                mockMockGetReviews.mockRestore();

                await act(async () => userEvent.click(ProductRatingBarsButton3));

                expect(mockMockGetReviews).toHaveBeenCalledTimes(1);
                expect(mockMockGetReviews).toHaveBeenCalledWith(
                    expect.arrayContaining([
                        expect.objectContaining({
                            params: expect.objectContaining({
                                filter: undefined,
                            }),
                        }),
                    ]),
                );
            });
        });
    });

    describe("Should render a <select> element for filtering reviews by rating...", () => {
        test("Wrapped in a <label> element with textContent equal to 'Rating'", () => {
            renderFunc();

            const ratingFilterSelectLabel = screen.getByText("Rating");
            expect(ratingFilterSelectLabel).toBeInTheDocument();
            expect(ratingFilterSelectLabel.tagName).toBe("LABEL");

            const ratingFilterSelect = within(ratingFilterSelectLabel).getByRole("combobox");
            expect(ratingFilterSelect).toBeInTheDocument();
        });

        test("With 6 options: All, 1, 2, 3, 4 and 5", () => {
            renderFunc();

            const ratingFilterSelectLabel = screen.getByText("Rating");
            const ratingFilterSelect = within(ratingFilterSelectLabel).getByRole("combobox");

            expect(within(ratingFilterSelect).getAllByRole("option")).toHaveLength(6);

            expect(
                within(ratingFilterSelect).getByRole("option", { name: "All" }),
            ).toBeInTheDocument();
            Array.from({ length: 5 }).forEach((v, i) => {
                expect(
                    within(ratingFilterSelect).getByRole("option", { name: `${i + 1}` }),
                ).toBeInTheDocument();
            });
        });

        test("That should, onChange, call the 'mockGetReviews' function with the selected rating", async () => {
            await renderFunc();

            const ratingFilterSelectLabel = screen.getByText("Rating");
            const ratingFilterSelect = within(ratingFilterSelectLabel).getByRole("combobox");

            mockMockGetReviews.mockRestore();

            await act(async () => userEvent.selectOptions(ratingFilterSelect, "3"));

            expect(mockMockGetReviews).toHaveBeenCalledTimes(1);
            expect(mockMockGetReviews).toHaveBeenCalledWith(
                expect.arrayContaining([
                    expect.objectContaining({
                        params: expect.objectContaining({
                            filter: "3",
                        }),
                    }),
                ]),
            );
        });
    });

    describe("Should render a <select> element for sorting reviews...", () => {
        test("Wrapped in a <label> element with textContent equal to 'Sort by'", () => {
            renderFunc();

            const sortSelectLabel = screen.getByText("Sort by");
            expect(sortSelectLabel).toBeInTheDocument();
            expect(sortSelectLabel.tagName).toBe("LABEL");

            const sortSelect = within(sortSelectLabel).getByRole("combobox");
            expect(sortSelect).toBeInTheDocument();
        });

        test("With 3 options: 'Most Recent', 'Highest Rating' and 'Lowest Rating'", () => {
            renderFunc();

            const sortSelectLabel = screen.getByText("Sort by");
            const sortSelect = within(sortSelectLabel).getByRole("combobox");

            expect(within(sortSelect).getAllByRole("option")).toHaveLength(3);

            expect(
                within(sortSelect).getByRole("option", { name: "Most Recent" }),
            ).toBeInTheDocument();
            expect(
                within(sortSelect).getByRole("option", { name: "Highest Rating" }),
            ).toBeInTheDocument();
            expect(
                within(sortSelect).getByRole("option", { name: "Lowest Rating" }),
            ).toBeInTheDocument();
        });

        test("That should, onChange, call the 'mockGetReviews' function with the selected sort", async () => {
            await renderFunc();

            const sortSelectLabel = screen.getByText("Sort by");
            const sortSelect = within(sortSelectLabel).getByRole("combobox");

            mockMockGetReviews.mockRestore();

            await act(async () => userEvent.selectOptions(sortSelect, "Lowest Rating"));

            expect(mockMockGetReviews).toHaveBeenCalledTimes(1);
            expect(mockMockGetReviews).toHaveBeenCalledWith(
                expect.arrayContaining([
                    expect.objectContaining({
                        params: expect.objectContaining({
                            sort: "Lowest Rating",
                        }),
                    }),
                ]),
            );
        });
    });

    describe("Should render a text element with textContent equal to 'X reviews'...", () => {
        test("Where 'X' is equal to the length of the ProductContext's product's 'reviews' array", async () => {
            await renderFunc({ initRender: true });

            const { reviews } = mockProductContext.product!.data!;

            await waitFor(async () => {
                const reviewQuantity = screen.getByText(`${reviews.length} reviews`);
                expect(reviewQuantity).toBeInTheDocument();
            });
        });

        test("Where 'X' is equal to the length of the ProductContext's defaultData's product's 'reviews' array, if the product data is still being awaited", async () => {
            await renderFunc({
                ProductContextOverride: { product: { awaiting: true } } as IProductContext,
                initRender: true,
            });

            const { reviews } = mockProductContext.defaultData!.product!;

            await waitFor(async () => {
                const ReviewComponents = screen.queryAllByLabelText("Review component");
                expect(ReviewComponents).toHaveLength(reviews!.length);
            });
        });

        test("Where 'X' is equal to the number of reviews with the rating being filtered by", async () => {
            await renderFunc();

            const ratingFilterSelectLabel = screen.getByText("Rating");
            const ratingFilterSelect = within(ratingFilterSelectLabel).getByRole("combobox");

            await act(async () => userEvent.selectOptions(ratingFilterSelect, "3"));

            const mockReviewData = (await mockMockGetReviews()).data;
            const reviewsWithRating = mockReviewData.filter(
                (mockReview) => mockReview.rating === 3,
            );

            const reviewQuantity = screen.getByText(`${reviewsWithRating.length} reviews`);
            expect(reviewQuantity).toBeInTheDocument();
        });
    });

    describe("Should render Review components...", () => {
        test("Equal to the length of the ProductContext's product's 'reviews' array, if review data is still being awaited", async () => {
            await renderFunc({ initRender: true });

            const { reviews } = mockProductContext.product!.data!;

            await waitFor(async () => {
                const ReviewComponents = screen.queryAllByLabelText("Review component");
                expect(ReviewComponents).toHaveLength(reviews.length);
            });
        });

        test("Equal to the length of the ProductContext's defaultData's product's 'reviews' array, if both the review and product data is still being awaited", async () => {
            await renderFunc({
                ProductContextOverride: { product: { awaiting: true } } as IProductContext,
                initRender: true,
            });

            const { reviews } = mockProductContext.defaultData!.product!;

            await waitFor(async () => {
                const ReviewComponents = screen.queryAllByLabelText("Review component");
                expect(ReviewComponents).toHaveLength(reviews!.length);
            });
        });

        describe("After awaiting the response from the 'mockGetReviews' API query function...", async () => {
            test("One for each review returned by the function", async () => {
                await renderFunc();

                const mockReviewData = (await mockMockGetReviews()).data;

                const ReviewComponents = screen.getAllByLabelText("Review component");
                expect(ReviewComponents).toHaveLength(mockReviewData.length);
            });

            test("Passing the correct props", async () => {
                await renderFunc();

                const ReviewComponents = screen.getAllByLabelText("Review component");

                const mockReviewData = (await mockMockGetReviews()).data;
                mockReviewData.forEach((mockReview, i) => {
                    const props = ReviewComponents[i].getAttribute("data-props");
                    expect(JSON.parse(props!)).toStrictEqual({ data: mockReview });
                });
            });
        });
    });

    test("Should return null if the ProductContext's product data is not being awaited and the 'product.data' field is falsy", () => {
        renderFunc({
            ProductContextOverride: { product: { data: null, awaiting: false } } as IProductContext,
        });

        const wrapper = screen.getByTestId("product-reviews-wrapper");
        expect(wrapper).toBeEmptyDOMElement();
    });
});
