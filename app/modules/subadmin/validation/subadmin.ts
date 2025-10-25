import { z } from "zod";

export const subAdmin = z.object({
    fullName: z.string(),
    email: z.string().email("Please Enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters").optional(),
    phone: z.string().regex(/^[0-9]+$/).min(8).max(15),
    countryCode: z.string().regex(/^\+\d{1,3}$/).optional(),
    permission: z.string().regex(/^[0-9a-fA-F]{24}$/),
    profile: z.string().optional(),
});

export type SubAdminType = z.infer<typeof subAdmin>;

