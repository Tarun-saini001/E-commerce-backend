import { Request } from "express";
import { validateUserAuth } from "../../onboarding/services/common";
import { PermissionInput } from "../validation/permissions";
import { createErrorResponse, createSuccessResponse } from "@app/utils/common";
import { RESPONSE_STATUS } from "@app/config/constants";
import Permission from "../models/permissions";
import { defaultPaginationConfig } from "@app/utils/pagination";

export const Permissions = {
    addPermission: async (req: Request) => {
        const body: PermissionInput = req.body;
        const result = validateUserAuth(req);

        if (!("user" in result)) {
            return createErrorResponse(
                RESPONSE_STATUS.RECORD_NOT_FOUND,
                req.t("ACCOUNT_NOT_FOUND"),
            );
        }

        const user = result.user;
        const existed = await Permission.findOne({ name: body.name, isDeleted: false });

        if (existed) {
            return createErrorResponse(
                RESPONSE_STATUS.BAD_REQUEST,
                req.t("PERMISSION_ALREADY_EXISTS"),
            );
        }

        const permission = await Permission.create({ ...body, createdBy: user.id });
        return createSuccessResponse(permission, req.t("PERMISSION_CREATED_SUCCESSFULLY"));
    },

    getPermissions: async (req: Request) => {

        const options = {
            page: req.query.page || defaultPaginationConfig.page,
            limit: req.query.limit || defaultPaginationConfig.limit,
            sort: req.query.sort
        }

        const query: any = {
            isDeleted: false
        }

        if (req.query.search) {
            query.$or = [
                { name: { $regex: req.query.search, $options: "i" } },
            ];
        }

        const permissions = await Permission.paginate(query, options);
        return createSuccessResponse(permissions, req.t("PERMISSION_FETCHED_SUCCESSFULLY"));
    },

    getPermission: async (req: Request) => {
        const permission = await Permission.findById(req.params.id);
        return createSuccessResponse(permission, req.t("PERMISSION_FETCHED_SUCCESSFULLY"));
    },

    updatePermission: async (req: Request) => {
        const body: PermissionInput = req.body;
        const permission = await Permission.findByIdAndUpdate(req.params.id, body, { new: true });
        return createSuccessResponse(permission, req.t("PERMISSION_UPDATED_SUCCESSFULLY"));
    },

    deletePermission: async (req: Request) => {
        const permission = await Permission.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        return createSuccessResponse(permission, req.t("PERMISSION_DELETED_SUCCESSFULLY"));
    }
}