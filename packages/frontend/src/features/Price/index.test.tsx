import { vi } from "vitest";
import { screen, render } from "@test-utils";
import { RecursivePartial } from "@/utils/types";
import { Price, TPrice } from ".";

// Mock dependencies
const mockProps: RecursivePartial<TPrice> = {
    base: 100,
    current: 100,
    multiply: 1,
    size: "md",
};

const mockCreatePriceAdjustmentString = vi.fn((current: number, base: number): string => {
    return JSON.stringify({ current, base });
});
vi.mock("@/utils/createPriceAdjustmentString", () => ({
    createPriceAdjustmentString: (current: number, base: number) => {
        return mockCreatePriceAdjustmentString(current, base);
    },
}));

describe("The Price component...", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    test("Should render the current price in the format £XX.XX, using the 'current' prop, in pence", () => {
        render(<Price {...(mockProps as unknown as TPrice)} />);

        const { current, multiply } = mockProps;
        const currentPriceString = `£${((current! * multiply!) / 100).toFixed(2)}`;

        const currentPrice = screen.getByText(currentPriceString);
        expect(currentPrice).toBeInTheDocument();
    });

    describe("If the 'base' and 'current' props are not equal...", () => {
        test("Should render the base price in the format £XX.XX, using the 'base' prop, in pence", () => {
            const adjustedMockProps = structuredClone(mockProps);
            adjustedMockProps.base = 200;
            render(<Price {...(adjustedMockProps as unknown as TPrice)} />);

            const { base, multiply } = mockProps;
            const basePriceString = `£${((base! * multiply!) / 100).toFixed(2)}`;

            const basePrice = screen.getByText(basePriceString);
            expect(basePrice).toBeInTheDocument();
        });

        test("Should call the 'createPriceAdjustmentString' function with the correct props", () => {
            const adjustedMockProps = structuredClone(mockProps);
            adjustedMockProps.base = 200;
            render(<Price {...(adjustedMockProps as unknown as TPrice)} />);

            const { base, current, multiply } = adjustedMockProps;

            expect(mockCreatePriceAdjustmentString).toHaveBeenCalledTimes(1);
            expect(mockCreatePriceAdjustmentString).toHaveBeenCalledWith(
                current! * multiply!,
                base! * multiply!,
            );
        });

        test("Should render the return value from the 'createPriceAdjustmentString' function", () => {
            mockCreatePriceAdjustmentString.mockReturnValueOnce("test");

            const adjustedMockProps = structuredClone(mockProps);
            adjustedMockProps.base = 200;
            render(<Price {...(adjustedMockProps as unknown as TPrice)} />);

            const priceAdjustmentString = screen.getByText("test");
            expect(priceAdjustmentString).toBeInTheDocument();
        });
    });
});
