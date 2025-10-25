import { z } from "zod";
import { COMMON_STATUS, SELLING_IN } from "@app/config/constants";

export const appointment = z.object({
    userId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid userId"),
    vin: z.string().optional(),
    plateNumber: z.string().optional(),
    currentMiles: z.number().optional(),
    images: z.array(z.string()).optional(),
    sellingIn: z.enum(SELLING_IN).optional(),
    make: z.string().min(1, "Make is required"),
    model: z.string().min(1, "Model is required"),
    year: z.number().optional(),
    brand: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
    price: z.number().min(0, "Price must be at least 0"),
    offerAccepted: z.boolean().optional(),
    evaluationLocation: z.object({
        type: z.literal("Point"),
        coordinates: z.array(z.number()).length(2),
    }),
    Date: z.string().optional(),
    bookingId: z.string().optional(),
    status: z.enum(COMMON_STATUS).optional(),
});

export type AppointmentType = z.infer<typeof appointment>;
