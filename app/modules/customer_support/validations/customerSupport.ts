import { SUPPORT_STATUS } from "@app/config/constants";
import { z } from "zod";

export const supportSchema = z.object({
    subject: z.string().min(1, "subject is required"),
    description: z.string().min(1, "description is required"),
    attachments: z.array(z.string()).optional(),
    status: z.nativeEnum(SUPPORT_STATUS).optional(),
    conversation: z.array(z.object({
        sender: z.string().min(1, "sender is required"),
        message: z.string().min(1, "message is required"),
        timestamp: z.date().optional()
    })).optional()
});

export const sendMessageSchema = z.object({
    message: z.string().min(1, "Message cannot be empty"),
});

export type SupportSchemaType = z.infer<typeof supportSchema>;
