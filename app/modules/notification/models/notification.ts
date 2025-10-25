import mongoose, { Schema, InferSchemaType } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { myCustomLabels } from "@app/utils/pagination";
import { NOTIFICATION_TYPE } from "@app/config/constants";

mongoosePaginate.paginate.options = { customLabels: myCustomLabels };

const notificationSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        title: { type: String, required: true },
        message: { type: String, required: true },
        type: { type: String, enum: Object.values(NOTIFICATION_TYPE), default: NOTIFICATION_TYPE.SYSTEM },
        isRead: { type: Boolean, default: false },
    },
    { timestamps: true }
);

notificationSchema.plugin(mongoosePaginate);

export type NotificationDoc = InferSchemaType<typeof notificationSchema>;
export const Notification = mongoose.model<NotificationDoc>("Notification", notificationSchema);
