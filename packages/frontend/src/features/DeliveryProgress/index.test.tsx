import { vi } from "vitest";
import { screen, render } from "@test-utils";
import { IUserContext, UserContext } from "@/pages/Root";
import { RecursivePartial } from "@/utils/types";
import { DeliveryProgress } from ".";

// Mock dependencies
const mockUserContextValue: RecursivePartial<IUserContext> = {
    cart: { response: { data: [] } },
};

type renderFuncArgs = {
    UserContextOverride?: IUserContext;
};
const renderFunc = (args: renderFuncArgs = {}) => {
    const { UserContextOverride } = args;

    let UserContextValue!: IUserContext;

    const component = (
        <UserContext.Provider
            value={UserContextOverride || (mockUserContextValue as unknown as IUserContext)}
        >
            <UserContext.Consumer>
                {(value) => {
                    UserContextValue = value;
                    return null;
                }}
            </UserContext.Consumer>
            <DeliveryProgress />
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

describe("The DeliveryProgress component...", () => {
    describe("If the subtotal of cart items' values is lower than the freeDeliveryThreshold...", () => {
        test("Should render a Mantine Progress component with the correct props", () => {
            renderFunc();

            const element = screen.getByRole("progressbar");
            expect(element).toBeInTheDocument();
        });
    });

    describe("If the subtotal of cart items' values is greater than or equal to the freeDeliveryThreshold...", () => {
        test("Should render text to convey this information to the user", () => {
            mockCalculateSubtotal.mockReturnValueOnce(1);

            renderFunc();

            const element = screen.getByText("You've qualified for free delivery!");
            expect(element).toBeInTheDocument();
        });
    });

    test("Should treat the subtotal of cart items as 0 if the UserContext does not contain valid cart data", () => {
        renderFunc({
            UserContextOverride: { cart: { response: { data: null } } } as unknown as IUserContext,
        });

        const element = screen.getByRole("progressbar");
        expect(element).toBeInTheDocument();
    });
});
