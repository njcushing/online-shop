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

    describe("Should return the correct information for the promotion(s)...", () => {
        test("Including the total promotion discount value", () => {
            const result = calculateCartSubtotal(
                ...(mockArgs as Parameters<typeof calculateCartSubtotal>),
            );

            expect(result).toEqual(
                expect.objectContaining({
                    discount: expect.objectContaining({
                        promotions: expect.objectContaining({
                            total: 2215,
                        }),
                    }),
                }),
            );
        });

        test("Including the discount amounts for each promotion individually", () => {
            const result = calculateCartSubtotal(
                ...(mockArgs as Parameters<typeof calculateCartSubtotal>),
            );

            expect(result).toEqual(
                expect.objectContaining({
                    discount: expect.objectContaining({
                        promotions: expect.objectContaining({
                            individual: [
                                { code: "TESTF", value: 1000 },
                                { code: "TESTP", value: 1215 },
                            ],
                        }),
                    }),
                }),
            );
        });
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
