import mongoose, { Schema, InferSchemaType } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { myCustomLabels } from "@app/utils/pagination";
import { APPLICATION_TYPE, BOOKING_STATUS } from "@app/config/constants";

mongoosePaginate.paginate.options = { customLabels: myCustomLabels };

const bookingSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        vehicleId: { type: Schema.Types.ObjectId, ref: "Vehicle" },
        dealershipId: { type: Schema.Types.ObjectId, ref: "Dealership" },
        documentsId: { type: Schema.Types.ObjectId, ref: "Document" },
        status: { type: Number, enum: Object.values(BOOKING_STATUS) },
        bookingType: { type: Number, enum: Object.values(APPLICATION_TYPE) },
    },
    { timestamps: true }
);

bookingSchema.plugin(mongoosePaginate);

export type BookingDoc = InferSchemaType<typeof bookingSchema>;
export const Booking = mongoose.model<BookingDoc>("Booking", bookingSchema);
