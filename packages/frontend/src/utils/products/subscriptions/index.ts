import { ResponseBody as GetProductBySlugResponseDto } from "@/api/product/[slug]/GET";
import { mockProducts } from "@/utils/products/product";
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
    product: GetProductBySlugResponseDto;
    variant: GetProductBySlugResponseDto["variants"][number];
};

export const generateSkeletonSubscriptionList = (
    length: number = 5,
): RecursivePartial<SubscriptionData>[] => {
    return Array.from({
        length,
    }).map((v, i) => {
        const pickProduct = mockProducts[Math.floor(Math.random() * mockProducts.length)];
        const pickVariant =
            pickProduct.variants[Math.floor(Math.random() * pickProduct.variants.length)];

        return {
            id: `${i + 1}`,
            userId: "1",
            subscriptionDateDate: new Date().toISOString(),
            deliveryAddress: defaultProfile.addresses.delivery,
            billingAddress: defaultProfile.addresses.billing,
            count: Math.ceil(Math.random() * 10),
            frequency: Object.keys(frequencies)[0] as keyof typeof frequencies,
            nextDate: new Date().toISOString(),

            product: pickProduct,
            variant: pickVariant,
        };
    });
};
