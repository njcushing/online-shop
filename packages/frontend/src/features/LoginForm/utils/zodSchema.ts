/* c8 ignore start */

import { z } from "zod";

export type LoginFormData = {
    email: string;
    password: string;
};

export const loginFormDataSchema: z.ZodType<LoginFormData> = z.object({
    email: z.string({ message: "Please enter your email address" }),
    password: z.string({ message: "Please enter your password" }),
});
