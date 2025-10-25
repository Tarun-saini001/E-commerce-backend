import { Request } from "express";
import { createErrorResponse, createSuccessResponse } from "@app/utils/common";
import { RESPONSE_STATUS, ROLES } from "@app/config/constants";
import { defaultPaginationConfig } from "@app/utils/pagination";
import { NotificationType } from "../validations/notification";
import { Notification } from "../models/notification";
import { validateUserAuth } from "@app/modules/onboarding/services/common";

export const NotificationService = {
    addNotification: async (req: Request) => {
        const body: NotificationType = req.body;

        const notification = await Notification.create(body);
        return createSuccessResponse(notification, req.t("NOTIFICATION_SENT_SUCCESSFULLY"));
    },

    markAsRead: async (req: Request) => {
        const notification = await Notification.findByIdAndUpdate(
            req.params.id,
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return createErrorResponse(RESPONSE_STATUS.RECORD_NOT_FOUND, req.t("NOTIFICATION_NOT_FOUND"));
        }

        return createSuccessResponse(notification, req.t("NOTIFICATION_MARKED_AS_READ"));
    },

    getNotification: async (req: Request) => {
        const notification = await Notification.findById(req.params.id).populate("userId");
        if (!notification) {
            return createErrorResponse(RESPONSE_STATUS.RECORD_NOT_FOUND, req.t("NOTIFICATION_NOT_FOUND"));
        }
        return createSuccessResponse(notification, req.t("NOTIFICATION_FETCHED_SUCCESSFULLY"));
    },

    deleteNotification: async (req: Request) => {
        const notification = await Notification.findByIdAndUpdate(
            req.params.id,
            { isDeleted: true },
            { new: true }
        );
        if (!notification) {
            return createErrorResponse(RESPONSE_STATUS.RECORD_NOT_FOUND, req.t("NOTIFICATION_NOT_FOUND"));
        }
        return createSuccessResponse(notification, req.t("NOTIFICATION_DELETED_SUCCESSFULLY"));
    },

    list: async (req: Request) => {
        const result = validateUserAuth(req);

        if (!("user" in result)) {
            return createErrorResponse(
                RESPONSE_STATUS.RECORD_NOT_FOUND,
                req.t("ACCOUNT_NOT_FOUND")
            );
        }

        const options = {
            page: req.query.page || defaultPaginationConfig.page,
            limit: req.query.limit || defaultPaginationConfig.limit,
            sort: req.query.sort || { createdAt: -1 },
        };

        const query: any = { isDeleted: false };
        if (req.query.isRead !== undefined) query.isRead = req.query.isRead === "true";

        const isUser = result.user.role == ROLES.USER;

        if (isUser) {
            query.userId = result.user.id;
        } else if (req.query.userId && !isUser) {
            query.userId = req.query.userId;
        }

        const notifications = await Notification.paginate(query, options);
        return createSuccessResponse(notifications, req.t("NOTIFICATION_LIST_FETCHED_SUCCESSFULLY"));
    },
};
