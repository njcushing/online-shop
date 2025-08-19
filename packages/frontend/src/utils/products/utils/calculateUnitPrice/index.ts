import { PopulatedCartItemData } from "../../cart";

export const calculateUnitPrice = (cartItem: PopulatedCartItemData): number => {
    const { variant, info } = cartItem;
    const { price } = variant;
    const { current, subscriptionDiscountPercentage } = price;

    let unitPrice = current;
    if (info?.subscription) unitPrice *= 1 - subscriptionDiscountPercentage / 100;
    unitPrice = Math.floor(unitPrice);

    return unitPrice;
};
