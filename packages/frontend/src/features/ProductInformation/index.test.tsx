import { vi } from "vitest";
import { screen, render, userEvent } from "@test-utils";
import _ from "lodash";
import { act } from "react";
import { RecursivePartial } from "@/utils/types";
import { IProductContext, ProductContext } from "@/pages/Product";
import { ProductInformation, TProductInformation } from ".";

// Mock dependencies
const mockProps: TProductInformation = {
    defaultOpenTab: "Description",
};

// Mock contexts are only using fields relevant to component being tested
const mockVariant = {
    sku: "variantSku",
    details: [
        { name: "Detail 1", value: "Detail 1 Value" },
        { name: "Detail 2", value: "Detail 2 Value" },
        { name: "Detail 3", value: "Detail 3 Value" },
    ],
    releaseDate: new Date(0).toISOString(),
};
const mockProduct = {
    description: "Product 1 description",
};
const mockProductContextDefaultData: RecursivePartial<IProductContext>["defaultData"] = {
    product: mockProduct,
    variant: mockVariant,
};
const mockProductContext: RecursivePartial<IProductContext> = {
    product: {
        response: {
            data: mockProductContextDefaultData.product,
        },
        awaiting: false,
    } as IProductContext["product"],
    variant: mockProductContextDefaultData.variant as IProductContext["variant"],

    defaultData: mockProductContextDefaultData,
};

type renderFuncArgs = {
    ProductContextOverride?: IProductContext;
    propsOverride?: TProductInformation;
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
        props?: renderFuncArgs["propsOverride"];
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
                <ProductInformation {...mergedProps} />
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

vi.mock("@/features/ProductReviews", () => ({
    ProductReviews: vi.fn((props: unknown) => {
        return <div aria-label="ProductReviews component" data-props={JSON.stringify(props)}></div>;
    }),
}));

describe("The ProductInformation component...", () => {
    describe("Should render <button> elements for each tab...", () => {
        describe("Including the 'Description' tab...", () => {
            test("With an 'aria-expanded' attribute of 'true' if the 'defaultOpenTab' prop is 'Description'", () => {
                renderFunc({ propsOverride: { defaultOpenTab: "Description" } });

                const descriptionTabButton = screen.getByRole("button", { name: "Description" });
                expect(descriptionTabButton).toBeInTheDocument();
                expect(descriptionTabButton.getAttribute("aria-expanded")).toBe("true");
            });

            test("With an 'aria-expanded' attribute of 'false' if the 'defaultOpenTab' prop is not 'Description'", () => {
                // @ts-expect-error - Disabling type checking for props in unit test
                renderFunc({ propsOverride: { defaultOpenTab: "Invalid category" } });

                const descriptionTabButton = screen.getByRole("button", { name: "Description" });
                expect(descriptionTabButton).toBeInTheDocument();
                expect(descriptionTabButton.getAttribute("aria-expanded")).toBe("false");
            });

            test("That should, on click, toggle its 'aria-expanded' attribute", async () => {
                await renderFunc({ propsOverride: { defaultOpenTab: "Description" } });

                const descriptionTabButton = screen.getByRole("button", { name: "Description" });
                expect(descriptionTabButton.getAttribute("aria-expanded")).toBe("true");

                await act(async () => userEvent.click(descriptionTabButton));

                expect(descriptionTabButton.getAttribute("aria-expanded")).toBe("false");
            });
        });

        describe("Including the 'Product Details' tab...", () => {
            test("With an 'aria-expanded' attribute of 'true' if the 'defaultOpenTab' prop is 'Product Details'", () => {
                renderFunc({ propsOverride: { defaultOpenTab: "Product Details" } });

                const productDetailsTabButton = screen.getByRole("button", {
                    name: "Product Details",
                });
                expect(productDetailsTabButton).toBeInTheDocument();
                expect(productDetailsTabButton.getAttribute("aria-expanded")).toBe("true");
            });

            test("With an 'aria-expanded' attribute of 'false' if the 'defaultOpenTab' prop is not 'Product Details'", () => {
                // @ts-expect-error - Disabling type checking for props in unit test
                renderFunc({ propsOverride: { defaultOpenTab: "Invalid category" } });

                const productDetailsTabButton = screen.getByRole("button", {
                    name: "Product Details",
                });
                expect(productDetailsTabButton).toBeInTheDocument();
                expect(productDetailsTabButton.getAttribute("aria-expanded")).toBe("false");
            });

            test("That should, on click, toggle its 'aria-expanded' attribute", async () => {
                await renderFunc({ propsOverride: { defaultOpenTab: "Product Details" } });

                const productDetailsTabButton = screen.getByRole("button", {
                    name: "Product Details",
                });
                expect(productDetailsTabButton.getAttribute("aria-expanded")).toBe("true");

                await act(async () => userEvent.click(productDetailsTabButton));

                expect(productDetailsTabButton.getAttribute("aria-expanded")).toBe("false");
            });
        });

        describe("Including the 'Delivery Information' tab...", () => {
            test("With an 'aria-expanded' attribute of 'true' if the 'defaultOpenTab' prop is 'Delivery Information'", () => {
                renderFunc({ propsOverride: { defaultOpenTab: "Delivery Information" } });

                const deliveryInformationTabButton = screen.getByRole("button", {
                    name: "Delivery Information",
                });
                expect(deliveryInformationTabButton).toBeInTheDocument();
                expect(deliveryInformationTabButton.getAttribute("aria-expanded")).toBe("true");
            });

            test("With an 'aria-expanded' attribute of 'false' if the 'defaultOpenTab' prop is not 'Delivery Information'", () => {
                // @ts-expect-error - Disabling type checking for props in unit test
                renderFunc({ propsOverride: { defaultOpenTab: "Invalid category" } });

                const deliveryInformationTabButton = screen.getByRole("button", {
                    name: "Delivery Information",
                });
                expect(deliveryInformationTabButton).toBeInTheDocument();
                expect(deliveryInformationTabButton.getAttribute("aria-expanded")).toBe("false");
            });

            test("That should, on click, toggle its 'aria-expanded' attribute", async () => {
                await renderFunc({ propsOverride: { defaultOpenTab: "Delivery Information" } });

                const deliveryInformationTabButton = screen.getByRole("button", {
                    name: "Delivery Information",
                });
                expect(deliveryInformationTabButton.getAttribute("aria-expanded")).toBe("true");

                await act(async () => userEvent.click(deliveryInformationTabButton));

                expect(deliveryInformationTabButton.getAttribute("aria-expanded")).toBe("false");
            });
        });

        describe("Including the 'Customer Reviews' tab...", () => {
            test("With an 'aria-expanded' attribute of 'true' if the 'defaultOpenTab' prop is 'Customer Reviews'", () => {
                renderFunc({ propsOverride: { defaultOpenTab: "Customer Reviews" } });

                const customerReviewsTabButton = screen.getByRole("button", {
                    name: "Customer Reviews",
                });
                expect(customerReviewsTabButton).toBeInTheDocument();
                expect(customerReviewsTabButton.getAttribute("aria-expanded")).toBe("true");
            });

            test("With an 'aria-expanded' attribute of 'false' if the 'defaultOpenTab' prop is not 'Customer Reviews'", () => {
                // @ts-expect-error - Disabling type checking for props in unit test
                renderFunc({ propsOverride: { defaultOpenTab: "Invalid category" } });

                const customerReviewsTabButton = screen.getByRole("button", {
                    name: "Customer Reviews",
                });
                expect(customerReviewsTabButton).toBeInTheDocument();
                expect(customerReviewsTabButton.getAttribute("aria-expanded")).toBe("false");
            });

            test("That should, on click, toggle its 'aria-expanded' attribute", async () => {
                await renderFunc({ propsOverride: { defaultOpenTab: "Customer Reviews" } });

                const customerReviewsTabButton = screen.getByRole("button", {
                    name: "Customer Reviews",
                });
                expect(customerReviewsTabButton.getAttribute("aria-expanded")).toBe("true");

                await act(async () => userEvent.click(customerReviewsTabButton));

                expect(customerReviewsTabButton.getAttribute("aria-expanded")).toBe("false");
            });
        });

        test("Only one of which should have an 'aria-expanded' attribute of 'true' at any time", async () => {
            renderFunc();

            const descriptionTabButton = screen.getByRole("button", { name: "Description" });
            const productDetailsTabButton = screen.getByRole("button", {
                name: "Product Details",
            });
            const deliveryInformationTabButton = screen.getByRole("button", {
                name: "Delivery Information",
            });
            const customerReviewsTabButton = screen.getByRole("button", {
                name: "Customer Reviews",
            });

            expect(descriptionTabButton.getAttribute("aria-expanded")).toBe("true");
            expect(productDetailsTabButton.getAttribute("aria-expanded")).toBe("false");
            expect(deliveryInformationTabButton.getAttribute("aria-expanded")).toBe("false");
            expect(customerReviewsTabButton.getAttribute("aria-expanded")).toBe("false");

            await act(async () => userEvent.click(productDetailsTabButton));

            expect(descriptionTabButton.getAttribute("aria-expanded")).toBe("false");
            expect(productDetailsTabButton.getAttribute("aria-expanded")).toBe("true");
            expect(deliveryInformationTabButton.getAttribute("aria-expanded")).toBe("false");
            expect(customerReviewsTabButton.getAttribute("aria-expanded")).toBe("false");
        });
    });

    describe("Should render the product's description", async () => {
        test("If the 'Description' tab is expanded", async () => {
            await renderFunc({ propsOverride: { defaultOpenTab: "Description" } });

            const description = screen.getByText(mockProduct.description);
            expect(description).toBeInTheDocument();
        });

        test("Unless the 'Description' tab is not expanded", async () => {
            // @ts-expect-error - Disabling type checking for props in unit test
            renderFunc({ propsOverride: { defaultOpenTab: "Invalid category" } });

            // queryByText *does not* exclude hidden elements - must manually check visibility
            const description = screen.queryByText(mockProduct.description);
            expect(description).not.toBeVisible();
        });

        test("Unless the ProductContext's product's 'awaiting' prop is 'true'", async () => {
            renderFunc({
                ProductContextOverride: { product: { awaiting: true } } as IProductContext,
                propsOverride: { defaultOpenTab: "Description" },
            });

            // queryByText *does not* exclude hidden elements - must manually check visibility
            const description = screen.queryByText(mockProduct.description);
            expect(description).not.toBeInTheDocument();
        });

        test("Unless the ProductContext's product data is falsy", async () => {
            await renderFunc({
                ProductContextOverride: {
                    product: { response: { data: null } },
                } as IProductContext,
                propsOverride: { defaultOpenTab: "Description" },
            });

            const description = screen.queryByText(mockProduct.description);
            expect(description).not.toBeInTheDocument();
        });
    });

    describe("Should render a <table> element containing the product details...", () => {
        test("If the 'Product Details' tab is expanded", async () => {
            renderFunc({ propsOverride: { defaultOpenTab: "Product Details" } });

            const productDetailsTable = screen.getByRole("table");
            expect(productDetailsTable).toBeInTheDocument();
        });

        test("Unless the 'Product Details' tab is not expanded", async () => {
            // @ts-expect-error - Disabling type checking for props in unit test
            renderFunc({ propsOverride: { defaultOpenTab: "Invalid category" } });

            const productDetailsTable = screen.queryByRole("table");
            expect(productDetailsTable).not.toBeInTheDocument();
        });

        test("Unless the ProductContext's product's 'awaiting' prop is 'true'", async () => {
            renderFunc({
                ProductContextOverride: { product: { awaiting: true } } as IProductContext,
                propsOverride: { defaultOpenTab: "Product Details" },
            });

            const productDetailsTable = screen.queryByRole("table");
            expect(productDetailsTable).not.toBeInTheDocument();
        });

        test("Unless the ProductContext's variant data is falsy", async () => {
            renderFunc({
                ProductContextOverride: { variant: null } as IProductContext,
                propsOverride: { defaultOpenTab: "Product Details" },
            });

            const productDetailsTable = screen.queryByRole("table");
            expect(productDetailsTable).not.toBeInTheDocument();
        });

        test("Containing a row for the product variant's SKU", async () => {
            renderFunc({ propsOverride: { defaultOpenTab: "Product Details" } });

            const productDetailsTableRow = screen.getByRole("row", {
                name: `SKU ${mockVariant.sku}`,
            });
            expect(productDetailsTableRow).toBeInTheDocument();
        });

        test("Containing a row for each of the product variant's details in its 'details' field", async () => {
            renderFunc({ propsOverride: { defaultOpenTab: "Product Details" } });

            const { details } = mockVariant;
            details.forEach((detail) => {
                const { name, value } = detail;
                const productDetailsTableRow = screen.getByRole("row", {
                    name: `${name} ${value}`,
                });
                expect(productDetailsTableRow).toBeInTheDocument();
            });
        });

        test("Containing a row for the product variant's release date in the format: e.g. - January 1, 1970", async () => {
            renderFunc({ propsOverride: { defaultOpenTab: "Product Details" } });

            const productDetailsTableRow = screen.getByRole("row", {
                name: `Release Date January 1, 1970`,
            });
            expect(productDetailsTableRow).toBeInTheDocument();
        });
    });

    describe("Should render the CustomerReviews component...", () => {
        test("If the 'Customer Reviews' tab is expanded", async () => {
            renderFunc({ propsOverride: { defaultOpenTab: "Customer Reviews" } });

            const ProductReviewsComponent = screen.getByLabelText("ProductReviews component");
            expect(ProductReviewsComponent).toBeInTheDocument();
            expect(ProductReviewsComponent).toBeVisible();
        });

        test("Unless the 'Customer Reviews' tab is not expanded", async () => {
            // @ts-expect-error - Disabling type checking for props in unit test
            renderFunc({ propsOverride: { defaultOpenTab: "Invalid category" } });

            // queryByLabelText *does not* exclude hidden elements - must manually check visibility
            const ProductReviewsComponent = screen.queryByLabelText("ProductReviews component");
            expect(ProductReviewsComponent).not.toBeVisible();
        });
    });
});
