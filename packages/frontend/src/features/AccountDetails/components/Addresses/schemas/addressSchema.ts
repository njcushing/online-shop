/* c8 ignore start */

import { z } from "zod";
import { Address, address } from "@/utils/schemas/address";

export type AddressFormData = {
    address?: Address;
};

export const addressFormDataSchema: z.ZodType<AddressFormData> = z.object({
    address,
});
