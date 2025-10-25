import Cms from "../models/cms";
import Faq from "../models/faq";
import { createSuccessResponse, createErrorResponse } from "@app/utils/common";
import { RESPONSE_STATUS } from "@app/config/constants";
import { Request } from "express";
import { AddCmsType, AddFaqType, EditFaqType } from "../validations/cms";
import { CMS_TYPE } from "@app/config/constants";
import { defaultPaginationConfig } from "@app/utils/pagination";

export const CmsFaq = {
    addCms: async (req: Request) => {
        const body: AddCmsType = req.body;
        if (!body) {
            return createErrorResponse(
                RESPONSE_STATUS.BAD_REQUEST,
                req.t("MISSING_BODY_IN_REQUEST")
            );
        }
        const cms = await Cms.findOne({});
        const dataToUpdate: any = {
            email: body.email || cms.email,
            phone: body.phone || cms.phone,
            termsAndConditions: body.termsAndConditions || cms.termsAndConditions,
            privacyPolicy: body.privacyPolicy || cms.privacyPolicy,
            aboutUs: body.aboutUs || cms.aboutUs,
            countryCode: body.countryCode || cms.countryCode,
        };
        if (body.type === CMS_TYPE.CONTACT_SUPPORT) {
            dataToUpdate.contactUpdatedAt = new Date();
        } else if (body.type === CMS_TYPE.TERMS) {
            dataToUpdate.termsUpdatedAt = new Date();
        } else if (body.type === CMS_TYPE.PRIVACY_POLICY) {
            dataToUpdate.policyUpdatedAt = new Date();
        } else if (body.type === CMS_TYPE.ABOUT) {
            dataToUpdate.aboutUpdatedAt = new Date();
        }
        let updatedCms = await Cms.findOneAndUpdate(
            {},
            { $set: dataToUpdate },
            { new: true, upsert: true }
        );
        updatedCms = updatedCms.toObject();
        if (body.type === CMS_TYPE.CONTACT_SUPPORT) {
            return createSuccessResponse(updatedCms, req.t("CONTACT_SUPPORT_UPDATED_SUCCESSFULLY"));
        } else if (body.type === CMS_TYPE.TERMS) {
            return createSuccessResponse(updatedCms, req.t("TERMS_UPDATED_SUCCESSFULLY"));
        } else if (body.type === CMS_TYPE.PRIVACY_POLICY) {
            return createSuccessResponse(updatedCms, req.t("PRIVACY_POLICY_UPDATED_SUCCESSFULLY"));
        } else if (body.type === CMS_TYPE.ABOUT) {
            return createSuccessResponse(updatedCms, req.t("ABOUT_US_UPDATED_SUCCESSFULLY"));
        }
        return createSuccessResponse(updatedCms, req.t("CMS_UPDATED_SUCCESSFULLY"));
    },
    getCms: async (req: Request) => {
        const cms = await Cms.findOne({});
        if (!cms || cms.isDeleted) {
            return createErrorResponse(
                RESPONSE_STATUS.BAD_REQUEST,
                req.t("DATA_NOT_FOUND"));
        }
        return createSuccessResponse(cms, req.t("CMS_DATA_FETCHED"));
    },
    addFaq: async (req: Request) => {
        const body: AddFaqType = req.body;
        if (!body) {
            return createErrorResponse(
                RESPONSE_STATUS.BAD_REQUEST,
                req.t("MISSING_BODY_IN_REQUEST")
            );
        }
        const faq = await Faq.create(body);
        return createSuccessResponse(faq, req.t("FAQ_ADDED_SUCCESSFULLY"));
    },
    listFaq: async (req: Request) => {
        const options = {
            page: req.query.page || defaultPaginationConfig.page,
            limit: req.query.limit || defaultPaginationConfig.limit,
            sort: req.query.sort || { createdAt: -1 }
        }
        const query: any = {
            isDeleted: false
        }
        if (req.query.search) {
            query.$or = [
                { question: { $regex: req.query.search, $options: "i" } },
                { answer: { $regex: req.query.search, $options: "i" } }
            ];
        }
        const faq = await Faq.paginate(query, options);
        return createSuccessResponse(faq, req.t("FAQ_FETCHED_SUCCESSFULLY"));
    },
    getFaq: async (req: Request) => {
        const faq = await Faq.findById(req.params.id);
        return createSuccessResponse(faq, req.t("FAQ_FETCHED_SUCCESSFULLY"));
    },
    editFaq: async (req: Request) => {
        const body: EditFaqType = req.body;
        const faq = await Faq.findByIdAndUpdate(req.params.id, body, { new: true });
        return createSuccessResponse(faq, req.t("FAQ_UPDATED_SUCCESSFULLY"));
    },
    deleteFaq: async (req: Request) => {
        const faq = await Faq.findById(req.params.id);
        faq.isDeleted = true;
        faq.save();
        return createSuccessResponse({}, req.t("FAQ_DELETED_SUCCESSFULLY"));
    }
};

export default CmsFaq;