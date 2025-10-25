import mongoose, { Schema, InferSchemaType } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { myCustomLabels } from "@app/utils/pagination";
import { DAYS_NAME } from "@app/config/constants";

mongoosePaginate.paginate.options = { customLabels: myCustomLabels };

const dealershipSchema = new Schema(
    {
        image: { type: String },
        name: { type: String, required: true },
        phone: { type: String },
        business_phone: { type: String },
        email: { type: String },
        location: {
            type: {
                type: String,
                enum: ["Point"],
                required: true
            },
            coordinates: {
                type: [Number],
                required: true
            }
        },
        address: { type: String },
        workingHours: [
            {
                day: { type: Number, enum: Object.values(DAYS_NAME) },
                open: { type: Date },
                close: { type: Date },
                isClosed: { type: Boolean, default: false }
            }
        ],
        inventory: [{ type: Schema.Types.ObjectId, ref: "Vehicle" }],
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

dealershipSchema.plugin(mongoosePaginate);
dealershipSchema.index({ location: "2dsphere" });

export type DealershipDoc = InferSchemaType<typeof dealershipSchema>;
export const Dealership = mongoose.model<DealershipDoc>("Dealership", dealershipSchema);
