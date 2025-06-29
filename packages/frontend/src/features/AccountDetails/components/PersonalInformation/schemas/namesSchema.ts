/* c8 ignore start */

import { z } from "zod";
import { Name, name } from "@/utils/schemas/user";

export type NamesFormData = {
    firstName?: Name;
    lastName?: Name;
};

export const namesFormDataSchema: z.ZodType<NamesFormData> = z.object({
    firstName: name,
    lastName: name,
});
