/* c8 ignore start */

import { z } from "zod";
import { Phone, phone } from "@/utils/schemas/user";

export type PhoneNumberFormData = {
    phone?: Phone;
};

export const phoneNumberFormDataSchema: z.ZodType<PhoneNumberFormData> = z.object({
    phone,
});
