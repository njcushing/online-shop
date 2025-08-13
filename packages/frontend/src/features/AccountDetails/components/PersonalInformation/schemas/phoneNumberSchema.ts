/* v8 ignore start */

import { z } from "zod";
import { Profile } from "@/utils/schemas/profile";
import { phone } from "@/utils/schemas/personal";
import { DeepPick } from "ts-deep-pick";

export type PhoneNumberFormData = DeepPick<Profile, "personal.phone">;

export const phoneNumberFormDataSchema: z.ZodType<PhoneNumberFormData> = z.object({
    personal: z.object({
        phone,
    }),
});
