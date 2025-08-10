import { vi } from "vitest";
import { screen, render } from "@test-utils";
import { IUserContext, UserContext } from "@/pages/Root";
import { RecursivePartial } from "@/utils/types";
import { CartItem, TCartItem } from ".";

// Mock dependencies
const mockProps: RecursivePartial<TCartItem> = {
    data: {
        product: {
            name: { full: "productName" },
            images: { thumb: { src: "productImgSrc", alt: "productImgAlt" } },
            allowance: 100,
        },
        variant: {
            price: { base: 100, current: 100 },
            stock: 10,
            options: {
                option1Name: "option1Value",
                option2Name: "option2Value",
                option3Name: "option3Value",
            },
            image: { src: "variantImgSrc", alt: "variantImgAlt" },
            allowanceOverride: 5,
        },
        quantity: 1,
    },
};

const mockUserContext: RecursivePartial<IUserContext> = {
    cart: { response: { data: [] }, awaiting: false },
};

type renderFuncArgs = {
    UserContextOverride?: IUserContext;
    propsOverride?: TCartItem;
};
const renderFunc = (args: renderFuncArgs = {}) => {
    const { UserContextOverride, propsOverride } = args;

    let UserContextValue!: IUserContext;

    const component = (
        <UserContext.Provider
            value={UserContextOverride || (mockUserContext as unknown as IUserContext)}
        >
            <UserContext.Consumer>
                {(value) => {
                    UserContextValue = value;
                    return null;
                }}
            </UserContext.Consumer>
            <CartItem
                data={propsOverride?.data || (mockProps.data as unknown as TCartItem["data"])}
            />
        </UserContext.Provider>
    );

    const { rerender } = render(component);

    return {
        rerender,
        UserContextValue,
        component,
    };
};

vi.mock("@settings", () => ({ settings: { freeDeliveryThreshold: 1 } }));

const mockCalculateSubtotal = vi.fn(() => 0);
vi.mock("@/utils/products/cart", async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...(actual || {}),
        calculateSubtotal: () => mockCalculateSubtotal(),
    };
});

vi.mock("@/components/Inputs/Quantity", () => ({
    Quantity: vi.fn((props: unknown) => {
        return <input aria-label="Quantity component" data-props={JSON.stringify(props)}></input>;
    }),
}));

vi.mock("@/features/Price", () => ({
    Price: vi.fn((props: unknown) => {
        return <input aria-label="Price component" data-props={JSON.stringify(props)}></input>;
    }),
}));

vi.mock("@/utils/products/product", async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...(actual || {}),
        variantOptions: [
            {
                id: "option1Name",
                name: "Option 1 Name",
                values: [{ id: "option1Value", name: "Option 1 Value" }],
            },
        ],
    };
});

describe("The CartItem component...", () => {
    describe("Should render a Mantine Image component...", () => {
        test("With props pertaining to the variant's image as a priority", () => {
            renderFunc();

            const img = screen.getByRole("img");
            expect(img).toBeInTheDocument();
            expect(img.getAttribute("src")).toBe(mockProps.data!.variant!.image!.src);
            expect(img.getAttribute("alt")).toBe(mockProps.data!.variant!.image!.alt);
        });

        test("With the product's thumb image as a backup if the variant has no image", () => {
            const copiedMockProps = structuredClone(mockProps);
            copiedMockProps.data!.variant!.image = undefined;
            renderFunc({ propsOverride: copiedMockProps as unknown as TCartItem });

            const img = screen.getByRole("img");
            expect(img).toBeInTheDocument();
            expect(img.getAttribute("src")).toBe(mockProps.data!.product!.images!.thumb!.src);
            expect(img.getAttribute("alt")).toBe(mockProps.data!.product!.images!.thumb!.alt);
        });

        test("Unless the UserContext's cart data is still being awaited", () => {
            const copiedMockUserContext = structuredClone(mockUserContext);
            copiedMockUserContext.cart!.awaiting = true;
            renderFunc({ UserContextOverride: copiedMockUserContext as unknown as IUserContext });

            // queryByRole *does* exclude hidden elements
            const img = screen.queryByRole("img");
            expect(img).not.toBeInTheDocument();
        });
    });

    describe("Should render the product's full name...", () => {
        test("From the cart item's data passed to the component in the 'data' prop", () => {
            renderFunc();

            const fullName = screen.getByText(mockProps.data!.product!.name!.full!);
            expect(fullName).toBeInTheDocument();
        });

        test("Unless the UserContext's cart data is still being awaited", () => {
            const copiedMockUserContext = structuredClone(mockUserContext);
            copiedMockUserContext.cart!.awaiting = true;
            renderFunc({ UserContextOverride: copiedMockUserContext as unknown as IUserContext });

            // queryByText *does not* exclude hidden elements - must manually check visibility
            const fullName = screen.queryByText(mockProps.data!.product!.name!.full!);
            expect(fullName).not.toBeVisible();
        });
    });

    describe("Should render informaton about each of the variant's options...", () => {
        test("Including the name and value from the defined variant options", () => {
            renderFunc();

            const QuantityComponent = screen.getByLabelText("Quantity component");
            expect(QuantityComponent).toBeInTheDocument();

            expect(screen.getByText("Option 1 Name", { exact: false })).toBeInTheDocument();
            expect(screen.getByText("Option 1 Value")).toBeInTheDocument();
        });

        test("Or the key and value as a backup", () => {
            renderFunc();

            const QuantityComponent = screen.getByLabelText("Quantity component");
            expect(QuantityComponent).toBeInTheDocument();

            expect(screen.getByText("option2Name", { exact: false })).toBeInTheDocument();
            expect(screen.getByText("option2Value")).toBeInTheDocument();

            expect(screen.getByText("option3Name", { exact: false })).toBeInTheDocument();
            expect(screen.getByText("option3Value")).toBeInTheDocument();
        });

        test("Unless the UserContext's cart data is still being awaited", () => {
            const copiedMockUserContext = structuredClone(mockUserContext);
            copiedMockUserContext.cart!.awaiting = true;
            renderFunc({ UserContextOverride: copiedMockUserContext as unknown as IUserContext });

            const QuantityComponent = screen.getByLabelText("Quantity component");
            expect(QuantityComponent).toBeInTheDocument();

            // queryByText *does not* exclude hidden elements - must manually check visibility
            expect(screen.queryByText("Option 1 Name", { exact: false })).not.toBeVisible();
            expect(screen.queryByText("Option 1 Value")).not.toBeVisible();

            expect(screen.queryByText("option2Name", { exact: false })).not.toBeVisible();
            expect(screen.queryByText("option2Value")).not.toBeVisible();

            expect(screen.queryByText("option3Name", { exact: false })).not.toBeVisible();
            expect(screen.queryByText("option3Value")).not.toBeVisible();
        });
    });

    describe("Should render the Quantity component...", () => {
        test("Passing the correct props when the variant has a valid 'allowanceOverride' value", () => {
            renderFunc();

            const QuantityComponent = screen.getByLabelText("Quantity component");
            expect(QuantityComponent).toBeInTheDocument();

            const props = QuantityComponent.getAttribute("data-props");
            expect(JSON.parse(props!)).toEqual(
                expect.objectContaining({
                    min: 1,
                    max: 5, // Minimum value between variant's stock and allowanceOverride
                    disabled: false,
                }),
            );
        });

        test("Passing the correct props when the variant doesn't have a valid 'allowanceOverride' value", () => {
            const copiedMockProps = structuredClone(mockProps);
            copiedMockProps.data!.variant!.allowanceOverride = undefined;
            renderFunc({ propsOverride: copiedMockProps as unknown as TCartItem });

            const QuantityComponent = screen.getByLabelText("Quantity component");
            expect(QuantityComponent).toBeInTheDocument();

            const props = QuantityComponent.getAttribute("data-props");
            expect(JSON.parse(props!)).toEqual(
                expect.objectContaining({
                    min: 1,
                    max: 10, // Minimum value between variant's stock and product's allowance
                    disabled: false,
                }),
            );
        });

        test("Unless the UserContext's cart data is still being awaited", () => {
            const copiedMockUserContext = structuredClone(mockUserContext);
            copiedMockUserContext.cart!.awaiting = true;
            renderFunc({ UserContextOverride: copiedMockUserContext as unknown as IUserContext });

            // queryByLabelText *does not* exclude hidden elements - must manually check visibility
            const QuantityComponent = screen.queryByLabelText("Quantity component");
            expect(QuantityComponent).not.toBeVisible();
        });
    });

    describe("Should render the Price component...", () => {
        test("Passing the correct props", () => {
            renderFunc();

            const PriceComponent = screen.getByLabelText("Price component");
            expect(PriceComponent).toBeInTheDocument();

            const props = PriceComponent.getAttribute("data-props");
            expect(JSON.parse(props!)).toEqual(
                expect.objectContaining({
                    base: mockProps.data!.variant!.price!.base,
                    current: mockProps.data!.variant!.price!.current,
                    multiply: mockProps.data!.quantity,
                }),
            );
        });

        test("Unless the UserContext's cart data is still being awaited", () => {
            const copiedMockUserContext = structuredClone(mockUserContext);
            copiedMockUserContext.cart!.awaiting = true;
            renderFunc({ UserContextOverride: copiedMockUserContext as unknown as IUserContext });

            // queryByLabelText *does not* exclude hidden elements - must manually check visibility
            const PriceComponent = screen.queryByLabelText("Price component");
            expect(PriceComponent).not.toBeVisible();
        });
    });
});
