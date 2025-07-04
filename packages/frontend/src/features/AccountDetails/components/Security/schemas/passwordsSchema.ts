/* c8 ignore start */

import { z } from "zod";
import { Password, password } from "@/utils/schemas/user";

export type PasswordsFormData = {
    newPassword: Password;
    confirmNewPassword: Password;
};

export const passwordsFormDataSchema: z.ZodType<PasswordsFormData> = z
    .object({
        newPassword: password,
        confirmNewPassword: password,
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
        message: "Passwords do not match",
        path: ["root"],
    });
