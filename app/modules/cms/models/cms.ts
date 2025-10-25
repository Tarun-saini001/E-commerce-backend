import mongoose from "mongoose";

const cmsSchema = new mongoose.Schema(
    {
        email: { type: String },
        phone: { type: String },
        countryCode: { type: String },
        termsAndConditions: { type: String },
        privacyPolicy: { type: String },
        aboutUs: { type: String },
        contactUpdatedAt: { type: Date },
        termsUpdatedAt: { type: Date },
        policyUpdatedAt: { type: Date },
        aboutUpdatedAt: { type: Date }
    },
    { timestamps: true }
);

const Cms = mongoose.model("Cms", cmsSchema);
export default Cms;
