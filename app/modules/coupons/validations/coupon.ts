import { z } from "zod";
import { COUPON_TYPE } from "@app/config/constants"; // if exists

export const addCoupon = z.object({
    code: z.string().optional(),
    discountType: z.nativeEnum(COUPON_TYPE).optional(),
    discountValue: z.number().int().min(1),
    minOrderAmount: z.number().int().min(1),
    maxDiscount: z.number().int().min(1),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    validityDays:z.number().min(1).int().optional(),
    isActive: z.boolean().default(true).optional(),
});
export type addCouponType = z.infer<typeof addCoupon>;

export const updateCoupon = z.object({
    code: z.string().optional(),
    discountType: z.nativeEnum(COUPON_TYPE).optional(),
    discountValue: z.number().int().min(1).optional(),
    minOrderAmount: z.number().int().min(1).optional(),
    maxDiscount: z.number().int().min(1).optional(),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    validityDays:z.number().min(1).int().optional(),
    isActive: z.boolean().default(true).optional(),
});
export type updateCouponType = z.infer<typeof updateCoupon>;