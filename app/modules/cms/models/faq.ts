import mongoose, { Schema, InferSchemaType } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { myCustomLabels } from "@app/utils/pagination";

mongoosePaginate.paginate.options = { customLabels: myCustomLabels };

const faqSchema = new mongoose.Schema(
    {
        question: { type: String },
        answer: { type: String },
        isDeleted: { type: Boolean, default: false }
    },
    { timestamps: true }
);

faqSchema.plugin(mongoosePaginate);
type FaqDoc = InferSchemaType<typeof faqSchema>;
const Faq = mongoose.model<FaqDoc>("Faq", faqSchema);
export default Faq;
