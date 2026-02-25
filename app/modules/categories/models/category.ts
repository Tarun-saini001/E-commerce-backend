import mongoose, { Schema, InferSchemaType } from "mongoose";
import { FIELDS_TYPES } from "@app/config/constants";

const categorySchema = new Schema({
    categoryName: { type: String },
    image: { type: String },
    parentCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: "categories" },
    fields: [
        {
            key: { type: String },
            label: { type: String },
            type: { type: Number, enum: Object.values(FIELDS_TYPES) },
            option: [
                { type: String }
            ],
        }
    ]
},
    { timestamps: true })

type UserDoc = InferSchemaType<typeof categorySchema>;
const category = mongoose.model<UserDoc>("categories", categorySchema);
export default category