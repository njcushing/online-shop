/* v8 ignore start */

import { z } from "zod";
import { dob } from "@/utils/schemas/personal";
import { Profile } from "@/utils/schemas/profile";
import { DeepPick } from "ts-deep-pick";

export type DateOfBirthFormData = DeepPick<Profile, "personal.dob">;

export const dateOfBirthFormDataSchema: z.ZodType<DateOfBirthFormData> = z.object({
    personal: z.object({
        dob,
    }),
});
