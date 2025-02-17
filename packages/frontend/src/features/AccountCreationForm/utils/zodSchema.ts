import { z } from "zod";

export const accountCreationFormDataSchema = z
    .object({
        firstName: z.string().min(1, { message: "Please enter your first name" }),
        lastName: z.string().min(1, { message: "Please enter your last name" }),
        email: z.string().email("Invalid email format"),
        password: z.string().min(1, { message: "Please enter your password" }),
        confirmPassword: z.string().min(1, { message: "Please confirm your password" }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });
