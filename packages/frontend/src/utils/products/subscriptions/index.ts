import { ProductVariant, Product } from "@/utils/products/product";
import { defaultAccountDetails } from "@/utils/schemas/account";
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

export const mockSubscriptions: SubscriptionData[] = [
    {
        id: "1",
        userId: "1",
        subscriptionDate: new Date().toISOString(),
        deliveryAddress: defaultAccountDetails.addresses.delivery,
        billingAddress: defaultAccountDetails.addresses.billing,
        frequency: "one_week",

        productId: "1",
        variantId: "1-1",
    },
    {
        id: "2",
        userId: "1",
        subscriptionDate: new Date().toISOString(),
        deliveryAddress: defaultAccountDetails.addresses.delivery,
        billingAddress: defaultAccountDetails.addresses.billing,
        frequency: "two_weeks",

        productId: "1",
        variantId: "1-2",
    },
    {
        id: "3",
        userId: "1",
        subscriptionDate: new Date().toISOString(),
        deliveryAddress: defaultAccountDetails.addresses.delivery,
        billingAddress: defaultAccountDetails.addresses.billing,
        frequency: "one_month",

        productId: "1",
        variantId: "1-3",
    },
    {
        id: "4",
        userId: "1",
        subscriptionDate: new Date().toISOString(),
        deliveryAddress: defaultAccountDetails.addresses.delivery,
        billingAddress: defaultAccountDetails.addresses.billing,
        frequency: "three_months",

        productId: "2",
        variantId: "2-1",
    },
    {
        id: "5",
        userId: "1",
        subscriptionDate: new Date().toISOString(),
        deliveryAddress: defaultAccountDetails.addresses.delivery,
        billingAddress: defaultAccountDetails.addresses.billing,
        frequency: "six_months",

        productId: "2",
        variantId: "2-2",
    },
    {
        id: "6",
        userId: "1",
        subscriptionDate: new Date().toISOString(),
        deliveryAddress: defaultAccountDetails.addresses.delivery,
        billingAddress: defaultAccountDetails.addresses.billing,
        frequency: "one_year",

        productId: "3",
        variantId: "3-2",
    },
];
