import { z } from "zod";

/*
 * Official GOV.UK regex for UK postcodes
 * https://assets.publishing.service.gov.uk/media/5a7f3ff4ed915d74e33f5438/Bulk_Data_Transfer_-_additional_validation_valid_from_12_November_2015.pdf
 *
 * Note: The regex is adjusted slightly from the one in the above link; I have removed the necessity
 * for the space between the two parts of UK postcodes.
 */

export const UKPostcodeRegex =
    /^([Gg][Ii][Rr]0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z]))))\s?[0-9][A-Za-z]{2})$/;

export const postcode = z.string().regex(UKPostcodeRegex, { message: "Enter a valid UK postcode" });
export type Postcode = z.infer<typeof postcode>;

const optionalString = z
    .string()
    .trim()
    .transform((s) => (s === "" ? undefined : s))
    .optional();

export const address = z.object({
    line1: z.string().trim().min(1, {
        message: "Please enter address line 1, usually the building and street",
    }),
    line2: optionalString,
    townCity: z.string().trim().min(1, { message: "Please enter the town or city" }),
    county: optionalString,
    postcode,
});
export type Address = z.infer<typeof address>;
