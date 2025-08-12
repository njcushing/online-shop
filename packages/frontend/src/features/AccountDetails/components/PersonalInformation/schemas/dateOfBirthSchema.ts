/* v8 ignore start */

import { z } from "zod";
import { dob } from "@/utils/schemas/personal";
import { AccountDetails } from "@/utils/schemas/account";
import { DeepPick } from "ts-deep-pick";

export type DateOfBirthFormData = DeepPick<AccountDetails, "personal.dob">;

export const dateOfBirthFormDataSchema: z.ZodType<DateOfBirthFormData> = z.object({
    personal: z.object({
        dob,
    }),
});
