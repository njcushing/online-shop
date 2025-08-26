/* v8 ignore start */

import { z } from "zod";
import { Profile } from "@/utils/schemas/profile";
import { address } from "@/utils/schemas/address";
import { name, email, phone } from "@/utils/schemas/personal";
import { DeepPick } from "ts-deep-pick";

export type CheckoutPersonalFormData = DeepPick<
    NonNullable<Profile["personal"]>,
    "firstName" | "lastName" | "email" | "phone"
>;

export const shippingOptions = ["standard", "express"] as const;
export type CheckoutShippingOption = (typeof shippingOptions)[number];

export type CheckoutShippingFormData = {
    address: {
        delivery: NonNullable<Profile["addresses"]>["delivery"];
        billing: NonNullable<Profile["addresses"]>["billing"];
    };
    type: CheckoutShippingOption;
};

export type CheckoutFormData = {
    personal: CheckoutPersonalFormData;
    shipping: CheckoutShippingFormData;
};

export const checkoutPersonalFormDataSchema: z.ZodType<CheckoutPersonalFormData> = z.object({
    firstName: name,
    lastName: name,
    email,
    phone: phone.optional(),
});

export const checkoutShippingFormDataSchema: z.ZodType<CheckoutShippingFormData> = z.object({
    address: z.object({
        delivery: address,
        billing: address,
    }),
    type: z.enum(shippingOptions),
});
