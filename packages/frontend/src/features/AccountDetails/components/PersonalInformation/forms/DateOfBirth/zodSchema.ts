/* c8 ignore start */

import { z } from "zod";
import { DOB, dob } from "@/utils/schemas/user";

export type DateOfBirthFormData = {
    dob?: DOB;
};

export const dateOfBirthFormDataSchema: z.ZodType<DateOfBirthFormData> = z.object({
    dob,
});
