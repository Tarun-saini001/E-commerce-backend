import mongoose, { Schema, InferSchemaType } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { myCustomLabels } from "@app/utils/pagination";
import { APPLICATION_TYPE, COMMON_STATUS } from "@app/config/constants";

mongoosePaginate.paginate.options = { customLabels: myCustomLabels };

const applicationSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        vehicle: { type: Schema.Types.ObjectId, ref: "Vehicle", required: true },
        tradeIn: { type: Schema.Types.ObjectId, ref: "TradeIn" },
        document: { type: Schema.Types.ObjectId, ref: "ApplicationDocs" },
        insurance: { type: Schema.Types.ObjectId, ref: "Insurance" },
        type: { type: String, enum: Object.values(APPLICATION_TYPE), required: true },
        status: { type: String, enum: Object.values(COMMON_STATUS), default: COMMON_STATUS.PENDING },
        agreement: { type: String },
    },
    { timestamps: true }
);

applicationSchema.plugin(mongoosePaginate);

export type ApplicationDoc = InferSchemaType<typeof applicationSchema>;
export const Application = mongoose.model<ApplicationDoc>("Application", applicationSchema);
