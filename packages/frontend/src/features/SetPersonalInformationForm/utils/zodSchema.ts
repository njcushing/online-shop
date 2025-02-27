import { z } from "zod";
import {
    Name,
    name,
    Phone,
    phone,
    Gender,
    gender,
    DOB,
    dob,
    Address,
    address,
} from "@/utils/schemas/user";

export type PersonalInformationFormData = {
    firstName?: Name;
    lastName?: Name;
    phone?: Phone;
    gender: Gender;
    dob?: DOB;
    address?: Address;
};

export const personalInformationFormDataSchema: z.ZodType<PersonalInformationFormData> = z.object({
    firstName: name.optional(),
    lastName: name.optional(),
    phone: phone.optional(),
    gender,
    dob: dob.optional(),
    address: address.optional(),
});
