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

export type Postcode = string;
export const postcode: z.ZodType<Postcode> = z
    .string()
    .regex(UKPostcodeRegex, { message: "Invalid UK postcode" });
