import { Product, ProductVariant } from "@/utils/products/product";
import { PopulatedCartItemData } from "@/utils/products/cart";

export const calculateMaxAddableVariantStock = (
    cart: PopulatedCartItemData[],
    product: Product,
    variant: ProductVariant,
): number => {
    const { allowance } = product;
    const { stock, allowanceOverride } = variant;
    const allowanceOverrideIsNumber = !Number.isNaN(Number(allowanceOverride));

    const cartItem = cart.find((item) => item.variant.id === variant.id);
    if (!cartItem) {
        return Math.min(
            stock,
            allowanceOverrideIsNumber ? (allowanceOverride as number) : allowance,
        );
    }
    const { quantity } = cartItem;

    if (allowanceOverrideIsNumber) {
        return Math.max(0, Math.min(stock, allowanceOverride as number) - quantity);
    }
    return Math.max(0, Math.min(stock, allowance) - quantity);
};
