/* v8 ignore start */

import { z } from "zod";
import { address } from "@/utils/schemas/address";
import { name, email, phone } from "@/utils/schemas/personal";

export const shippingOptions = ["standard", "express"] as const;
export type CheckoutShippingOption = (typeof shippingOptions)[number];

export const checkoutPersonalFormDataSchema = z.object({
    firstName: name.min(1, { message: "Please enter your first name" }),
    lastName: name.min(1, { message: "Please enter your surname" }),
    email,
    phone: phone.optional(),
});

export const checkoutShippingFormDataSchema = z.object({
    address: z.object({
        delivery: address,
        billing: address,
    }),
    type: z.enum(shippingOptions),
});

export const checkoutFormDataSchema = z.object({
    personal: checkoutPersonalFormDataSchema,
    shipping: checkoutShippingFormDataSchema,
});

export type CheckoutPersonalFormData = z.infer<typeof checkoutPersonalFormDataSchema>;
export type CheckoutShippingFormData = z.infer<typeof checkoutShippingFormDataSchema>;
export type CheckoutFormData = z.infer<typeof checkoutFormDataSchema>;
