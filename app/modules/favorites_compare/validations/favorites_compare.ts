import { SAVE_TYPE } from "@app/config/constants";
import { z } from "zod";

export const favorite = z.object({
    userId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid userId"),
    vehicleId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid vehicleId"),
    type: z.nativeEnum(SAVE_TYPE)
});

export type FavoriteType = z.infer<typeof favorite>;
