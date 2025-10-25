import { VEHICLE_AVAILABILITY, VEHICLE_STATUS } from "@app/config/constants";
import { z } from "zod";

export const vehicle = z.object({
    name: z.string().min(1, "Name is required"),
    vin: z.string().min(3, "VIN is required"),
    make: z.string().min(1, "Make is required"),
    model: z.string().min(1, "Model is required"),
    year: z.number().int().min(1900).max(new Date().getFullYear()).optional(),
    category: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid category ID").optional(),
    subCategory: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid subcategory ID").optional(),
    brand: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid brand ID").optional(),
    price: z.number().positive("Price must be greater than 0"),
    isFeatured: z.boolean().optional(),
    wheels: z.number().int().optional(),
    cylinders: z.number().int().optional(),
    fuelType: z.string().optional(),
    milage: z.number().optional(),
    seats: z.number().optional(),
    doors: z.number().optional(),
    transmission: z.string().optional(),
    power: z.number().optional(),
    engineCapacity: z.number().optional(),
    color: z.string().optional(),

    location: z.object({
        type: z.literal("Point"),
        coordinates: z
            .array(z.number())
            .length(2, "Coordinates must have [longitude, latitude]")
    }),

    dealershipId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid dealership ID").optional(),
    images: z.array(z.string().url()).optional(),
    video: z.string().url().optional(),

    damageMap: z
        .array(
            z.object({
                area: z.string().optional(),
                description: z.string().optional(),
                image: z.string().url().optional(),
            })
        )
        .optional(),

    availablity: z.enum(VEHICLE_AVAILABILITY).optional(),
    status: z.enum(VEHICLE_STATUS).optional(),
    tags: z.array(z.string()).optional(),
    description: z.string().optional(),
    subscription: z
        .object({
            milagePerDay: z.number().optional(),
            pricePerDay: z.number().optional(),
        })
        .optional(),
});

export type VehicleType = z.infer<typeof vehicle>;
