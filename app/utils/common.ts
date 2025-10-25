import { Response } from "express";
import { ServiceResponse } from "../types/responses";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { JWT, RESPONSE_STATUS, ROLES, RESPONSE_STATUS_CODE } from "../config/constants";
import User from "../modules/onboarding/models/user"

dayjs.extend(duration);

export const sendResponse = (res: Response, response: ServiceResponse) => {
  if (!response.status) {
    switch (response.code) {
      case RESPONSE_STATUS.VALIDATION_ERROR:
        return res.status(422).json({ message: response.message, statusCode: RESPONSE_STATUS_CODE.VALIDATION_ERROR });
      case RESPONSE_STATUS.UNAUTHORIZED:
        return res.status(401).json({ message: response.message, statusCode: RESPONSE_STATUS_CODE.UNAUTHORIZED });
      case RESPONSE_STATUS.BAD_REQUEST:
        return res.status(400).json({ message: response.message, statusCode: RESPONSE_STATUS_CODE.BAD_REQUEST });
      case RESPONSE_STATUS.ALREADY_EXISTS:
        return res.status(409).json({ message: response.message, statusCode: RESPONSE_STATUS_CODE.ALREADY_EXISTS });
      default:
        return res.status(500).json({ message: response.message, statusCode: RESPONSE_STATUS_CODE.INTERNAL_SERVER_ERROR });
    }
  }
  return res
    .status(200)
    .json({ data: response.data, message: response.message, statusCode: RESPONSE_STATUS_CODE.SUCCESS });
};

export const getToken = (payload: object, role: number, rememberMe = false) => {
  const secret = getSecretForPlatform(role);
  return jwt.sign({ ...payload, role }, secret, { expiresIn: rememberMe ? "30d" : "7d" });
};

export const verifyToken = (token: string, role: number): any => {
  try {
    const secret = getSecretForPlatform(role);
    return jwt.verify(token, secret);
  } catch {
    return null;
  }
};

export const generateNumber = (len = 20) => {
  const chars = "0123456789";
  let out = "";
  for (let i = 0; i < len; i++)
    out += chars[Math.floor(Math.random() * chars.length)];
  return out;
};

export const hashPassword = async (pwd: string) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(pwd, salt);
};

export const comparePassword = async (pwd: string, hash: string) => {
  return bcrypt.compare(pwd, hash);
};

const unitMap: Record<string, dayjs.ManipulateType> = {
  s: "second",
  sec: "second",
  secs: "second",
  second: "second",
  seconds: "second",

  m: "minute",
  min: "minute",
  mins: "minute",
  minute: "minute",
  minutes: "minute",

  h: "hour",
  hr: "hour",
  hrs: "hour",
  hour: "hour",
  hours: "hour",

  d: "day",
  day: "day",
  days: "day",

  w: "week",
  wk: "week",
  wks: "week",
  week: "week",
  weeks: "week",

  M: "month",
  mon: "month",
  mons: "month",
  month: "month",
  months: "month",

  y: "year",
  yr: "year",
  yrs: "year",
  year: "year",
  years: "year",
};

export const getExpireDate = (tokenExpiresTime: string): Date => {
  const match = tokenExpiresTime.match(/^(\d+)([a-zA-Z]+)$/);
  if (!match) {
    throw new Error("Invalid tokenExpiresTime format");
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  const normalizedUnit = unitMap[unit.toLowerCase()];
  if (!normalizedUnit) {
    throw new Error(`Unsupported time unit: ${unit}`);
  }

  return dayjs().add(value, normalizedUnit).toDate();
};

export const isExpired = (expiredAt: Date): boolean => {
  return dayjs().isAfter(dayjs(expiredAt));
};

export const getSecretForPlatform = (role: number): string => {
  switch (role) {
    case ROLES.USER:
    case ROLES.BUSINESS:
      return JWT.USER_SECRET;
    default:
      return JWT.ADMIN_SECRET;
  }
};

export const createErrorResponse = (
  code: number,
  message: string,
  status = false,
) => ({
  status,
  code,
  message,
});

export const createSuccessResponse = (data?: any, message?: string) => ({
  status: true,
  code: RESPONSE_STATUS.SUCCESS,
  ...(data && { data }),
  ...(message && { message }),
});

export const getUserRole = async (
  email?: string,
  phone?: string,
  dialCode?: string
): Promise<number | null> => {
  if (!email && !phone) return null;
  const query: any = { isDeleted: false };
  if (email) {
    query.email = email;
    query.isEmailVerified = true;
  }
  if (phone) {
    query.phone = phone;
    if (dialCode) query.dialCode = dialCode;
    query.isPhoneVerified = true;
  }

  const user = await User.findOne(query).select("role").lean();
  return user?.role ?? null;
};

