import mongoose, { Schema, InferSchemaType } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { myCustomLabels } from "@app/utils/pagination";

mongoosePaginate.paginate.options = { customLabels: myCustomLabels };

const subscriptionPlanSchema = new Schema(
    {
        name: { type: String, required: true },
        mileageLimit: { type: Number },
        termLength: { type: Number }, // months
        price: { type: Number, required: true },
        description: { type: String },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

subscriptionPlanSchema.plugin(mongoosePaginate);

export type SubscriptionPlanDoc = InferSchemaType<typeof subscriptionPlanSchema>;
export const SubscriptionPlan = mongoose.model<SubscriptionPlanDoc>("SubscriptionPlan", subscriptionPlanSchema);
