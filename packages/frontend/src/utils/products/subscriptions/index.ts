import { ProductVariant, Product } from "@/utils/products/product";
import { Address } from "@/utils/schemas/address";

const frequencies = [
    "one_week",
    "two_weeks",
    "one_month",
    "three_months",
    "six_months",
    "one_year",
] as const;
export type SubscriptionFrequency = (typeof frequencies)[number];

export type SubscriptionDataBase = {
    id: string;
    userId: string;
    subscriptionDate: string;
    deliveryAddress: Address;
    billingAddress: Address;
    frequency: SubscriptionFrequency;
};

export type SubscriptionData = SubscriptionDataBase & {
    productId: Product["id"];
    variantId: Product["variants"][number]["id"];
};

export type PopulatedSubscriptionData = SubscriptionDataBase & {
    product: Product;
    variant: ProductVariant;
};
