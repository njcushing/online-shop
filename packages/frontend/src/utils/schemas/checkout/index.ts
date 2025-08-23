/* v8 ignore start */

import { z } from "zod";
import { Profile } from "@/utils/schemas/profile";
import { name, email, phone } from "@/utils/schemas/personal";
import { DeepPick } from "ts-deep-pick";

export type CheckoutPersonalFormData = DeepPick<
    Profile,
    "personal.firstName" | "personal.lastName" | "personal.email" | "personal.phone"
>;

export type CheckoutFormData = {
    personal: CheckoutPersonalFormData;
};

export const checkoutPersonalFormDataSchema: z.ZodType<CheckoutPersonalFormData> = z.object({
    personal: z.object({
        firstName: name,
        lastName: name,
        email,
        phone: phone.optional(),
    }),
});
