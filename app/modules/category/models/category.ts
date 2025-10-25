import mongoose, { Schema, InferSchemaType } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { myCustomLabels } from "@app/utils/pagination";

mongoosePaginate.paginate.options = { customLabels: myCustomLabels };

const categorySchema = new Schema(
    {
        name: { type: String, required: true, unique: true },
        description: { type: String },
        image: { type: String },
        parent: { type: Schema.Types.ObjectId, ref: "Category" },
        isDeleted: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

categorySchema.plugin(mongoosePaginate);

export type CategoryDoc = InferSchemaType<typeof categorySchema>;
export const Category = mongoose.model<CategoryDoc>("Category", categorySchema);
