import {z} from "zod";

export const addCategory = z.object({
    categoryName:z.string(),
    image:z.string().optional(),
    parentCategoryId:z.string().optional()
})
export type addCategory = z.infer<typeof addCategory>

export const updateCategory = z.object({
    categoryName:z.string().optional(),
    image:z.string().optional().optional(),
    parentCategoryId:z.string().optional()
})

export type updateCategory = z.infer<typeof updateCategory>