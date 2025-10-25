import mongoose, { Schema, InferSchemaType } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { myCustomLabels } from "@app/utils/pagination";
import { COMMON_STATUS } from "@app/config/constants";

mongoosePaginate.paginate.options = { customLabels: myCustomLabels };

const tradeInSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        evaluationBooking: { type: Schema.Types.ObjectId, ref: "EvaluationBooking" },
        counterPrice: { type: Number },
        status: { type: Number, enum: Object.values(COMMON_STATUS), default: COMMON_STATUS.PENDING },
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

tradeInSchema.plugin(mongoosePaginate);

export type TradeInDoc = InferSchemaType<typeof tradeInSchema>;
export const TradeIn = mongoose.model<TradeInDoc>("TradeIn", tradeInSchema);
