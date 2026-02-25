import mongoose, { Schema, InferSchemaType } from "mongoose";

const wishListSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "products" }
}, { timestamps: true })

type UserDoc = InferSchemaType<typeof wishListSchema>;
const wishList = mongoose.model<UserDoc>("wishList", wishListSchema);
export default wishList