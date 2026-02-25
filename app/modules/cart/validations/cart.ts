import { z } from "zod";

export const addToCart = z.object({
    productId: z
        .string()
        .min(1, "Product ID is required"),
    quantity: z
        .number()
        .int()
    //   price: z
    //     .number()
    //     .min(1, "Price must be greater than 0")
});
export type AddToCartType = z.infer<typeof addToCart>;

