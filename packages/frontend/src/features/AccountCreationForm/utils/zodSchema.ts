/* c8 ignore start */

import { z } from "zod";
import { Email, email, Password, password } from "@/utils/schemas/user";

export type AccountCreationFormData = {
    email: Email;
    password: Password;
    confirmPassword: Password;
};

export const accountCreationFormDataSchema: z.ZodType<AccountCreationFormData> = z
    .object({
        email,
        password,
        confirmPassword: password,
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });
