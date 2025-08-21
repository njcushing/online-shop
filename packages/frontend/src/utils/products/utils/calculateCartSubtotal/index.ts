import { settings } from "@settings";
import { PopulatedCart } from "../../cart";

const { freeDeliveryThreshold, expressDeliveryCost } = settings;

/**
 * Order of operations for cart subtotal calculation:
 *
 * 1. Calculate total price of products using their 'current' values, i.e. - their variant-level
 *    discounts are already priced in.
 * 2. Apply subscription discounts for applicable items.
 * 3. Using the current subtotal of the cart, apply promotions (as long as each one meets their
 *    specified threshold values) - DO NOT recalculate the subtotal after each promotion is applied:
 *    3a. Subtract fixed-amount promotions first (e.g. - £10 off).
 *    3a. Subtract percentage promotions last (e.g. - 10% off).
 * 4. Using the current subtotal of the cart, apply postage cost if applicable.
 */

type ReturnType = {
    cost: { products: number; postage: number; total: number };
    discount: {
        products: number;
        subscriptions: number;
        promotions: {
            total: number;
            individual: { code: PopulatedCart["promotions"][number]["code"]; value: number }[];
        };
    };
};

export const calculateCartSubtotal = (cart: PopulatedCart): ReturnType => {
    const { items, promotions } = cart;

    const cost: ReturnType["cost"] = { products: 0, postage: 0, total: 0 };
    const discount: ReturnType["discount"] = {
        products: 0,
        subscriptions: 0,
        promotions: { total: 0, individual: [] },
    };

    items.forEach((item) => {
        const { variant, quantity, info } = item;
        const { price } = variant;
        const { current, base, subscriptionDiscountPercentage } = price;

        let unitPrice = current;
        if (info?.subscription) unitPrice *= 1 - subscriptionDiscountPercentage / 100;
        unitPrice = Math.floor(unitPrice);

        cost.products += base * quantity;
        cost.total += unitPrice * quantity;

        discount.products += (base - current) * quantity;
        discount.subscriptions += (current - unitPrice) * quantity;
    });

    const totalBeforePromotions = cost.total;
    promotions
        .sort((a, b) => {
            if (a.discount.type === "percentage" && b.discount.type === "fixed") return 1;
            return -1;
        })
        .forEach((promotion) => {
            const { code, threshold, discount: promotionDiscount } = promotion;
            const { value, type } = promotionDiscount;

            if (totalBeforePromotions >= threshold) {
                if (type === "fixed") {
                    const amountToSubtract = value;

                    cost.total -= amountToSubtract;
                    discount.promotions.total += amountToSubtract;
                    discount.promotions.individual.push({ code, value: amountToSubtract });
                }

                if (type === "percentage") {
                    const amountToSubtract = totalBeforePromotions * (value / 100);

                    cost.total -= amountToSubtract;
                    discount.promotions.total += amountToSubtract;
                    discount.promotions.individual.push({ code, value: amountToSubtract });
                }
            }
        });

    cost.postage = cost.products >= freeDeliveryThreshold ? 0 : expressDeliveryCost;
    cost.total += cost.postage;

    return { cost, discount };
};
