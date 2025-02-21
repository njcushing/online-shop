import { z } from "zod";

export type PersonalInformationFormData = {
    firstName?: string;
    lastName?: string;
};

export const personalInformationFormDataSchema: z.ZodType<PersonalInformationFormData> = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
});
