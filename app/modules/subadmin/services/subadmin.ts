import { Request } from "express";
import { SubAdminType } from "../validation/subadmin";
import { checkUserExists, validateUserAuth } from "../../onboarding/services/common";
import { createErrorResponse, createSuccessResponse, hashPassword } from "@app/utils/common";
import { RESPONSE_STATUS, ROLES } from "@app/config/constants";
import User from "../../onboarding/models/user";
import { defaultPaginationConfig } from "@app/utils/pagination";

export const SubAdmin = {

    addSubAdmin: async (req: Request) => {
        const body: SubAdminType = req.body;
        const result = validateUserAuth(req);

        if (!("user" in result)) {
            return createErrorResponse(
                RESPONSE_STATUS.RECORD_NOT_FOUND,
                req.t("ACCOUNT_NOT_FOUND"),
            );
        }

        const user = result.user;
        const existsError = await checkUserExists(body, req, user.id);
        if (existsError) return existsError;

        if (body.password) {
            body.password = await hashPassword(body.password);
        }

        (body as any).role = ROLES.SUBADMIN;
        (body as any).isEmailVerified = true;
        (body as any).isPasswordSet = true;

        const subadmin = await User.create(body);
        return createSuccessResponse(subadmin, req.t("SUB_ADMIN_CREATED_SUCCESSFULLY"));
    },

    updateSubAdmin: async (req: Request) => {
        const body: SubAdminType = req.body;
        const result = validateUserAuth(req);

        if (!("user" in result)) {
            return createErrorResponse(
                RESPONSE_STATUS.RECORD_NOT_FOUND,
                req.t("ACCOUNT_NOT_FOUND"),
            );
        }

        const user = result.user;
        const existsError = await checkUserExists(body, req, user.id);
        if (existsError) return existsError;

        const subadmin = await User.findByIdAndUpdate(req.params.id, body, { new: true });
        return createSuccessResponse(subadmin, req.t("SUB_ADMIN_UPDATED_SUCCESSFULLY"));
    },

    getSubAdmin: async (req: Request) => {
        const subadmin = await User.findById(req.params.id).populate("permission")
        return createSuccessResponse(subadmin, req.t("PROFILE_FETCHED_SUCCESSFULLY"));
    },

    deleteSubAdmin: async (req: Request) => {
        const subadmin = await User.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        return createSuccessResponse(subadmin, req.t("ACCOUNT_DELETED_SUCCESSFULLY"));
    },

    list: async (req: Request) => {

        const options = {
            page: req.query.page || defaultPaginationConfig.page,
            limit: req.query.limit || defaultPaginationConfig.limit,
            sort: req.query.sort || { createdAt: -1 },
        }

        const query: any = {
            role: ROLES.SUBADMIN,
            isDeleted: false
        }

        if (req.query.search) {
            query.$or = [
                { fullName: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" } },
                { phone: { $regex: req.query.search, $options: "i" } },
            ];
        }

        const subadmin = await User.paginate(query, options);
        return createSuccessResponse(subadmin, req.t("PROFILE_FETCHED_SUCCESSFULLY"));
    }

}