import mongoose, { Schema, InferSchemaType } from "mongoose";
import { FIELDS_TYPES } from "@app/config/constants";

const productSchema = new mongoose.Schema({
  brandId: { type:  mongoose.Schema.Types.ObjectId, ref: "brands" },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "categories" },
  name: { type: String, trim: true },
  description: { type: String },
  color: { type: String },
  price: { type: Number },
  discount: { type: String },
  size: { type: String },
  stock: { type: Number, default: 0 },
  fields: [
    {
      key: { type: String },
      label: { type: String },
      type: { type: Number, enum: Object.values(FIELDS_TYPES) },
      option: [
        { type: String }
      ],
    }
  ],
  bundle: {
    isBundle: { type: Boolean, default: false },  // true if bundle exists
    requiredQty: { type: Number, default: 0 },     // how many items needed
    price: { type: Number, default: 0 },           // bundle price
    offerTitle: { type: String, default: "" },     // e.g. "Buy 3 for ₹1999" / "Buy 1 Get 2 Free"
  }
},{ timestamps: true })

type UserDoc = InferSchemaType<typeof productSchema>;
const product = mongoose.model<UserDoc>("products", productSchema);
export default product