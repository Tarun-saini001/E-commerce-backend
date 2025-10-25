import Setting from "../models/settings";
import { createSuccessResponse, createErrorResponse } from "@app/utils/common";
import { RESPONSE_STATUS } from "@app/config/constants";
import { Request } from "express";
import { SettingsType } from "../validations/settings";

export const Settings = {

    addSettings: async (req: Request) => {
        const body: SettingsType = req.body;
        if (!body) {
            return createErrorResponse(
                RESPONSE_STATUS.BAD_REQUEST,
                req.t("MISSING_BODY_IN_REQUEST")
            );
        }
        const settings = await Setting.findOneAndUpdate(
            {},
            { $set: body },
            { upsert: true, new: true }
        );
        return createSuccessResponse(settings, req.t("SETTINGS_UPDATED_SUCCESSFULLY"));
    },

    getSettings: async (req: Request) => {
        const settings = await Setting.findOne({});
        return createSuccessResponse(settings, req.t("SETTINGS_FETCHED_SUCCESSFULLY"));
    },
};

export default Settings;