import { required } from "joi";
import mongoose, { Schema, InferSchemaType } from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    guestId: { type: String, default: null },

    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "products", required: true },
        quantity: { type: Number, default: 1 },
        price: { type: Number }, // store price at the time of adding
        total: { type: Number }, // quantity * price
        bundleDiscount: { type: Number } // originalPrice - offerPrice
      }
    ],

    subTotal: { type: Number, default: 0 },//total price of all items before any discount.
    discount: { type: Number, default: 0 },//This is the price reduction applied to the cart.
    couponCode:{type: String,default:""},
    grandTotal: { type: Number, default: 0 },//This is the final amount the customer will pay after discount.
  },
  { timestamps: true }
);

cartSchema.pre("save", function (next) {
  this.subTotal = this.items.reduce((sum: number, item: any) => sum + item.total, 0);
  this.grandTotal = this.subTotal - this.discount;
  next();
});


type UserDoc = InferSchemaType<typeof cartSchema>;
const cart = mongoose.model<UserDoc>("carts", cartSchema);
export default cart