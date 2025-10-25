import { z } from "zod";

export const subscriptionPlan = z.object({
    name: z.string().min(2, "Plan name is required"),
    mileageLimit: z.number().optional(),
    termLength: z.number().optional(),
    price: z.number().min(0, "Price must be at least 0"),
    description: z.string().optional(),
    isActive: z.boolean().optional(),
});

export type SubscriptionPlanType = z.infer<typeof subscriptionPlan>;
