/* c8 ignore start */

import { z } from "zod";
import { Name, name, Email, email, Phone, phone, DOB, dob } from "@/utils/schemas/user";
import { Postcode, postcode } from "@/utils/schemas/address";
import { DeepRequired } from "react-hook-form";

export type AccountDetails = {
    personal?: {
        firstName?: Name;
        lastName?: Name;
        phone?: Phone;
        dob?: DOB;
        email?: Email;
        address?: {
            line1?: string;
            line2?: string;
            townCity?: string;
            county?: string;
            postcode?: Postcode;
        };
    };
};

export const accountDetailsSchema: z.ZodType<AccountDetails> = z.object({
    personal: z
        .object({
            firstName: name.optional(),
            lastName: name.optional(),
            phone: phone.optional(),
            dob: dob.optional(),
            email: email.optional(),
            address: z.object({
                line1: z.string().optional(),
                line2: z.string().optional(),
                townCity: z.string().optional(),
                county: z.string().optional(),
                postcode: postcode.optional(),
            }),
        })
        .optional(),
});

export const defaultAccountDetails: DeepRequired<AccountDetails> = {
    personal: {
        firstName: "John",
        lastName: "Smith",
        phone: "+440123456789",
        dob: {
            day: 1,
            month: 1,
            year: 1970,
        },
        email: "johnsmith@email.com",
        address: {
            line1: "0 Portland Place",
            line2: "",
            townCity: "Westminster",
            county: "Greater London",
            postcode: "W1A 1AA",
        },
    },
};
