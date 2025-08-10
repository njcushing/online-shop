import { vi } from "vitest";
import { screen, render, userEvent, within } from "@test-utils";
import { PointerEventsCheckLevel } from "@testing-library/user-event";
import _ from "lodash";
import { IProductContext, ProductContext } from "@/pages/Product";
import { RecursivePartial } from "@/utils/types";
import { act } from "react";
import { ProductRatingBars, TProductRatingBars } from ".";

// Mock dependencies
const mockProps: RecursivePartial<TProductRatingBars> = {
    clickable: true,
    onClick: () => {},
};

const mockDefaultData: RecursivePartial<IProductContext>["defaultData"] = {
    product: {
        id: "productId",
        rating: {
            meanValue: 4.54,
            totalQuantity: 200,
            quantities: { 1: 10, 2: 2, 3: 8, 4: 30, 5: 150 },
        },
        reviews: Array.from({ length: 123 }),
    },
};
const mockProductContext: RecursivePartial<IProductContext> = {
    // Only using fields relevant to the ProductRatingBars component
    product: {
        response: {
            data: mockDefaultData.product,
        },
        awaiting: false,
    } as IProductContext["product"],

    defaultData: mockDefaultData,
};

type renderFuncArgs = {
    ProductContextOverride?: IProductContext;
    propsOverride?: TProductRatingBars;
    initRender?: boolean;
};
const renderFunc = async (args: renderFuncArgs = {}) => {
    const { ProductContextOverride, propsOverride, initRender = false } = args;

    let ProductContextValue!: IProductContext;

    function Component({
        context,
        props,
    }: {
        context?: { Product?: renderFuncArgs["ProductContextOverride"] };
        props?: TProductRatingBars;
    }) {
        const mergedProductContext = _.merge(_.cloneDeep(mockProductContext), context?.Product);

        const mergedProps = _.merge(_.cloneDeep(mockProps), props);

        return (
            <ProductContext.Provider value={mergedProductContext}>
                <ProductContext.Consumer>
                    {(value) => {
                        ProductContextValue = value;
                        return null;
                    }}
                </ProductContext.Consumer>
                <div data-testid="product-rating-bars-wrapper">
                    <ProductRatingBars {...mergedProps} />
                </div>
            </ProductContext.Provider>
        );
    }

    // When using initRender, must wrap 'expect' in 'await waitFor'
    const { rerender } = initRender
        ? render(<Component context={{ Product: ProductContextOverride }} props={propsOverride} />)
        : await act(() =>
              render(
                  <Component context={{ Product: ProductContextOverride }} props={propsOverride} />,
              ),
          );

    return {
        rerenderFunc: (newArgs: renderFuncArgs) => {
            rerender(
                <Component
                    context={{ Product: newArgs.ProductContextOverride }}
                    props={newArgs.propsOverride}
                />,
            );
        },
        getProductContextValue: () => ProductContextValue,
        component: (
            <Component context={{ Product: ProductContextOverride }} props={propsOverride} />
        ),
    };
};

describe("The ProductRatingBars component...", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe("Should render a text element...", () => {
        test("Displaying the mean value of the product's ratings to two decimal places", () => {
            renderFunc();

            const ratingMeanValue = screen.getByText(
                mockProductContext!.product!.response!.data!.rating.meanValue.toFixed(2),
            );
            expect(ratingMeanValue).toBeInTheDocument();
        });

        test("Displaying the total number of product reviews", () => {
            renderFunc();

            const reviewQuantityValue = screen.getByText(
                mockProductContext!.product!.response!.data!.reviews.length,
            );
            expect(reviewQuantityValue).toBeInTheDocument();
        });

        test("Unless the ProductContext's product data is still being awaited", () => {
            renderFunc({
                ProductContextOverride: {
                    product: { awaiting: true },
                } as unknown as IProductContext,
            });

            // queryByText *does not* exclude hidden elements - must manually check visibility
            // defaultData.product is used when product data is being awaited
            const ratingMeanValue = screen.queryByText(
                mockProductContext!.defaultData!.product!.rating!.meanValue!.toFixed(2),
            );
            expect(ratingMeanValue).not.toBeVisible();

            const reviewQuantityValue = screen.queryByText(
                mockProductContext!.product!.response!.data!.reviews.length,
            );
            expect(reviewQuantityValue).not.toBeVisible();
        });
    });

    describe("Should render five <button> elements...", () => {
        test("One for each of the five possible ratings (1, 2, 3, 4, 5)", () => {
            renderFunc();

            const ratingButtons = screen.getAllByRole("button");
            expect(ratingButtons).toHaveLength(5);
        });

        test("Which should each contain a text element with text content equal to its tier", () => {
            renderFunc();

            const ratingButtons = screen.getAllByRole("button");
            expect(ratingButtons).toHaveLength(5);

            // Reversing array because tier 5 reviews will be rendered first
            ratingButtons.reverse().forEach((ratingButton, i) => {
                // Have to use getAll due to hidden column sizing elements sharing the same text
                const ratingTier = within(ratingButton).getAllByText(i + 1);
                expect(ratingTier.length > 0).toBe(true);
            });
        });

        test("Which should each contain one Mantine Progress component", () => {
            renderFunc();

            const ratingButtons = screen.getAllByRole("button");
            expect(ratingButtons).toHaveLength(5);

            ratingButtons.forEach((ratingButton) => {
                const ProgressComponent = within(ratingButton).getByRole("progressbar");
                expect(ProgressComponent).toBeInTheDocument();
            });
        });

        test("Each Progress component's value should be that rating value's percentage of all ratings", () => {
            renderFunc();

            const ratingButtons = screen.getAllByRole("button");
            expect(ratingButtons).toHaveLength(5);

            // Reversing array because tier 5 reviews will be rendered first
            ratingButtons.reverse().forEach((ratingButton, i) => {
                const { totalQuantity, quantities } =
                    mockProductContext!.product!.response!.data!.rating;

                const ProgressComponent = within(ratingButton).getByRole("progressbar");
                expect(ProgressComponent).toBeInTheDocument();

                const valueText = ProgressComponent.getAttribute("aria-valuetext");
                expect(valueText).toBe(
                    `${(quantities[(i + 1) as keyof typeof quantities] / totalQuantity) * 100}%`,
                );
            });
        });

        test("Which should each contain a text element with text content equal to its percentage", () => {
            renderFunc();

            const ratingButtons = screen.getAllByRole("button");
            expect(ratingButtons).toHaveLength(5);

            // Reversing array because tier 5 reviews will be rendered first
            ratingButtons.reverse().forEach((ratingButton, i) => {
                const { totalQuantity, quantities } =
                    mockProductContext!.product!.response!.data!.rating;

                // Have to use getAll due to hidden column sizing elements sharing the same text
                const ratingPercentage = within(ratingButton).getAllByText(
                    `${(quantities[(i + 1) as keyof typeof quantities] / totalQuantity) * 100}%`,
                );
                expect(ratingPercentage.length > 0).toBe(true);
            });
        });

        test("That, on click, should call the 'onClick' callback function prop with that rating value", async () => {
            const mockOnClick = vi.fn();

            renderFunc({ propsOverride: { onClick: mockOnClick } });

            const ratingButtons = screen.getAllByRole("button");
            expect(ratingButtons).toHaveLength(5);

            // Reversing array because tier 5 reviews will be rendered first
            ratingButtons.reverse();
            for (let i = 0; i < ratingButtons.length; i++) {
                const ratingButton = ratingButtons[i];

                // Need to click each button one at a time and await the callback function invocation
                /* eslint-disable-next-line no-await-in-loop */
                await act(async () => userEvent.click(ratingButton));

                expect(mockOnClick).toHaveBeenCalledTimes(1);
                expect(mockOnClick).toHaveBeenCalledWith(`${i + 1}`);

                mockOnClick.mockRestore();
            }
        });

        test("That, on click, should do nothing if the 'clickable' prop is set to 'false'", async () => {
            const mockOnClick = vi.fn();

            renderFunc({ propsOverride: { clickable: false, onClick: mockOnClick } });

            const ratingButtons = screen.getAllByRole("button");
            expect(ratingButtons).toHaveLength(5);

            // Reversing array because tier 5 reviews will be rendered first
            ratingButtons.reverse();
            for (let i = 0; i < ratingButtons.length; i++) {
                const ratingButton = ratingButtons[i];

                // Need to click each button one at a time to give the callback function a chance to
                // be invoked (however, for this test, it won't be called)
                /* eslint-disable-next-line no-await-in-loop */
                await act(async () =>
                    userEvent.click(ratingButton, {
                        pointerEventsCheck: PointerEventsCheckLevel.Never,
                    }),
                );

                expect(mockOnClick).not.toHaveBeenCalled();
            }
        });
    });

    test("Should return 'null' if ProductContext's product's 'data' and 'awaiting' are falsy", async () => {
        renderFunc({
            ProductContextOverride: {
                product: { response: { data: null }, awaiting: false },
            } as IProductContext,
        });

        const wrapper = screen.getByTestId("product-rating-bars-wrapper");
        expect(wrapper).toBeEmptyDOMElement();
    });
});
