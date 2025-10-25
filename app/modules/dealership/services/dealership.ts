import { Request } from "express";
import { createErrorResponse, createSuccessResponse } from "@app/utils/common";
import { RESPONSE_STATUS } from "@app/config/constants";
import { buildPaginatedResponse, defaultPaginationConfig } from "@app/utils/pagination";
import { DealershipType } from "../validations/dealership";
import { Dealership } from "../models/dealership";

export const DealershipService = {
    addDealership: async (req: Request) => {
        const body: DealershipType = req.body;
        const exists = await Dealership.findOne({ name: body.name, isDeleted: false });
        if (exists) {
            return createErrorResponse(RESPONSE_STATUS.ALREADY_EXISTS, req.t("DEALERSHIP_ALREADY_EXISTS"));
        }

        const dealership = await Dealership.create(body);
        return createSuccessResponse(dealership, req.t("DEALERSHIP_ADDED_SUCCESSFULLY"));
    },

    updateDealership: async (req: Request) => {
        const body: DealershipType = req.body;
        const { id } = req.params;

        if (body.workingHours && Array.isArray(body.workingHours)) {
            await Dealership.findByIdAndUpdate(
                id,
                {
                    $set: { updatedAt: new Date() },
                    $addToSet: {
                        workingHours: {
                            $each: body.workingHours.map((wh) => ({
                                day: wh.day,
                                open: wh.open,
                                close: wh.close,
                                isClosed: wh.isClosed,
                            })),
                        },
                    },
                },
                { new: true, upsert: false }
            );
            delete body.workingHours;
        }

        const dealership = await Dealership.findByIdAndUpdate(id, body, {
            new: true,
        });

        if (!dealership) {
            return createErrorResponse(
                RESPONSE_STATUS.RECORD_NOT_FOUND,
                req.t("DEALERSHIP_NOT_FOUND")
            );
        }

        return createSuccessResponse(
            dealership,
            req.t("DEALERSHIP_UPDATED_SUCCESSFULLY")
        );
    },

    getDealership: async (req: Request) => {
        const { lat, long } = req.query;

        let dealership;

        if (lat && long) {
            const latitude = Number(lat);
            const longitude = Number(long);

            const result = await Dealership.aggregate([
                {
                    $geoNear: {
                        near: { type: "Point", coordinates: [longitude, latitude] },
                        distanceField: "distanceInMeters",
                        spherical: true,
                        query: { _id: req.params.id },
                    },
                },
                { $limit: 1 },
            ]);

            dealership = result[0];

            if (!dealership) {
                return createErrorResponse(
                    RESPONSE_STATUS.RECORD_NOT_FOUND,
                    req.t("DEALERSHIP_NOT_FOUND")
                );
            }

            dealership.distanceInKm = Number((dealership.distanceInMeters / 1000).toFixed(2));

        } else {
            dealership = await Dealership.findById(req.params.id)

            if (!dealership) {
                return createErrorResponse(
                    RESPONSE_STATUS.RECORD_NOT_FOUND,
                    req.t("DEALERSHIP_NOT_FOUND")
                );
            }
        }

        return createSuccessResponse(
            dealership,
            req.t("DEALERSHIP_FETCHED_SUCCESSFULLY")
        );
    },

    deleteDealership: async (req: Request) => {
        const dealership = await Dealership.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        if (!dealership) {
            return createErrorResponse(RESPONSE_STATUS.RECORD_NOT_FOUND, req.t("DEALERSHIP_NOT_FOUND"));
        }
        return createSuccessResponse(dealership, req.t("DEALERSHIP_DELETED_SUCCESSFULLY"));
    },

    list: async (req: Request) => {
        const page = parseInt(req.query.page as string) || defaultPaginationConfig.page;
        const limit = parseInt(req.query.limit as string) || defaultPaginationConfig.limit;
        const search = req.query.search as string;
        const sort = req.query.sort || { createdAt: -1 };

        const query: any = { isDeleted: false };

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { address: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ];
        }

        const lat = parseFloat(req.query.lat as string);
        const lng = parseFloat(req.query.lng as string);

        if (!isNaN(lat) && !isNaN(lng)) {
            const dealerships = await Dealership.aggregate([
                {
                    $geoNear: {
                        near: { type: "Point", coordinates: [lng, lat] },
                        distanceField: "distance",
                        spherical: true,
                        query,
                    },
                },
                { $sort: sort },
                { $skip: (page - 1) * limit },
                { $limit: limit },
            ]);

            const total = await Dealership.countDocuments(query);

            const data = buildPaginatedResponse(dealerships, total, page, limit);

            return createSuccessResponse(
                data,
                req.t("DEALERSHIP_LIST_FETCHED_SUCCESSFULLY")
            );
        } else {
            const options = { page, limit, sort };
            const dealerships = await Dealership.paginate(query, options);
            return createSuccessResponse(dealerships, req.t("DEALERSHIP_LIST_FETCHED_SUCCESSFULLY"));
        }
    }
}