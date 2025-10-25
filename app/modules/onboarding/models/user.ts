import mongoose, { Schema, InferSchemaType } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { SOCIAL_LOGIN, USER_STATUS, ROLES, PROFILE_STEPS } from "@app/config/constants";
import { myCustomLabels } from "@app/utils/pagination";

mongoosePaginate.paginate.options = { customLabels: myCustomLabels };

const userSchema = new Schema(
        {
                image: { type: String },
                fullName: { type: String },
                email: { type: String },
                countryCode: { type: String },
                phone: { type: String },
                password: { type: String },
                socialId: { type: String },
                socialProvider: { type: String, enum: Object.values(SOCIAL_LOGIN) },
                role: { type: Number, enum: Object.values(ROLES) },
                profileSteps: { type: Number, enum: Object.values(PROFILE_STEPS) },
                dob: { type: Date },
                isBlocked: { type: Boolean, default: false },
                isDeleted: { type: Boolean, default: false },
                isProfileComplete: { type: Boolean, default: false },
                isEmailVerified: { type: Boolean, default: false },
                isPhoneVerified: { type: Boolean, default: false },
                isPasswordSet: { type: Boolean, default: false },
                location: {
                        type: {
                                type: String,
                                enum: ["Point"],
                        },
                        coordinates: {
                                type: [Number],
                                required: true
                        }
                },
                address: {
                        line1: { type: String },
                        line2: { type: String },
                        city: { type: String },
                        state: { type: String },
                        zip: { type: String },
                        country: { type: String },
                },
                status: { type: Number, enum: Object.values(USER_STATUS), default: USER_STATUS.PENDING },
                permission: { type: Schema.Types.ObjectId, ref: "permission" },
                preferences: [{
                        type: {
                                type: String,
                                enum: ["Point"],
                        },
                        coordinates: {
                                type: [Number],
                                required: true
                        }
                }]
        },
        { timestamps: true }
);

userSchema.plugin(mongoosePaginate);

type UserDoc = InferSchemaType<typeof userSchema>;
const User = mongoose.model<UserDoc>("User", userSchema);

export default User;
