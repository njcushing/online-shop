/* c8 ignore start */

import { z } from "zod";
import { AccountDetails } from "@/utils/schemas/account";
import { phone } from "@/utils/schemas/user";
import { DeepPick } from "ts-deep-pick";

export type PhoneNumberFormData = DeepPick<AccountDetails, "personal.phone">;

export const phoneNumberFormDataSchema: z.ZodType<PhoneNumberFormData> = z.object({
    personal: z.object({
        phone,
    }),
});
