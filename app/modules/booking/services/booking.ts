import { Request } from "express";
import { createErrorResponse, createSuccessResponse } from "@app/utils/common";
import { BOOKING_STATUS, RESPONSE_STATUS, ROLES } from "@app/config/constants";
import { buildPaginatedResponse, defaultPaginationConfig } from "@app/utils/pagination";
import { BookingType } from "../validations/booking";
import { Booking } from "../models/booking";
import { validateUserAuth } from "@app/modules/onboarding/services/common";
import mongoose from "mongoose";

export const BookingService = {
    addBooking: async (req: Request) => {
        const body: BookingType = req.body;

        const booking = await Booking.create(body);
        return createSuccessResponse(booking, req.t("BOOKING_CREATED_SUCCESSFULLY"));
    },

    updateBooking: async (req: Request) => {
        const body: Partial<BookingType> = req.body;
        const booking = await Booking.findByIdAndUpdate(req.params.id, body, { new: true });
        if (!booking) {
            return createErrorResponse(RESPONSE_STATUS.RECORD_NOT_FOUND, req.t("BOOKING_NOT_FOUND"));
        }
        return createSuccessResponse(booking, req.t("BOOKING_UPDATED_SUCCESSFULLY"));
    },

    getBooking: async (req: Request) => {
        const booking = await Booking.findById(req.params.id)
            .populate("userId")
            .populate("vehicleId")
            .populate("documentsId");

        if (!booking) {
            return createErrorResponse(RESPONSE_STATUS.RECORD_NOT_FOUND, req.t("BOOKING_NOT_FOUND"));
        }
        return createSuccessResponse(booking, req.t("BOOKING_FETCHED_SUCCESSFULLY"));
    },

    deleteBooking: async (req: Request) => {
        const booking = await Booking.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        if (!booking) {
            return createErrorResponse(RESPONSE_STATUS.RECORD_NOT_FOUND, req.t("BOOKING_NOT_FOUND"));
        }
        return createSuccessResponse(booking, req.t("BOOKING_DELETED_SUCCESSFULLY"));
    },

    list: async (req: Request) => {
        const result = validateUserAuth(req);

        if (!("user" in result)) {
            return createErrorResponse(
                RESPONSE_STATUS.RECORD_NOT_FOUND,
                req.t("ACCOUNT_NOT_FOUND")
            );
        }

        const page = Number(req.query.page) || defaultPaginationConfig.page;
        const limit = Number(req.query.limit) || defaultPaginationConfig.limit;
        const sort = req.query.sort ? JSON.parse(String(req.query.sort)) : { createdAt: -1 };

        const isUser = result.user.role == ROLES.USER;

        const pipeline: any[] = [
            { $match: { isDeleted: false } }
        ];

        if (isUser) {
            pipeline.push({ $match: { userId: new mongoose.Types.ObjectId(result.user.id) } });
        } else if (req.query.userId) {
            pipeline.push({ $match: { userId: new mongoose.Types.ObjectId(String(req.query.userId)) } });
        }

        if (req.query.vehicleId) {
            const vehicleId =
                Array.isArray(req.query.vehicleId)
                    ? req.query.vehicleId[0]
                    : req.query.vehicleId;
            pipeline.push({ $match: { vehicleId: new mongoose.Types.ObjectId(String(vehicleId)) } });
        }
        if (req.query.type) pipeline.push({ $match: { type: req.query.type } });
        if (req.query.status) pipeline.push({ $match: { status: req.query.status } });

        pipeline.push(
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },

            {
                $lookup: {
                    from: "vehicles",
                    localField: "vehicleId",
                    foreignField: "_id",
                    as: "vehicle"
                }
            },
            { $unwind: { path: "$vehicle", preserveNullAndEmptyArrays: true } },

            {
                $lookup: {
                    from: "documents",
                    localField: "documentsId",
                    foreignField: "_id",
                    as: "documents"
                }
            }
        );

        if (req.query.search) {
            const searchRegex = new RegExp(String(req.query.search), "i");
            pipeline.push({
                $match: {
                    $or: [
                        { "vehicle.name": searchRegex },
                        { "vehicle.model": searchRegex },
                        { "documents.title": searchRegex },
                        { "documents.number": searchRegex },
                    ],
                },
            });
        }

        if (req.query.lat && req.query.long) {
            const latitude = Number(req.query.lat);
            const longitude = Number(req.query.long);

            pipeline.unshift({
                $geoNear: {
                    near: { type: "Point", coordinates: [longitude, latitude] },
                    distanceField: "distanceInMeters",
                    spherical: true,
                },
            });

            pipeline.push({
                $addFields: {
                    distanceInKm: { $round: [{ $divide: ["$distanceInMeters", 1000] }, 2] },
                },
            });
        }

        pipeline.push({ $sort: sort });

        pipeline.push(
            { $skip: (page - 1) * limit },
            { $limit: limit }
        );

        const bookings = await Booking.aggregate(pipeline);

        const countPipeline = [...pipeline];
        countPipeline.pop();
        countPipeline.pop();
        countPipeline.push({ $count: "total" });
        const countResult = await Booking.aggregate(countPipeline);
        const total = countResult[0]?.total || 0;

        const data = buildPaginatedResponse(bookings, total, page, limit);

        return createSuccessResponse(
            data,
            req.t("BOOKING_LIST_FETCHED_SUCCESSFULLY")
        );
    },
};
