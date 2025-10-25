
import mongoose, { Schema, InferSchemaType } from "mongoose";
import { RESOURCES } from "@app/config/constants";
import { myCustomLabels } from "@app/utils/pagination";
import mongoosePaginate from "mongoose-paginate-v2";

mongoosePaginate.paginate.options = { customLabels: myCustomLabels };

const PermissionSchema = new Schema(
    {
        name: { type: String },

        permission: [
            {
                sideBarId: { type: Number, enum: Object.values(RESOURCES) },
                label: { type: String },
                isView: { type: Boolean, default: false },
                isAdd: { type: Boolean, default: false },
                isEdit: { type: Boolean, default: false },
                isDelete: { type: Boolean, default: false },
            },
        ],

        isBlocked: { type: Boolean, default: false },

        isDeleted: { type: Boolean, default: false },
    },
    {
        timestamps: true
    }
);

PermissionSchema.plugin(mongoosePaginate);

type PermissionDoc = InferSchemaType<typeof PermissionSchema>;
const Permission = mongoose.model<PermissionDoc>("permission", PermissionSchema);

export default Permission;
