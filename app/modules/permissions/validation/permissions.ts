import { z } from "zod";
import { RESOURCES } from "@app/config/constants";

export const PermissionItemSchema = z.object({
    sideBarId: z.nativeEnum(RESOURCES).optional(),
    label: z.string().optional(),
    isView: z.boolean().default(false),
    isAdd: z.boolean().default(false),
    isEdit: z.boolean().default(false),
    isDelete: z.boolean().default(false),
});

export const PermissionSchema = z.object({
    name: z.string().optional(),
    permission: z.array(PermissionItemSchema),
});

export type PermissionInput = z.infer<typeof PermissionSchema>;
export type PermissionItemInput = z.infer<typeof PermissionItemSchema>;
