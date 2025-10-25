
import mongoose, { Schema, InferSchemaType } from "mongoose";
import { COMMON_STATUS, SELLING_IN } from "@app/config/constants";
import { myCustomLabels } from "@app/utils/pagination";
import mongoosePaginate from "mongoose-paginate-v2";

mongoosePaginate.paginate.options = { customLabels: myCustomLabels };

const AppointmentsSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User" },

        vin: { type: String },

        plateNumber: { type: String },

        currentMiles: { type: Number },

        images: [{ type: String }],

        sellingIn: { type: Number, enum: Object.values(SELLING_IN) },

        make: { type: String, required: true },

        model: { type: String, required: true },

        year: { type: Number },

        brand: { type: Schema.Types.ObjectId, ref: "Brand" },

        price: { type: Number, required: true },

        offerAccepted: { type: Boolean, default: false },

        evaluationLocation: {
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

        Date: { type: Date, default: Date.now },

        bookingId: { type: String },

        status: {
            type: Number,
            enum: Object.values(COMMON_STATUS),
            default: COMMON_STATUS.PENDING,
        },

        isDeleted: { type: Boolean, default: false },
    },
    {
        timestamps: true
    }
);

AppointmentsSchema.plugin(mongoosePaginate);

type AppointmentDoc = InferSchemaType<typeof AppointmentsSchema>;
const Appointments = mongoose.model<AppointmentDoc>("EvaluationBooking", AppointmentsSchema);

export default Appointments;
