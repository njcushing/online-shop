import _ from "lodash";
import { RecursivePartial } from "@/utils/types";
import { calculateUnitPrice } from ".";

const mockArgs: RecursivePartial<Parameters<typeof calculateUnitPrice>> = [
    {
        variant: {
            price: {
                current: 550,
                base: 700,
                subscriptionDiscountPercentage: 10,
            },
        },
        info: { subscription: { frequency: "one_month" } },
    },
];

describe("The 'calculateUnitPrice' function...", () => {
    test("Should return the correct unit price when the product variant is not being subscribed to", () => {
        const adjustedMockArgs = _.merge(_.cloneDeep(mockArgs), [{ info: null }]);
        const result = calculateUnitPrice(
            ...(adjustedMockArgs as Parameters<typeof calculateUnitPrice>),
        );

        const cartItem = mockArgs[0];
        const { current } = cartItem!.variant!.price!;

        expect(result).toBe(current);
    });

    test("Should return the correct unit price when the product variant is being subscribed to", () => {
        const result = calculateUnitPrice(...(mockArgs as Parameters<typeof calculateUnitPrice>));

        const cartItem = mockArgs[0];
        const { current, subscriptionDiscountPercentage } = cartItem!.variant!.price!;

        expect(result).toBe(current! * (1 - subscriptionDiscountPercentage! / 100));
    });
});
