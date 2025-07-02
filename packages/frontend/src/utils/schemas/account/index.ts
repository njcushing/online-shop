/* c8 ignore start */

import { z } from "zod";
import { Name, name, Email, email, Phone, phone, DOB, dob } from "@/utils/schemas/user";
import { Address, address } from "@/utils/schemas/address";
import { DeepRequired } from "react-hook-form";

export type AccountDetails = {
    personal?: {
        firstName?: Name;
        lastName?: Name;
        phone?: Phone;
        dob?: DOB;
        email?: Email;
    };
    addresses?: {
        delivery?: Address;
        billing?: Address;
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
        })
        .optional(),
    addresses: z
        .object({
            delivery: address.optional(),
            billing: address.optional(),
        })
        .optional(),
});

export const defaultAccountDetails: DeepRequired<AccountDetails> = {
    personal: {
        firstName: "John",
        lastName: "Smith",
        phone: "+447123456789",
        dob: {
            day: 1,
            month: 1,
            year: 1970,
        },
        email: "johnsmith@email.com",
    },
    addresses: {
        delivery: {
            line1: "0 Portland Place",
            line2: "Apartment 101a",
            townCity: "Westminster",
            county: "Greater London",
            postcode: "W1A 1AA",
        },
        billing: {
            line1: "0 Portland Place",
            line2: "Apartment 101a",
            townCity: "Westminster",
            county: "Greater London",
            postcode: "W1A 1AA",
        },
    },
};
