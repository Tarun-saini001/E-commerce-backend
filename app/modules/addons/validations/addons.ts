import { z } from "zod";

export const addon = z.object({
    name: z.string().min(2, "Add-On name is required"),
    description: z.string().optional(),
    costToDealer: z.number().min(0, "Cost cannot be negative"),
    sellingPrice: z.number().min(0, "Selling price cannot be negative"),
    termLength: z.number().min(0, "Term length cannot be negative"),
    isActive: z.boolean().optional(),
});

export type AddonType = z.infer<typeof addon>;
