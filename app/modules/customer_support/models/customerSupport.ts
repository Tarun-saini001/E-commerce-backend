import mongoose, { Schema, InferSchemaType } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { myCustomLabels } from "@app/utils/pagination";
import { SUPPORT_STATUS } from "@app/config/constants";

mongoosePaginate.paginate.options = { customLabels: myCustomLabels };

const customerSupportSchema = new Schema(
    {
        refNo: { type: String, unique: true },
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        subject: { type: String },
        description: { type: String },
        conversation: [{
            sender: { type: Schema.Types.ObjectId, ref: "User" },
            message: { type: String },
            timestamp: { type: Date, default: Date.now }
        }],
        status: { type: Number, enum: Object.values(SUPPORT_STATUS) },
        attachments: [{ type: String }],
    },
    { timestamps: true }
);

customerSupportSchema.plugin(mongoosePaginate);

export type CustomerSupportDoc = InferSchemaType<typeof customerSupportSchema>;
export const CustomerSupport = mongoose.model<CustomerSupportDoc>("CustomerSupport", customerSupportSchema);
