/* v8 ignore start */

import { z } from "zod";
import { Profile } from "@/utils/schemas/profile";
import { name } from "@/utils/schemas/personal";
import { DeepPick } from "ts-deep-pick";

export type NamesFormData = DeepPick<Profile, "personal.firstName" | "personal.lastName">;

export const namesFormDataSchema: z.ZodType<NamesFormData> = z.object({
    personal: z.object({
        firstName: name,
        lastName: name,
    }),
});
