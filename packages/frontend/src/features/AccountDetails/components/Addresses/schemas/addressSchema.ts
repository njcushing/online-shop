/* v8 ignore start */

import { z } from "zod";
import { Profile } from "@/utils/schemas/profile";
import { address } from "@/utils/schemas/address";
import { DeepPick } from "ts-deep-pick";

export type AddressesFormData = DeepPick<Profile, "addresses">;

export const addressesFormDataSchema: z.ZodType<AddressesFormData> = z.object({
    addresses: z.object({
        delivery: address,
        billing: address,
    }),
});
