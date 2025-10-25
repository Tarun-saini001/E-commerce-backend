import mongoose, { Schema, InferSchemaType } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { myCustomLabels } from "@app/utils/pagination";

mongoosePaginate.paginate.options = { customLabels: myCustomLabels };

const customerSupportSchema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String },
        costToDealer: { type: Number },
        sellingPrice: { type: Number },
        termLength: { type: Number },
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

customerSupportSchema.plugin(mongoosePaginate);

export type CustomerSupportDoc = InferSchemaType<typeof customerSupportSchema>;
export const CustomerSupport = mongoose.model<CustomerSupportDoc>("CustomerSupport", customerSupportSchema);
