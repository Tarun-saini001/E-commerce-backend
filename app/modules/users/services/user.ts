import { Request } from "express";
import { createErrorResponse, createSuccessResponse, hashPassword } from "@app/utils/common";
import { RESPONSE_STATUS } from "@app/config/constants";
import { defaultPaginationConfig } from "@app/utils/pagination";
import { UpdateProfileType } from "@app/modules/onboarding/validation/onboarding";
import User from "@app/modules/onboarding/models/user";
import { generateCsv } from "@app/utils/upload";

export const UserService = {
    addUser: async (req: Request) => {
        const body: UpdateProfileType = req.body;

        if (body.password) {
            body.password = await hashPassword(body.password);
        }

        const existing = await User.findOne({ $or: [{ email: body.email }, { phone: body.phone }] });
        if (existing) {
            return createErrorResponse(RESPONSE_STATUS.ALREADY_EXISTS, req.t("USER_ALREADY_EXISTS"));
        }

        const user = await User.create(body);
        return createSuccessResponse(user, req.t("USER_CREATED_SUCCESSFULLY"));
    },

    updateUser: async (req: Request) => {
        const body: Partial<UpdateProfileType> = req.body;
        if (body.password) {
            body.password = await hashPassword(body.password);
        }

        const user = await User.findByIdAndUpdate(req.params.id, body, { new: true });
        if (!user) {
            return createErrorResponse(RESPONSE_STATUS.RECORD_NOT_FOUND, req.t("USER_NOT_FOUND"));
        }
        return createSuccessResponse(user, req.t("USER_UPDATED_SUCCESSFULLY"));
    },

    getUser: async (req: Request) => {
        const user = await User.findById(req.params.id).populate("permission");
        if (!user) {
            return createErrorResponse(RESPONSE_STATUS.RECORD_NOT_FOUND, req.t("USER_NOT_FOUND"));
        }
        return createSuccessResponse(user, req.t("USER_FETCHED_SUCCESSFULLY"));
    },

    deleteUser: async (req: Request) => {
        const user = await User.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        if (!user) {
            return createErrorResponse(RESPONSE_STATUS.RECORD_NOT_FOUND, req.t("USER_NOT_FOUND"));
        }
        return createSuccessResponse(user, req.t("USER_DELETED_SUCCESSFULLY"));
    },

    list: async (req: Request) => {
        const options: any = {
            page: req.query.page || defaultPaginationConfig.page,
            limit: req.query.limit || defaultPaginationConfig.limit,
            sort: req.query.sort || { createdAt: -1 },
        };

        if (req.query.isExport == "true") {
            delete options.page;
            delete options.limit;
        }

        const query: any = { isDeleted: false };

        if (req.query.search) {
            query.$or = [
                { fullName: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" } },
                { phone: { $regex: req.query.search, $options: "i" } },
            ];
        }
        if (req.query.role) {
            query.role = req.query.role;
        }
        if (req.query.isBlocked) {
            query.isBlocked = req.query.isBlocked
        }

        const users = await User.paginate(query, options);
        return createSuccessResponse(users, req.t("USER_LIST_FETCHED_SUCCESSFULLY"));
    },

    csv: async (req: Request) => {
        req.user.isExport = true;
        const data = await UserService.list(req);

        const list = (data.data as any[]).map((user) => ({
            FullName: user.fullName,
            Email: user.email,
            Phone: user.phone
        }));

        const fileName = `users_${Date.now()}.csv`;
        const fileUrl = await generateCsv(list, fileName);

        return createSuccessResponse({ fileUrl }, req.t("USER_CSV_GENERATED_SUCCESSFULLY"));
    }
}