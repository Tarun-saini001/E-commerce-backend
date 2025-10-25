import { z } from "zod";

export const brand = z.object({
    name: z.string().min(2, "Brand name is required"),
    logo: z.string().url("Logo must be a valid URL").optional(),
    description: z.string().optional(),
});

export type BrandType = z.infer<typeof brand>;
