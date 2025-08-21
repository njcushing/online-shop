import { vi } from "vitest";
import { RecursivePartial } from "@/utils/types";
import { calculateCartSubtotal } from ".";

const mockArgs: RecursivePartial<Parameters<typeof calculateCartSubtotal>> = [
    {
        items: [
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
        promotions: [
            {
                code: "TESTP",
                description: "Test percentage promotional discount code",
                threshold: 5000,
                discount: { value: 10, type: "percentage" },
            },
            {
                code: "TESTF",
                description: "Test fixed promotional discount code",
                threshold: 2000,
                discount: { value: 1000, type: "fixed" },
            },
        ],
    },
];

vi.mock("@settings", () => ({
    settings: { freeDeliveryThreshold: 5000, expressDeliveryCost: 599 },
}));

describe("The 'calculateCartSubtotal' function...", () => {
    test("Should return the correct total base cost of the products before any price reductions", () => {
        const result = calculateCartSubtotal(
            ...(mockArgs as Parameters<typeof calculateCartSubtotal>),
        );

        expect(result).toEqual(
            expect.objectContaining({
                cost: expect.objectContaining({
                    products: 16000,
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
            const result = calculateCartSubtotal({ items: [], promotions: [] });

            expect(result).toEqual(
                expect.objectContaining({
                    cost: expect.objectContaining({
                        postage: 599,
                    }),
                }),
            );
        });
    });

    test("Should return the correct product discount total", () => {
        const result = calculateCartSubtotal(
            ...(mockArgs as Parameters<typeof calculateCartSubtotal>),
        );

        expect(result).toEqual(
            expect.objectContaining({
                discount: expect.objectContaining({
                    products: 2900,
                }),
            }),
        );
    });

    test("Should return the correct subscription discount total", () => {
        const result = calculateCartSubtotal(
            ...(mockArgs as Parameters<typeof calculateCartSubtotal>),
        );

        expect(result).toEqual(
            expect.objectContaining({
                discount: expect.objectContaining({
                    subscriptions: 950,
                }),
            }),
        );
    });

    test("Should return the correct promotion discount total", () => {
        const result = calculateCartSubtotal(
            ...(mockArgs as Parameters<typeof calculateCartSubtotal>),
        );

        expect(result).toEqual(
            expect.objectContaining({
                discount: expect.objectContaining({
                    promotions: 2215,
                }),
            }),
        );
    });

    test("Should return the correct cart subtotal", () => {
        const result = calculateCartSubtotal(
            ...(mockArgs as Parameters<typeof calculateCartSubtotal>),
        );

        expect(result).toEqual(
            expect.objectContaining({
                cost: expect.objectContaining({
                    total: 9935,
                }),
            }),
        );
    });
});
