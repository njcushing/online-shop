import {
    ProductVariant,
    Product,
    generateSkeletonProduct,
    generateSkeletonProductVariant,
} from "@/utils/products/product";
import { RecursivePartial } from "@/utils/types";
import { SubscriptionFrequency } from "../subscriptions";

export type CartItemDataBase = {
    quantity: number;
    info?: {
        subscription?: { frequency: SubscriptionFrequency };
    };
};

export type CartItemData = CartItemDataBase & {
    productId: Product["id"];
    variantId: Product["variants"][number]["id"];
};

export type CartPromotion = {
    code: string;
    description: string;
    threshold: number;
    discount: {
        value: number;
        type: "additive" | "multiplicative";
    };
};

export type PopulatedCartItemData = CartItemDataBase & {
    product: Product;
    variant: ProductVariant;
};

export type CartBase<T> = {
    items: T[];
    promotions: CartPromotion[];
};

export type Cart = CartBase<CartItemData>;

export type PopulatedCart = CartBase<PopulatedCartItemData>;

export const mockCart: Cart = {
    items: [
        { productId: "1", variantId: "1-1", quantity: 10 },
        { productId: "1", variantId: "1-2", quantity: 5 },
        {
            productId: "2",
            variantId: "2-2",
            quantity: 15,
            info: { subscription: { frequency: "one_month" } },
        },
        { productId: "3", variantId: "3-1", quantity: 6 },
        {
            productId: "3",
            variantId: "3-3",
            quantity: 18,
            info: { subscription: { frequency: "one_week" } },
        },
    ],
    promotions: [],
};

export const generateSkeletonCart = (length: number = 5): RecursivePartial<PopulatedCart> => {
    return {
        items: Array.from({
            length,
        }).map(() => ({
            product: generateSkeletonProduct(),
            variant: generateSkeletonProductVariant(),
            quantity: 1,
        })),
        promotions: [],
    };
};
