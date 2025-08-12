/* v8 ignore start */

import { z } from "zod";
import { AccountDetails } from "@/utils/schemas/account";
import { email } from "@/utils/schemas/personal";
import { DeepPick } from "ts-deep-pick";

export type EmailFormData = DeepPick<AccountDetails, "personal.email">;

export const emailFormDataSchema: z.ZodType<EmailFormData> = z.object({
    personal: z.object({
        email,
    }),
});
