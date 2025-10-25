
import mongoose, { Schema, InferSchemaType } from "mongoose";
import { COMMON_STATUS, PAYMENT_METHOD, PAYMENT_STATUS, SELLING_IN, TRANSACTION_TYPE } from "@app/config/constants";
import { myCustomLabels } from "@app/utils/pagination";
import mongoosePaginate from "mongoose-paginate-v2";

mongoosePaginate.paginate.options = { customLabels: myCustomLabels };

const TransactionSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },

        referenceId: {
            type: Schema.Types.ObjectId,
            required: true,
            refPath: 'referenceModel'
        },

        referenceModel: {
            type: String,
            required: true,
            enum: ['Booking', 'SubscriptionPlan']
        },

        transactionType: { type: Number, enum: Object.values(TRANSACTION_TYPE), },

        paymentMethod: { type: Number, enum: Object.values(PAYMENT_METHOD), default: PAYMENT_METHOD.CARD },

        paymentId: { type: String },

        status: { type: Number, enum: Object.values(PAYMENT_STATUS), default: PAYMENT_STATUS.PENDING },

        amount: { type: Number },

        isDeleted: { type: Boolean, default: false },
    },
    {
        timestamps: true
    }
);

TransactionSchema.plugin(mongoosePaginate);

type TransactionDoc = InferSchemaType<typeof TransactionSchema>;
const Transactions = mongoose.model<TransactionDoc>("Transaction", TransactionSchema);

export default Transactions;
