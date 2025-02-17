import { z } from "zod";

export const accountCreationFormDataSchema = z
    .object({
        personal: z.object({
            firstName: z.string().min(1, { message: "Please enter your name" }),
            lastName: z.string().min(1, { message: "Please enter your name" }),
            email: z.string().email("Invalid email format"),
            phone: z.string().min(1, { message: "Please enter your phone number" }),
            dob: z.string().min(1, { message: "Please enter your date of birth" }),
        }),
        password: z.string().min(1, { message: "Please enter your password" }),
        confirmPassword: z.string().min(1, { message: "Please confirm your password" }),
        address: z.object({
            line1: z.string().min(1, { message: "Please enter the first line of your address" }),
            line2: z.string().optional(),
            city: z.string().min(1, { message: "Please enter your city" }),
            state: z.string().min(1, { message: "Please enter your state" }),
            zipCode: z.string().min(1, { message: "Please enter your zip code" }),
            country: z.string().min(1, { message: "Please select your country" }),
        }),
        newsletterSignUp: z.boolean().optional(),
        termsAgreement: z
            .boolean()
            .refine((value) => value, { message: "You must accept the terms and conditions" }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });
