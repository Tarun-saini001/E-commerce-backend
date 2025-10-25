import { z } from "zod";
import { DAYS_NAME } from "@app/config/constants";

export const dealershipValidation = z.object({
    image: z.string().optional(),
    name: z.string({ error: "Name is required" }),
    phone: z.string().optional(),
    business_phone: z.string().optional(),
    email: z.string().email("Invalid email").optional(),

    location: z.object({
        type: z.enum(["Point", "Polygon"]),
        coordinates: z
            .array(z.number())
            .length(2, "Coordinates must be [longitude, latitude]")
            .nonempty("Coordinates are required"),
    }),

    address: z.string().optional(),

    workingHours: z
        .array(
            z.object({
                day: z
                    .number()
                    .refine((val) => Object.values(DAYS_NAME).includes(val), {
                        message: "Invalid day value",
                    }),
                open: z.date().optional(),
                close: z.date().optional(),
                isClosed: z.boolean().default(false),
            })
        )
        .optional(),

    inventory: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid vehicleId")).optional(),
    isDeleted: z.boolean().default(false),
});

export type DealershipType = z.infer<typeof dealershipValidation>;
