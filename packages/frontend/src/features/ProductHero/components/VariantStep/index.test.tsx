import { vi } from "vitest";
import { screen, render, userEvent } from "@test-utils";
import _ from "lodash";
import { IProductContext, ProductContext } from "@/pages/Product";
import { RecursivePartial } from "@/utils/types";
import { act } from "react";
import { mockVariantOptions } from "./index.mocks";
import { TVariantStep, VariantStep } from ".";

// Mock dependencies
const mockProps: TVariantStep = {
    id: "variantOption1",
    values: new Set(["variantOption1Value1", "variantOption1Value2", "variantOption1Value3"]),
    selected: "variantOption1Value1",
};

// Mock contexts are only using fields relevant to component being tested
const mockVariant = {
    id: "variantId",
    options: { variantOption1: "variantOption1Value1", variantOption2: "variantOption2Value1" },
} as unknown as IProductContext["variant"];
const mockProduct = {
    id: "productId",
    variants: [mockVariant],
    variantOptionOrder: ["variantOption1", "variantOption2", "variantOption3"],
} as unknown as IProductContext["product"]["data"];
const mockSetSelectedVariantOptions = vi.fn();
const mockProductContext: RecursivePartial<IProductContext> = {
    product: { data: mockProduct, awaiting: false },
    variant: mockVariant,
    selectedVariantOptions: { variantOption1: "variantOption1Value1" },
    setSelectedVariantOptions: mockSetSelectedVariantOptions,
};

type renderFuncArgs = {
    ProductContextOverride?: IProductContext;
    propsOverride?: TVariantStep;
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
                <VariantStep {...mergedProps} />
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

vi.mock("@/utils/products/product", async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...(actual || {}),
        variantOptions: (await import("./index.mocks")).mockVariantOptions,
    };
});

const mockSortSet = vi.fn(() => mockProps.values);
vi.mock("@/utils/sortSet", () => ({
    sortSet: () => mockSortSet(),
}));

describe("The VariantStep component...", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    test("Should render an element with text content equal to the option's title", () => {
        renderFunc();

        const title = screen.getByText(mockVariantOptions[0].title);
        expect(title).toBeInTheDocument();
    });

    describe("Should render a <button> element...", () => {
        describe("For each entry in the 'values' prop array...", () => {
            test("With text content equal to that option value's 'name' from 'variantOptions'", () => {
                renderFunc();

                const buttonValue1 = screen.getByRole("button", { name: "Value 1" });
                expect(buttonValue1).toBeInTheDocument();

                const buttonValue2 = screen.getByRole("button", { name: "Value 2" });
                expect(buttonValue2).toBeInTheDocument();
            });

            test("Or text content equal to the value itself if it doesn't have a 'name'", () => {
                renderFunc();

                const buttonValue3 = screen.getByRole("button", { name: "variantOption1Value3" });
                expect(buttonValue3).toBeInTheDocument();
            });

            test("That should have a 'data-selected' attribute of 'true' if its 'id' (from 'variantOptions') matches the 'selected' prop", () => {
                renderFunc();

                const buttonValue1 = screen.getByRole("button", { name: "Value 1" });
                expect(buttonValue1.getAttribute("data-selected")).toBe("true");
            });

            test("That should have a 'data-selected' attribute of 'false' if its 'id' (from 'variantOptions') does not match the 'selected' prop", () => {
                renderFunc();

                const buttonValue2 = screen.getByRole("button", { name: "Value 2" });
                expect(buttonValue2.getAttribute("data-selected")).toBe("false");

                const buttonValue3 = screen.getByRole("button", { name: "variantOption1Value3" });
                expect(buttonValue3.getAttribute("data-selected")).toBe("false");
            });

            test("That should be disabled if its 'id' (from 'variantOptions') matches the 'selected' prop", () => {
                renderFunc();

                const buttonValue1 = screen.getByRole("button", { name: "Value 1" });
                expect(buttonValue1).toBeDisabled();
            });

            test("That should be enabled if its 'id' (from 'variantOptions') does not match the 'selected' prop", () => {
                renderFunc();

                const buttonValue2 = screen.getByRole("button", { name: "Value 2" });
                expect(buttonValue2).not.toBeDisabled();

                const buttonValue3 = screen.getByRole("button", { name: "variantOption1Value3" });
                expect(buttonValue3).not.toBeDisabled();
            });

            test("That should have a 'tabIndex' of -1 if its 'id' (from 'variantOptions') matches the 'selected' prop", () => {
                renderFunc();

                const buttonValue1 = screen.getByRole("button", { name: "Value 1" });
                expect(buttonValue1.tabIndex).toBe(-1);
            });

            test("That should have a 'tabIndex' of 0 if its 'id' (from 'variantOptions') does not match the 'selected' prop", () => {
                renderFunc();

                const buttonValue2 = screen.getByRole("button", { name: "Value 2" });
                expect(buttonValue2.tabIndex).toBe(0);

                const buttonValue3 = screen.getByRole("button", { name: "variantOption1Value3" });
                expect(buttonValue3.tabIndex).toBe(0);
            });

            test("That should, on click, call the ProductContext's 'setSelectedVariantOptions' setter with the correct argument", async () => {
                renderFunc();

                const buttonValue2 = screen.getByRole("button", { name: "Value 2" });
                expect(buttonValue2).toBeEnabled();

                await act(async () => userEvent.click(buttonValue2));

                expect(mockSetSelectedVariantOptions).toHaveBeenCalledWith({
                    variantOption1: "variantOption1Value2",
                });
            });
        });
    });
});
