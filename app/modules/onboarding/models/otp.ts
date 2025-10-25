import mongoose from "mongoose";
import { OTP_FOR } from "@app/config/constants";

const otpSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            trim: true,
            lowercase: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        countryCode: {
            type: String,
            trim: true,
        },
        otp: {
            type: String,
            required: true,
        },
        otpType: {
            type: Number,
            enum: Object.values(OTP_FOR),
            default: OTP_FOR.REGISTER,
            required: true,
        },
        expiresAt: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true }
);

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Otp = mongoose.model("Otp", otpSchema);
export default Otp;
