import {z} from "zod";

export const addBrand = z.object({
    caterogyId:z.string(),
    name:z.string(),
})
export type addBrand = z.infer<typeof addBrand>

export const updateBrand = z.object({
    caterogyId:z.string().optional(),
    name:z.string().optional(),
})

export type updateBrand = z.infer<typeof updateBrand>