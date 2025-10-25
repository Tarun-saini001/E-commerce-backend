import mongoose, { Schema, InferSchemaType } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { myCustomLabels } from "@app/utils/pagination";
import { SAVE_TYPE } from "@app/config/constants";

mongoosePaginate.paginate.options = { customLabels: myCustomLabels };

const favoriteCompareSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        vehicleId: { type: Schema.Types.ObjectId, ref: "Vehicle", required: true },
        type: { type: Number, enum: Object.values(SAVE_TYPE), default: SAVE_TYPE.FAVORITE },
    },
    { timestamps: true }
);

favoriteCompareSchema.plugin(mongoosePaginate);

export type FavoriteCompareDoc = InferSchemaType<typeof favoriteCompareSchema>;
export const Favorite_Compare = mongoose.model<FavoriteCompareDoc>("Favorite_Compare", favoriteCompareSchema);
