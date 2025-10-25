import mongoose, { Schema, InferSchemaType } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { myCustomLabels } from "@app/utils/pagination";
import { PAYMENT_STATUS, PAYMENT_TYPE } from "@app/config/constants";

mongoosePaginate.paginate.options = { customLabels: myCustomLabels };

const invoiceSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        bookingId: { type: Schema.Types.ObjectId, ref: "Booking" },
        applicationId: { type: Schema.Types.ObjectId, ref: "Application" },
        amount: { type: Number },
        tax: { type: Number },
        totalAmount: { type: Number },
        items: [{ type: Schema.Types.ObjectId, ref: "Vehicle" }],
        paymentMethod: { type: Number, enum: Object.values(PAYMENT_TYPE), default: PAYMENT_TYPE.ONLINE },
        paymentStatus: { type: Number, enum: Object.values(PAYMENT_STATUS), default: PAYMENT_STATUS.PENDING },
        notes: { type: String },
    },
    { timestamps: true }
);

invoiceSchema.plugin(mongoosePaginate);

export type InvoiceDoc = InferSchemaType<typeof invoiceSchema>;
export const Invoice = mongoose.model<InvoiceDoc>("Invoice", invoiceSchema);
