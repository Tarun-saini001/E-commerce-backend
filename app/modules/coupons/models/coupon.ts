import { COUPON_TYPE } from "@app/config/constants";
import { required } from "joi";
import mongoose, { Schema, InferSchemaType } from "mongoose";

const couponSchema = new Schema({
    code: { type: String },
    discountType: { type: String, enum: Object.values(COUPON_TYPE) },
    discountValue: { type: Number },        // % or flat amount    
    minOrderAmount: { type: Number },
    maxDiscount: { type: Number },         // (optional)
    startDate: { type: Date },
    endDate: { type: Date },
    isActive: { type: Boolean },
}, { timestamps: true });

type UserDoc = InferSchemaType<typeof couponSchema>;
const coupon = mongoose.model<UserDoc>("coupons", couponSchema);
export default coupon