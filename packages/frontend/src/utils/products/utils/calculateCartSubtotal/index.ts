import { settings } from "@settings";
import { PopulatedCart } from "../../cart";

const { freeDeliveryThreshold, expressDeliveryCost } = settings;

export const calculateCartSubtotal = (
    cart: PopulatedCart,
): {
    cost: { products: number; postage: number; total: number };
    discount: { products: number; subscriptions: number; promotions: number };
} => {
    const { items } = cart;

    const cost = { products: 0, postage: 0, total: 0 };
    const discount = { products: 0, subscriptions: 0, promotions: 0 };

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

    // Promotions not yet implemented

    cost.postage = cost.products >= freeDeliveryThreshold ? 0 : expressDeliveryCost;
    cost.total += cost.postage;

    return { cost, discount };
};
