import mongoose, { Schema, InferSchemaType } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { myCustomLabels } from "@app/utils/pagination";
import { VEHICLE_AVAILABILITY, VEHICLE_STATUS } from "@app/config/constants";

mongoosePaginate.paginate.options = { customLabels: myCustomLabels };

const vehicleSchema = new Schema(
    {
        name: { type: String, required: true },
        vin: { type: String, required: true, unique: true },
        make: { type: String, required: true },
        model: { type: String, required: true },
        year: { type: Number },
        category: { type: Schema.Types.ObjectId, ref: "Category" },
        subCategory: { type: Schema.Types.ObjectId, ref: "Category" },
        brand: { type: Schema.Types.ObjectId, ref: "Brand" },
        dealership: { type: Schema.Types.ObjectId, ref: "Dealership" },
        price: { type: Number, required: true },
        isFeatured: { type: Boolean, default: false },
        wheels: { type: Number },
        cylinders: { type: Number },
        fuelType: { type: String },
        milage: { type: Number },
        seats: { type: Number },
        doors: { type: Number },
        transmission: { type: String },
        power: { type: Number },
        engineCapacity: { type: Number },
        color: { type: String },
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
        dealershipId: { type: Schema.Types.ObjectId, ref: "Dealership" },
        images: [{ type: String }],
        video: { type: String },
        damageMap: [
            {
                area: String,
                description: String,
                image: String,
            },
        ],
        availablity: {
            type: Number,
            enum: Object.values(VEHICLE_AVAILABILITY),
            default: VEHICLE_AVAILABILITY.FOR_SALE,
        },
        status: {
            type: Number,
            enum: Object.values(VEHICLE_STATUS),
            default: VEHICLE_STATUS.AVAILABLE,
        },
        hold: {
            heldBy: { type: Schema.Types.ObjectId, ref: "User" },
            holdUntil: { type: Date },
        },
        tags: [{ type: String }],
        description: { type: String },
        subscription: {
            milagePerDay: { type: Number },
            pricePerDay: { type: Number },
        },
        isDeleted: { type: Boolean, default: false },
    },

    { timestamps: true }
);

vehicleSchema.plugin(mongoosePaginate);

type VehicleDoc = InferSchemaType<typeof vehicleSchema>;
const Vehicle = mongoose.model<VehicleDoc>("Vehicle", vehicleSchema);

export default Vehicle;
