import { TIME_PERIODS } from "@app/config/constants";

export function getGroupFormat(type: TIME_PERIODS) {
    switch (type) {
        case TIME_PERIODS.DAILY:
            return { format: "%Y-%m-%d", label: "day" };
        case TIME_PERIODS.WEEKLY:
            return { format: "%Y-%U", label: "week" };
        case TIME_PERIODS.MONTHLY:
            return { format: "%Y-%m", label: "month" };
        case TIME_PERIODS.YEARLY:
            return { format: "%Y", label: "year" };
        default:
            return { format: "%Y-%m-%d", label: "day" };
    }
}