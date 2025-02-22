import { z } from "zod";
import parsePhoneNumberFromString from "libphonenumber-js";

export type PersonalInformationFormData = {
    firstName?: string;
    lastName?: string;
    phone?: string;
    gender?: "male" | "female" | "other" | "unspecified";
};

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
});
