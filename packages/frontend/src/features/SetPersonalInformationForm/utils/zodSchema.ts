import { z } from "zod";
import dayjs from "dayjs";
import parsePhoneNumberFromString from "libphonenumber-js";

export type PersonalInformationFormData = {
    firstName?: string;
    lastName?: string;
    phone?: string;
    gender: "male" | "female" | "other" | "unspecified";
    dob?: {
        day?: number;
        month?: number;
        year?: number;
    };
    address?: {
        line1?: string;
        line2?: string;
        townCity?: string;
        county?: string;
        postcode?: string;
    };
};

/*
 * Minimum age requirement of 13 in line with UK GDPR & ICO guidance on minimum age for data consent
 * https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/children-and-the-uk-gdpr/what-are-the-rules-about-an-iss-and-consent
 */

export const personalInformationFormDataSchema: z.ZodType<PersonalInformationFormData> = z
    .object({
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        phone: z
            .string()
            .optional()
            .refine(
                (phone) => {
                    if (typeof phone === "undefined") return true;
                    const parsedPhone = parsePhoneNumberFromString(phone, "GB");
                    return parsedPhone?.isValid() ?? false;
                },
                {
                    message:
                        "Invalid UK phone number, please write it in E.164 format (+44 7123 456789 or 07123 456789)",
                },
            ),
        gender: z.enum(["male", "female", "other", "unspecified"], {
            message: "Please select an option",
        }),
        dob: z
            .object({
                day: z.coerce
                    .number()
                    .int({ message: "Please enter an integer value" })
                    .gte(1, { message: "Please enter a valid day" })
                    .lte(31, { message: "Please enter a valid day" })
                    .optional(),
                month: z.coerce
                    .number()
                    .int({ message: "Please enter an integer value" })
                    .gte(1, { message: "Please enter a valid month" })
                    .lte(12, { message: "Please enter a valid month" })
                    .optional(),
                year: z.coerce
                    .number()
                    .int({ message: "Please enter an integer value" })
                    .gte(1875, { message: "Date of birth must be after 1st January 1875" })
                    .lte(new Date().getFullYear(), { message: "Please enter a valid year" })
                    .optional(),
            })
            .optional(),
        address: z
            .object({
                line1: z.string().optional(),
                line2: z.string().optional(),
                townCity: z.string().optional(),
                county: z.string().optional(),
                postcode: z.string().optional(),
            })
            .optional(),
    })
    .superRefine((data, ctx) => {
        const { dob } = data;
        if (typeof dob === "undefined") return;

        const { day, month, year } = dob;
        const hasDay = typeof day !== "undefined";
        const hasMonth = typeof month !== "undefined";
        const hasYear = typeof year !== "undefined";
        if (!((hasDay && hasMonth && hasYear) || (!hasDay && !hasMonth && !hasYear))) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Please define either all date fields, or none",
                path: ["dob"],
            });
        }

        if (!hasDay && !hasMonth && !hasYear) return;

        const date = dayjs(`${dob.year}-${dob.month}-${dob.day}`, "YYYY-M-D", true);
        if (!date.isValid()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Invalid date. Please enter a valid calendar date",
                path: ["dob"],
            });
        }

        if (dayjs(date).isAfter(dayjs().subtract(13, "year"))) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "You must be at least 13 years old to make an account",
                path: ["dob"],
            });
        }

        if (dayjs(date).isBefore(new Date("1875-01-01"))) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Date of birth must be after 1st January 1875",
                path: ["dob"],
            });
        }
    });
