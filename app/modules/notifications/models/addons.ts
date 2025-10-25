import mongoose, { Schema, InferSchemaType } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { myCustomLabels } from "@app/utils/pagination";

mongoosePaginate.paginate.options = { customLabels: myCustomLabels };

const addOnSchema = new Schema(
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

addOnSchema.plugin(mongoosePaginate);

export type AddOnDoc = InferSchemaType<typeof addOnSchema>;
export const AddOn = mongoose.model<AddOnDoc>("AddOn", addOnSchema);
