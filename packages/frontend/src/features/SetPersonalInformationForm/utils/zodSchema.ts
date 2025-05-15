import { z } from "zod";
import { Name, name, Phone, phone, DOB, dob } from "@/utils/schemas/user";
import { Postcode, postcode } from "@/utils/schemas/address";

export type PersonalInformationFormData = {
    firstName?: Name;
    lastName?: Name;
    phone?: Phone;
    dob?: DOB;
    address?: {
        line1?: string;
        line2?: string;
        townCity?: string;
        county?: string;
        postcode?: Postcode;
    };
};

export const personalInformationFormDataSchema: z.ZodType<PersonalInformationFormData> = z.object({
    firstName: name.optional(),
    lastName: name.optional(),
    phone: phone.optional(),
    dob: dob.optional(),
    address: z.object({
        line1: z.string().optional(),
        line2: z.string().optional(),
        townCity: z.string().optional(),
        county: z.string().optional(),
        postcode: postcode.optional(),
    }),
});
