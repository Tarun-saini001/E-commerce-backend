export const USER_TYPES = {
    USER: 1,
    ADMIN: 2,
} as const;

export const ROLES = {
    ADMIN: 1,
    SUBADMIN: 2,
    USER: 3,
    BUSINESS: 4
} as const;

export const JWT = {
    USER_SECRET: "USER_SECRET",
    ADMIN_SECRET: "ADMIN_SECRET",
    EXPIRES_IN: 10000,
} as const;

export const MAX_LOGIN_RETRY_LIMIT = 3;
export const LOGIN_REACTIVE_TIME = 2;

export const SEND_LOGIN_OTP = { EMAIL: 1 } as const;
export const DEFAULT_SEND_LOGIN_OTP = SEND_LOGIN_OTP.EMAIL;

export const FORGOT_PASSWORD_WITH = {
    LINK: {
        email: true,
        sms: false,
    },
    EXPIRE_TIME: "5m",
} as const;

export const NO_OF_DEVICE_ALLOWED = 1;

export const OTP_TYPE = {
    PHONE: 1,
    EMAIL: 2,
} as const;

export const OTP_FOR = {
    REGISTER: 1,
    LOGIN: 2,
    FORGOT_PASSWORD: 3,
    VERIFICATION: 4,
} as const;

export const SOCIAL_LOGIN = {
    GOOGLE: 1,
    FACEBOOK: 2
}

export const DEVICETYPE = {
    WEB: "WEB",
    ANDROID: "ANDROID",
    IOS: "IOS",
} as const;

export const GENDER = {
    MALE: 1,
    FEMALE: 2,
    OTHER: 3,
} as const;

export const MERCHANT_TYPE = {
    FREELANCER: 1,
    SALON: 2,
} as const;

export const USER_STATUS = {
    PENDING: 1,
    ACCEPTED: 2,
    REJECTED: 3,
} as const;

export const DAYS_OF_WEEK = {
    SUNDAY: 0,
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SATURDAY: 6,
} as const;

export const AVAILABILITY_TYPE = {
    RECURRING: 1,
    SPECIFIC: 2,
    EXCEPTION: 3,
} as const;

export const DOCUMENT_KIND = {
    ID: 1,
    BUSINESS: 2,
} as const;

export const DOCUMENT_TYPE = {
    GOVERNMENT_ID: 1,
    GST: 2,
    VAT: 3,
} as const;

export const DOCUMENT_STATUS = {
    PENDING: 1,
    APPROVED: 2,
    REJECTED: 3,
} as const;

export const ADDRESS_TYPE = {
    HOME: 1,
    OFFICE: 2,
    OTHER: 3,
} as const;

export const SUBSCRIPTION_TYPE = {
    MONTHLY: 1,
    YEARLY: 2,
} as const;

export const SUBSCRIPTION_STATUS = {
    ACTIVE: 1,
    INACTIVE: 2,
} as const;

export const GEOFENCE_AREA_OPTION = {
    RADIUS: 1,
    POLYGON: 2,
} as const;

export const GEOFENCE_AVAILABILITY = {
    ALWAYS: 1,
    SCHEDULED: 2,
} as const;

export const RESPONSE_STATUS = {
    SUCCESS: 1,
    FAILURE: 2,
    INTERNAL_SERVER_ERROR: 3,
    BAD_REQUEST: 3,
    RECORD_NOT_FOUND: 4,
    VALIDATION_ERROR: 5,
    UNAUTHORIZED: 6,
    ALREADY_EXISTS: 7
}
export const COMMON_STATUS = {
    PENDING: 1,
    APPROVED: 2,
    REJECTED: 3,
    PAID: 4,
    EXPIRED: 5,
    OVERDUE: 6,
    FAILED: 7,
    COMPLETED: 8,
};

export const RESPONSE_STATUS_CODE = {
    SUCCESS: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    ALREADY_EXISTS: 409,
    VALIDATION_ERROR: 422,
    INTERNAL_SERVER_ERROR: 500
}

export const RESOURCES = {
    DASHBOARD: 1,
    BANNERS: 2
}

export const ENC_CONFIG = {
    DEFAULT_VALUE: {
        APP: "anstmasr2588"
    },
    ENCRYPTION_DEV_TYPE: {
        web: "web",
        android: "android",
        ios: "ios"
    }
}

export const DIFFICULTY = {
    EASY: 1,
    MEDIUM: 2,
    HARD: 3
}

export const ATTEMPT_STATUS = {
    ACTIVE: 1,
    PAUSED: 2,
    SUBMITTED: 3,
    EXPIRED: 4,
    ABANDONED: 5
}

export const CMS_TYPE = {
    CONTACT_SUPPORT: 1,
    TERMS: 2,
    PRIVACY_POLICY: 3,
    ABOUT: 4
} as const;

export const PROFILE_STEPS = {
    PERSONAL: 1,
    PROFESSIONAL: 2,
    BANK: 3,
    DOCUMENT: 4
} as const;

export const LIST_TYPE = {
    DOCUMENTS: 1,
    SUBJECTS: 2,
    QUALIFICATIONS: 3,
    DEPARTMENTS: 4,
    INDUSTRY: 5
} as const;

export const VEHICLE_STATUS = {
    AVAILABLE: 1,
    HOLD: 2,
    SOLD: 3,
    SUBSCRIPBED: 4
}

export const VEHICLE_AVAILABILITY = {
    FOR_SALE: 1,
    SUBSCRIPTION: 2
}

export const APPLICATION_TYPE = {
    PURCHASE: 1,
    SUBSCRIPTION: 2,
    CREDIT: 3,
    TRADE_IN: 4,
    INSAURANCE: 5
}

export const BOOKING_STATUS = {
    SCHEDULED: 1,
    COMPLETED: 2,
    CANCELLED: 3,
    RESCHEDULED: 4
}

export const BOOKING_TYPE = {
    EVALUATION: 1,
    PICKUP: 2,
    DELIVERY: 3
}

export const PAYMENT_STATUS = {
    PAID: 1,
    PENDING: 2,
    FAILED: 3,
    REFUND_PROGRESS: 4,
    REFUNDED: 5,
    NON_REFUNDABLE: 6
}

export const PAYMENT_TYPE = {
    CASH: 1,
    ONLINE: 2
}

export const NOTIFICATION_TYPE = {
    SYSTEM: 1,
    TRANSACTION: 2,
    REMINDER: 3
}

export const FINANCE_TYPE = {
    DEALER: 1,
    SELF: 2
}

export const DELIVERY_TYPE = {
    PICKUP: 1,
    DELIVERY: 2
}

export const DAYS_NAME = {
    SUNDAY: 1,
    MONDAY: 2,
    TUESDAY: 3,
    WEDNESDAY: 4,
    THURSDAY: 5,
    FRIDAY: 6,
    SATURDAY: 7
}

export const SAVE_TYPE = {
    FAVORITE: 1,
    COMPARISON: 2
}

export const TIME_PERIODS = {
    DAILY: 1,
    WEEKLY: 2,
    MONTHLY: 3,
    YEARLY: 4
}

export type TIME_PERIODS = typeof TIME_PERIODS[keyof typeof TIME_PERIODS];

export const SELLING_IN = {
    FEW_DAYS: 1,
    WITHIN_MONTH: 2,
    AFTER_MONTH: 3,
    CHECKING_PRICE: 4
}

export const TRANSACTION_TYPE = {
    PURCHASE: 1,
    SUBSCRIPTION: 2
}

export const PAYMENT_METHOD = {
    CARD: 1,
    CASH: 2
}

export const APPLICATION_STATUS_TYPES = {
    DOCUMENTS: 1,
    INSURANCE: 2,
    AGREEMENT: 3
}

export const SUPPORT_STATUS = {
    OPEN: 1,
    IN_PROGRESS: 2,
    RESOLVED: 3,
    CLOSED: 4
}