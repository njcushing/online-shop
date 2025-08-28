/* v8 ignore start */

import { z } from "zod";
import { name, email, phone, dob } from "@/utils/schemas/personal";
import { address } from "@/utils/schemas/address";
import { DeepRequired } from "react-hook-form";

export const profileSchema = z.object({
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
export type Profile = z.infer<typeof profileSchema>;

export const defaultProfile: DeepRequired<Profile> = {
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
