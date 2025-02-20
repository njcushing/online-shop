import { z } from "zod";

export type AccountCreationFormData = {
    email: string;
    password: string;
    confirmPassword: string;
};

/*
 * Password requirement of 8+ characters in length in line with NIST guidelines
 * https://pages.nist.gov/800-63-3/sp800-63b.html
 */

export const accountCreationFormDataSchema: z.ZodType<AccountCreationFormData> = z
    .object({
        email: z
            .string()
            .email("Invalid email format. Please use the following format: example@email.com"),
        password: z
            .string()
            .min(8, { message: "Please enter a password at least 8 characters in length" }),
        confirmPassword: z
            .string()
            .min(8, { message: "Please enter a password at least 8 characters in length" }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });
