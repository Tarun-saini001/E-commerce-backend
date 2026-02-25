import { z } from "zod";

export const addProduct = z.object({
    brandId: z.string(),
    categoryId: z.string(),
    name: z.string(),
    color: z.string().optional(),
    price: z.number(),
    discount: z.string().optional(),
    size: z.string().optional(),
    stock: z.number().int().min(1),
    bundle: z.object({
        isBundle: z.boolean().default(false),
        requiredQty: z.number().int().min(0).default(0),
        price: z.number().min(0).default(0),
        offerTitle: z.string().default("")
    }).optional()
})
export type addProduct = z.infer<typeof addProduct>

export const updateProduct = z.object({
    brandId: z.string().optional(),
    name: z.string().optional(),
    color: z.string().optional(),
    price: z.number().optional(),
    discount: z.number().optional(),
    size: z.string().optional(),
    stock: z.number().optional()
})


export type updateProduct = z.infer<typeof updateProduct>


export const updateBundleOfferValidation = z.object({
  productId: z.string(),
  isBundle: z.boolean(),
  requiredQty: z.number().int().min(1).default(1),
  price: z.number().int().min(0).default(0),
  offerTitle: z.string().default("")
});
export type updateBundleOfferValidation = z.infer<typeof updateBundleOfferValidation>
