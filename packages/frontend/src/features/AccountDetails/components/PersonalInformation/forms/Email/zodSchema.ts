/* c8 ignore start */

import { z } from "zod";
import { Email, email } from "@/utils/schemas/user";

export type EmailFormData = {
    email?: Email;
};

export const emailFormDataSchema: z.ZodType<EmailFormData> = z.object({
    email,
});
