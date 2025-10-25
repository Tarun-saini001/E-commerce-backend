import mongoose, { Schema, InferSchemaType } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { myCustomLabels } from "@app/utils/pagination";
import { COMMON_STATUS } from "@app/config/constants";

mongoosePaginate.paginate.options = { customLabels: myCustomLabels };

const documentSchema = new Schema(
    {
        documents: [{
            name: { type: String },
            url: { type: String },
            status: { type: String, enum: Object.values(COMMON_STATUS), default: COMMON_STATUS.PENDING },
        }],
        conversation: [
            {
                senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
                message: { type: String },
                documentUrl: { type: String },
                createdAt: { type: Date, default: Date.now }
            }
        ],
    },
    { timestamps: true }
);

documentSchema.plugin(mongoosePaginate);

export type DocumentDoc = InferSchemaType<typeof documentSchema>;
export const Document = mongoose.model<DocumentDoc>("ApplicationDocs", documentSchema);
