import mongoose, { Schema, InferSchemaType } from "mongoose";
import { object } from "joi";

const brandSchema = new mongoose.Schema({
    caterogyId: { type: mongoose.Schema.Types.ObjectId, ref: "categories" },
     name:{type:String},
})

type UserDoc = InferSchemaType<typeof brandSchema>;
const brand = mongoose.model<UserDoc>("brands", brandSchema);
export default brand