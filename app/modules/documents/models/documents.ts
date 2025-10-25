import mongoose, { Schema, InferSchemaType } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { myCustomLabels } from "@app/utils/pagination";
import { DELIVERY_TYPE, FINANCE_TYPE } from "@app/config/constants";

mongoosePaginate.paginate.options = { customLabels: myCustomLabels };

const documentSchema = new Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        name: { type: String, required: true },
        email: { type: String },
        phone: { type: String },
        licenseNo: { type: String },
        licenseImg: { type: String },
        selfie: { type: String },
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
        address: {
            line1: { type: String },
            line2: { type: String },
            city: { type: String },
            state: { type: String },
            zip: { type: String },
            country: { type: String },
        },
        tagId: { type: String },
        tagRegNo: { type: String },
        taxRegImg: { type: String },
        taxId: { type: String },
        vin: { type: String },
        currMilage: { type: String },
        vehicleImgs: [{ type: String }],
        addOns: [{ type: mongoose.Schema.Types.ObjectId, ref: "AddOn" }],
        financeType: { type: Number, enum: Object.values(FINANCE_TYPE) },
        downPayment: { type: Number },
        loanDuration: { type: Number }, // in months
        loanROI: { type: Number },
        monthlyPayment: { type: Number },
        employerName: { type: String },
        employmentDuration: { type: Number },// in months
        position: { type: String },
        salary: { type: Number },
        insuranceDoc: { type: String },
        addOnPrice: { type: Number },
        dealerFee: { type: Number },
        documentationFee: { type: Number },
        financedAmount: { type: Number },
        monthlyPaymentAfterFee: { type: Number },
        deliveryType: { type: Number, enum: Object.values(DELIVERY_TYPE) },
        deliveryDate: { type: Date },
        montlyMiles: { type: Number },

        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

documentSchema.plugin(mongoosePaginate);

export type DocumentDoc = InferSchemaType<typeof documentSchema>;
export const Documents = mongoose.model<DocumentDoc>("Document", documentSchema);
