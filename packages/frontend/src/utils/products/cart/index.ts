import { ResponseBody as GetProductBySlugResponseDto } from "@/api/products/[slug]/GET";
import { mockProducts } from "@/utils/products/product";
import { RecursivePartial } from "@/utils/types";
import { SubscriptionFrequency } from "../subscriptions";

export type CartItemDataBase = {
    quantity: number;
    info?: {
        subscription?: { frequency: SubscriptionFrequency };
    };
};

export type CartPromotion = {
    code: string;
    description: string;
    threshold: number;
    discount: {
        value: number;
        type: "fixed" | "percentage";
    };
};

export type CartItemData = CartItemDataBase & {
    product: GetProductBySlugResponseDto;
    variant: GetProductBySlugResponseDto["variants"][number];
};

export type CartBase<T> = {
    items: T[];
    promotions: CartPromotion[];
};

export type Cart = CartBase<CartItemData>;

export const generateSkeletonCart = (length: number = 5): RecursivePartial<Cart> => {
    return {
        items: Array.from({
            length,
        }).map(() => {
            const pickProduct = mockProducts[Math.floor(Math.random() * mockProducts.length)];
            const pickVariant =
                pickProduct.variants[Math.floor(Math.random() * pickProduct.variants.length)];

            return {
                product: pickProduct,
                variant: pickVariant,
                quantity: 1,
            };
        }),
        promotions: [
            {
                code: "SUMMER",
                description: "Summer sale: 10% off orders over £50!",
                threshold: 5000,
                discount: { value: 10, type: "percentage" },
            },
            {
                code: "SPEND100",
                description: "Spend £100 and get £10 off your order!",
                threshold: 10000,
                discount: { value: 1000, type: "fixed" },
            },
        ],
    };
};
