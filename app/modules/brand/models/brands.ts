import mongoose, { Schema, InferSchemaType } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { myCustomLabels } from "@app/utils/pagination";

mongoosePaginate.paginate.options = { customLabels: myCustomLabels };

const brandSchema = new Schema(
    {
        name: { type: String, required: true, unique: true },
        logo: { type: String },
        description: { type: String },
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

brandSchema.plugin(mongoosePaginate);

export type BrandDoc = InferSchemaType<typeof brandSchema>;
export const Brand = mongoose.model<BrandDoc>("Brand", brandSchema);
