import { z } from "zod";
import dayjs from "dayjs";
import parsePhoneNumberFromString from "libphonenumber-js";

export type PersonalInformationFormData = {
    firstName?: string;
    lastName?: string;
    phone?: string;
    gender?: "male" | "female" | "other" | "unspecified";
    dob?: Date;
};

/*
 * Minimum age requirement of 13 in line with UK GDPR & ICO guidance on minimum age for data consent
 * https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/children-and-the-uk-gdpr/what-are-the-rules-about-an-iss-and-consent
 */

export const personalInformationFormDataSchema: z.ZodType<PersonalInformationFormData> = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phone: z
        .string()
        .refine(
            (phone) => {
                const parsedPhone = parsePhoneNumberFromString(phone, "GB");
                return parsedPhone?.isValid() ?? false;
            },
            {
                message:
                    "Invalid UK phone number, please write it in E.164 format (+44 7123 456789 or 07123 456789)",
            },
        )
        .optional(),
    gender: z.enum(["male", "female", "other", "unspecified"], {
        message: "Please select an option",
    }),
    dob: z.coerce
        .date()
        .refine((dob) => dayjs(dob).isBefore(dayjs().subtract(13, "year")), {
            message: "You must be at least 13 years old to make an account",
        })
        .optional(),
});
