import {
    ProductVariant,
    Product,
    generateSkeletonProduct,
    generateSkeletonProductVariant,
} from "@/utils/products/product";
import { RecursivePartial } from "@/utils/types";

export type CartItemData = {
    productId: Product["id"];
    variantId: Product["variants"][number]["id"];
    quantity: number;
};

export type PopulatedCartItemData = {
    product: Product;
    variant: ProductVariant;
    quantity: number;
};

export const mockCart: CartItemData[] = [
    { productId: "1", variantId: "1-1", quantity: 10 },
    { productId: "1", variantId: "1-2", quantity: 5 },
    { productId: "2", variantId: "2-2", quantity: 15 },
    { productId: "3", variantId: "3-1", quantity: 6 },
    { productId: "3", variantId: "3-3", quantity: 18 },
];

export const calculateSubtotal = (cart: PopulatedCartItemData[]): number => {
    return cart.reduce((acc, item) => acc + item.variant.price.current * item.quantity, 0);
};

export const generateSkeletonCart = (
    length: number = 5,
): RecursivePartial<PopulatedCartItemData>[] => {
    return Array.from({
        length,
    }).map(() => ({
        product: generateSkeletonProduct(),
        variant: generateSkeletonProductVariant(),
        quantity: 1,
    }));
};
