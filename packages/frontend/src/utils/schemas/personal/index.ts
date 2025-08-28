import { z } from "zod";
import dayjs from "dayjs";
import parsePhoneNumberFromString from "libphonenumber-js";

export const email = z
    .string()
    .email("Invalid email format. Please use the following format: example@email.com");
export type Email = z.infer<typeof email>;

/*
 * Password requirement of 8+ characters in length in line with NIST guidelines
 * https://pages.nist.gov/800-63-3/sp800-63b.html
 */

export const password = z
    .string()
    .min(8, { message: "Please enter a password at least 8 characters in length" });
export type Password = z.infer<typeof password>;

export const name = z.string();
export type Name = z.infer<typeof name>;

export const phone = z.string().refine(
    (data) => {
        const parsedPhone = parsePhoneNumberFromString(data, "GB");
        return parsedPhone?.isValid() ?? false;
    },
    {
        message:
            "Invalid UK phone number, please write it in E.164 format (+44 7123 456789 or 07123 456789)",
    },
);
export type Phone = z.infer<typeof phone>;

/*
 * Minimum age requirement of 13 in line with UK GDPR & ICO guidance on minimum age for data consent
 * https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/children-and-the-uk-gdpr/what-are-the-rules-about-an-iss-and-consent
 */

export const dob = z
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
    .superRefine((data, ctx) => {
        const { day, month, year } = data;
        const hasDay = typeof day !== "undefined";
        const hasMonth = typeof month !== "undefined";
        const hasYear = typeof year !== "undefined";
        if (!((hasDay && hasMonth && hasYear) || (!hasDay && !hasMonth && !hasYear))) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Please define either all date fields, or none",
                path: ["root"],
            });
        }

        if (!hasDay && !hasMonth && !hasYear) return;

        const date = dayjs(`${year}-${month}-${day}`, "YYYY-M-D", true);
        if (!date.isValid()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Invalid date. Please enter a valid calendar date",
                path: ["root"],
            });
        }

        if (dayjs(date).isAfter(dayjs().subtract(13, "year"))) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "You must be at least 13 years old to make an account",
                path: ["root"],
            });
        }

        if (dayjs(date).isBefore(new Date("1875-01-01"))) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Date of birth must be after 1st January 1875",
                path: ["root"],
            });
        }
    });
export type DOB = z.infer<typeof dob>;
