import { z } from "zod";

export const category = z.object({
    name: z.string().min(2, "Category name is required"),
    image: z.string().url("Image must be a valid URL").optional(),
    parent: z.string().optional(),
    description: z.string().optional(),
});

export type CategoryType = z.infer<typeof category>;
