import {
    ProductVariant,
    Product,
    generateSkeletonProduct,
    generateSkeletonProductVariant,
} from "@/utils/products/product";
import { defaultProfile } from "@/utils/schemas/profile";
import { Address } from "@/utils/schemas/address";
import { RecursivePartial } from "@/utils/types";

export const frequencies = {
    one_week: { text: "one week", optionName: "Weekly" },
    two_weeks: { text: "two weeks", optionName: "Every two weeks" },
    one_month: { text: "one month", optionName: "Monthly" },
    three_months: { text: "three months", optionName: "Every three months" },
    six_months: { text: "six months", optionName: "Every six months" },
    one_year: { text: "one year", optionName: "Yearly" },
} as const;
export type SubscriptionFrequency = keyof typeof frequencies;

export type SubscriptionDataBase = {
    id: string;
    userId: string;
    subscriptionDate: string;
    deliveryAddress: Address;
    billingAddress: Address;
    count: number;
    frequency: SubscriptionFrequency;
    nextDate: string;
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
        deliveryAddress: defaultProfile.addresses.delivery,
        billingAddress: defaultProfile.addresses.billing,
        count: 8,
        frequency: "one_week",
        nextDate: new Date(new Date().getTime() + 6.048e8).toISOString(),

        productId: "1",
        variantId: "1-1",
    },
    {
        id: "2",
        userId: "1",
        subscriptionDate: new Date().toISOString(),
        deliveryAddress: defaultProfile.addresses.delivery,
        billingAddress: defaultProfile.addresses.billing,
        count: 6,
        frequency: "two_weeks",
        nextDate: new Date(new Date().getTime() + 1.21e9).toISOString(),

        productId: "1",
        variantId: "1-2",
    },
    {
        id: "3",
        userId: "1",
        subscriptionDate: new Date().toISOString(),
        deliveryAddress: defaultProfile.addresses.delivery,
        billingAddress: defaultProfile.addresses.billing,
        count: 12,
        frequency: "one_month",
        nextDate: new Date(new Date().getTime() + 2.628e9).toISOString(),

        productId: "1",
        variantId: "1-3",
    },
    {
        id: "4",
        userId: "1",
        subscriptionDate: new Date().toISOString(),
        deliveryAddress: defaultProfile.addresses.delivery,
        billingAddress: defaultProfile.addresses.billing,
        count: 2,
        frequency: "three_months",
        nextDate: new Date(new Date().getTime() + 7.884e9).toISOString(),

        productId: "2",
        variantId: "2-1",
    },
    {
        id: "5",
        userId: "1",
        subscriptionDate: new Date().toISOString(),
        deliveryAddress: defaultProfile.addresses.delivery,
        billingAddress: defaultProfile.addresses.billing,
        count: 3,
        frequency: "six_months",
        nextDate: new Date(new Date().getTime() + 1.577e10).toISOString(),

        productId: "2",
        variantId: "2-2",
    },
    {
        id: "6",
        userId: "1",
        subscriptionDate: new Date().toISOString(),
        deliveryAddress: defaultProfile.addresses.delivery,
        billingAddress: defaultProfile.addresses.billing,
        count: 9,
        frequency: "one_year",
        nextDate: new Date(new Date().getTime() + 3.156e10).toISOString(),

        productId: "3",
        variantId: "3-2",
    },
];

export const generateSkeletonSubscriptionList = (
    length: number = 5,
): RecursivePartial<PopulatedSubscriptionData>[] => {
    return Array.from({
        length,
    }).map((v, i) => ({
        id: `${i + 1}`,
        userId: "1",
        subscriptionDateDate: new Date().toISOString(),
        deliveryAddress: defaultProfile.addresses.delivery,
        billingAddress: defaultProfile.addresses.billing,
        count: Math.ceil(Math.random() * 10),
        frequency: Object.keys(frequencies)[0] as keyof typeof frequencies,
        nextDate: new Date().toISOString(),

        product: generateSkeletonProduct(),
        variant: generateSkeletonProductVariant(),
    }));
};
