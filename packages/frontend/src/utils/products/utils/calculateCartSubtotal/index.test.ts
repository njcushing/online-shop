import { vi } from "vitest";
import { RecursivePartial } from "@/utils/types";
import { calculateCartSubtotal } from ".";

const mockArgs: RecursivePartial<Parameters<typeof calculateCartSubtotal>> = [
    [
        {
            variant: {
                price: {
                    current: 550,
                    base: 700,
                    subscriptionDiscountPercentage: 10,
                },
            },
            quantity: 10,
            info: { subscription: { frequency: "one_month" } },
        },
        {
            variant: {
                price: {
                    current: 1200,
                    base: 1400,
                    subscriptionDiscountPercentage: 0,
                },
            },
            quantity: 5,
        },
        {
            variant: {
                price: {
                    current: 200,
                    base: 250,
                    subscriptionDiscountPercentage: 25,
                },
            },
            quantity: 8,
            info: { subscription: { frequency: "one_week" } },
        },
    ],
];

vi.mock("@settings", () => ({
    settings: { freeDeliveryThreshold: 5000, expressDeliveryCost: 599 },
}));

describe("The 'calculateCartSubtotal' function...", () => {
    test("Should return the correct total base cost of the products before any price reductions", () => {
        const result = calculateCartSubtotal(
            ...(mockArgs as Parameters<typeof calculateCartSubtotal>),
        );

        const cart = mockArgs[0]!;
        const productsSubtotal = cart.reduce((prev, curr) => {
            const { variant, quantity } = curr!;
            const { base } = variant!.price!;

            return prev + base! * quantity!;
        }, 0);

        expect(result).toEqual(
            expect.objectContaining({
                cost: expect.objectContaining({
                    products: productsSubtotal,
                }),
            }),
        );
    });

    describe("Should return the correct postage cost...", () => {
        test("If the cart subtotal exceeds the free delivery threshold", () => {
            const result = calculateCartSubtotal(
                ...(mockArgs as Parameters<typeof calculateCartSubtotal>),
            );

            expect(result).toEqual(
                expect.objectContaining({
                    cost: expect.objectContaining({
                        postage: 0,
                    }),
                }),
            );
        });

        test("If the cart subtotal does not exceed the free delivery threshold", () => {
            const result = calculateCartSubtotal([]);

            expect(result).toEqual(
                expect.objectContaining({
                    cost: expect.objectContaining({
                        postage: 599,
                    }),
                }),
            );
        });
    });

    test("Should return the correct cart subtotal", () => {
        const result = calculateCartSubtotal(
            ...(mockArgs as Parameters<typeof calculateCartSubtotal>),
        );

        const cart = mockArgs[0]!;
        const cartSubtotal = cart.reduce((prev, curr) => {
            const { variant, quantity, info } = curr!;
            const { current, subscriptionDiscountPercentage } = variant!.price!;

            let unitPrice = current!;
            if (info?.subscription) unitPrice *= 1 - subscriptionDiscountPercentage! / 100;
            unitPrice = Math.floor(unitPrice);

            return prev + unitPrice * quantity!;
        }, 0);

        expect(result).toEqual(
            expect.objectContaining({
                cost: expect.objectContaining({
                    total: cartSubtotal,
                }),
            }),
        );
    });

    test("Should return the correct product discount total", () => {
        const result = calculateCartSubtotal(
            ...(mockArgs as Parameters<typeof calculateCartSubtotal>),
        );

        const cart = mockArgs[0]!;
        const productsDiscountSubtotal = cart.reduce((prev, curr) => {
            const { variant, quantity } = curr!;
            const { base, current } = variant!.price!;

            return prev + (base! - current!) * quantity!;
        }, 0);

        expect(result).toEqual(
            expect.objectContaining({
                discount: expect.objectContaining({
                    products: productsDiscountSubtotal,
                }),
            }),
        );
    });

    test("Should return the correct subscription discount total", () => {
        const result = calculateCartSubtotal(
            ...(mockArgs as Parameters<typeof calculateCartSubtotal>),
        );

        const cart = mockArgs[0]!;
        const subscriptionsDiscountSubtotal = cart.reduce((prev, curr) => {
            const { variant, quantity, info } = curr!;
            const { current, subscriptionDiscountPercentage } = variant!.price!;

            let unitPrice = current!;
            if (info?.subscription) unitPrice *= 1 - subscriptionDiscountPercentage! / 100;
            unitPrice = Math.floor(unitPrice);

            return prev + (current! - unitPrice) * quantity!;
        }, 0);

        expect(result).toEqual(
            expect.objectContaining({
                discount: expect.objectContaining({
                    subscriptions: subscriptionsDiscountSubtotal,
                }),
            }),
        );
    });
});
