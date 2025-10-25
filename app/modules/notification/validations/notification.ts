import { z } from "zod";
import { NOTIFICATION_TYPE } from "@app/config/constants";

export const notification = z.object({
    userId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid userId"),
    title: z.string().min(1, "Title is required"),
    message: z.string().min(1, "Message is required"),
    type: z.enum(NOTIFICATION_TYPE).optional(),
    isRead: z.boolean().optional(),
});

export type NotificationType = z.infer<typeof notification>;
