import { Document, Types } from "mongoose";

export interface IUser extends Document {
  id: string;
  role: number;
}

interface ErrorResponse {
  code: number;
  message: string;
}

interface SuccessResponse {
  user: IUser;
  error: null;
}

export type ValidateUserAuthResponse = ErrorResponse | SuccessResponse;

interface OtpSuccess {
  success: true;
  expiresAt: Date;
  otp: string;
}

interface OtpError {
  success: false;
  status: number;
  message: string;
}

export type OtpResponse = OtpSuccess | OtpError;

export interface PaginatedResponse<T> {
  data: T[];
  paginator: {
    itemCount: number;
    perPage: number;
    pageCount: number;
    currentPage: number;
    slNo: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prev: number | null;
    next: number | null;
  };
}

