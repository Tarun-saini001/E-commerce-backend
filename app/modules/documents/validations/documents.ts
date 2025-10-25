import { z } from "zod";
import mongoose from "mongoose";
import { DELIVERY_TYPE, FINANCE_TYPE } from "@app/config/constants";

export const documentSchema = z.object({
    userId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: "Invalid userId",
    }),

    name: z.string({ error: "Name is required" }),

    email: z.string().email().optional(),
    phone: z.string().optional(),
    licenseNo: z.string().optional(),
    licenseImg: z.string().optional(),
    selfie: z.string().optional(),

    location: z.object({
        type: z.enum(["Point", "Polygon"], { error: "Location type is required" }),
        coordinates: z
            .array(z.number(), { error: "Coordinates are required" })
            .length(2, "Coordinates must be [longitude, latitude]"),
    }),

    address: z
        .object({
            line1: z.string().optional(),
            line2: z.string().optional(),
            city: z.string().optional(),
            state: z.string().optional(),
            zip: z.string().optional(),
            country: z.string().optional(),
        })
        .optional(),

    tagId: z.string().optional(),
    tagRegNo: z.string().optional(),
    taxRegImg: z.string().optional(),
    taxId: z.string().optional(),
    vin: z.string().optional(),
    currMilage: z.string().optional(),

    vehicleImgs: z.array(z.string()).optional(),

    addOns: z
        .array(
            z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
                message: "Invalid AddOn ObjectId",
            })
        )
        .optional(),

    financeType: z
        .nativeEnum(FINANCE_TYPE)
        .optional()
        .or(z.number().optional()),

    downPayment: z.number().optional(),
    loanDuration: z.number().optional(),
    loanROI: z.number().optional(),
    monthlyPayment: z.number().optional(),

    employerName: z.string().optional(),
    employmentDuration: z.number().optional(),
    position: z.string().optional(),
    salary: z.number().optional(),

    insuranceDoc: z.string().optional(),
    addOnPrice: z.number().optional(),
    dealerFee: z.number().optional(),
    documentationFee: z.number().optional(),
    financedAmount: z.number().optional(),
    monthlyPaymentAfterFee: z.number().optional(),

    deliveryType: z
        .nativeEnum(DELIVERY_TYPE)
        .optional()
        .or(z.number().optional()),

    deliveryDate: z.preprocess((arg) => {
        if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
    }, z.date().optional()),

});

export type DocumentType = z.infer<typeof documentSchema>;
