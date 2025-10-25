import mongoose, { Schema, InferSchemaType } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { myCustomLabels } from "@app/utils/pagination";
import { COMMON_STATUS } from "@app/config/constants";

mongoosePaginate.paginate.options = { customLabels: myCustomLabels };

const insuranceSchema = new Schema(
    {
        provider: { type: String },
        policyNumber: { type: String },
        apiStatus: { type: String },
        coverageType: { type: String },
        expirationDate: { type: Date },
        vehicle: { type: String },
        amount: { type: Number },
        status: { type: String, enum: Object.values(COMMON_STATUS), default: COMMON_STATUS.PENDING },
    },
    { timestamps: true }
);

insuranceSchema.plugin(mongoosePaginate);

export type InsuranceDoc = InferSchemaType<typeof insuranceSchema>;
export const Insurance = mongoose.model<InsuranceDoc>("Insurance", insuranceSchema);
