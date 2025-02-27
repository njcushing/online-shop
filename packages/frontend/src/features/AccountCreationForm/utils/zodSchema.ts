import { z } from "zod";
import { Email, email, Password, password } from "@/utils/schemas/user";

export type AccountCreationFormData = {
    email: Email;
    password: Password;
    confirmPassword: Password;
};

/*
 * Password requirement of 8+ characters in length in line with NIST guidelines
 * https://pages.nist.gov/800-63-3/sp800-63b.html
 */

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
