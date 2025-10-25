import { APPLICATION_TYPE, COMMON_STATUS } from "@app/config/constants";
import { z } from "zod";

const documentItemSchema = z.object({
    name: z.string(),
    url: z.string(),
    status: z.nativeEnum(COMMON_STATUS).default(COMMON_STATUS.PENDING),
});

const conversationSchema = z.object({
    senderId: z.string(),
    message: z.string().optional(),
    documentUrl: z.string().optional(),
    createdAt: z.date().default(() => new Date()),
});

const insuranceSchema = z.object({
    provider: z.string(),
    policyNumber: z.string(),
    apiStatus: z.string().optional(),
    coverageType: z.string().optional(),
    expirationDate: z.date().optional(),
    vehicle: z.string(),
    amount: z.number(),
    status: z.nativeEnum(COMMON_STATUS).default(COMMON_STATUS.PENDING),
});

const documentSchema = z.object({
    documents: z.array(documentItemSchema).optional(),
    conversation: z.array(conversationSchema).optional(),
});

const tradeInSchema = z.object({
    evaluationBookingId: z.string().optional(),
});

export const applicationSchema = z.object({
    user: z.string(),
    vehicle: z.string(),
    tradeIn: tradeInSchema.optional(),
    document: documentSchema.optional(),
    insurance: insuranceSchema.optional(),
    type: z.nativeEnum(APPLICATION_TYPE),
    status: z.nativeEnum(COMMON_STATUS).default(COMMON_STATUS.PENDING),
    agreement: z.string().optional(),
});

export type ApplicationType = z.infer<typeof applicationSchema>;
