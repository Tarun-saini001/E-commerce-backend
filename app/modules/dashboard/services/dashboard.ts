import { APPLICATION_TYPE, BOOKING_STATUS, COMMON_STATUS, TIME_PERIODS, VEHICLE_STATUS } from "@app/config/constants";
import { Application } from "@app/modules/applications/models/application";
import { Booking } from "@app/modules/booking/models/booking";
import User from "@app/modules/onboarding/models/user";
import Vehicle from "@app/modules/vehicles/models/vehicles";
import { createSuccessResponse } from "@app/utils/common";
import { Request } from "express";
import { getGroupFormat } from "./graphs";
import { SubscriptionPlan } from "@app/modules/subscriptionPlan/models/subscriptions";

export const DashboardService = {
    getCounts: async (req: Request) => {
        const users = await User.countDocuments({ isDeleted: false });
        const inventory = await Vehicle.countDocuments({ isDeleted: false });
        const pendingApprovals = await Application.countDocuments({ status: COMMON_STATUS.PENDING, isDeleted: false });
        const vehiclesReserved = await Application.countDocuments({ status: VEHICLE_STATUS.HOLD, isDeleted: false });
        const upcomingDeliveries = await Booking.countDocuments({ status: BOOKING_STATUS.SCHEDULED, isDeleted: false });
        const purchaseBookings = await Booking.countDocuments({ isDeleted: false, bookingType: APPLICATION_TYPE.PURCHASE });
        const subscriptionBookings = await Booking.countDocuments({ isDeleted: false, bookingType: APPLICATION_TYPE.SUBSCRIPTION });
        const ratio = purchaseBookings + subscriptionBookings === 0 ? 0 : (purchaseBookings / (purchaseBookings + subscriptionBookings)) * 100;

        return createSuccessResponse({ users, inventory, pendingApprovals, vehiclesReserved, upcomingDeliveries, ratio }, req.t("COUNTS_FETCHED_SUCCESSFULLY"));

    },

    getGraphs: async (req: Request) => {
        const type: TIME_PERIODS = (req.query.type as any) || TIME_PERIODS.DAILY;
        const { format, label } = getGroupFormat(type);

        const vehiclesReserved = await Application.aggregate([
            { $match: { status: VEHICLE_STATUS.HOLD, isDeleted: false } },
            {
                $group: {
                    _id: { $dateToString: { format, date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        const sales = await Booking.aggregate([
            { $match: { isDeleted: false } },
            {
                $group: {
                    _id: { $dateToString: { format, date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        const subscriptions = await SubscriptionPlan.aggregate([
            { $match: { isDeleted: false } },
            {
                $group: {
                    _id: { $dateToString: { format, date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        return createSuccessResponse(
            {
                vehiclesReserved,
                sales,
                subscriptions
            },
            req.t("GRAPHS_FETCHED_SUCCESSFULLY")
        );
    },
}

