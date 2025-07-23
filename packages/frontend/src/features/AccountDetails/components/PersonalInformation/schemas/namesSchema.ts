/* v8 ignore start */

import { z } from "zod";
import { AccountDetails } from "@/utils/schemas/account";
import { name } from "@/utils/schemas/user";
import { DeepPick } from "ts-deep-pick";

export type NamesFormData = DeepPick<AccountDetails, "personal.firstName" | "personal.lastName">;

export const namesFormDataSchema: z.ZodType<NamesFormData> = z.object({
    personal: z.object({
        firstName: name,
        lastName: name,
    }),
});
