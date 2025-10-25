import { ATTEMPT_STATUS } from "@app/config/constants";
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

export interface SubjectBreakdown {
  subject: string
  correct: number
  incorrect: number
  notAttempted: number
  pointsEarned: number
  pointsPossible: number
  timeSpentSec: number
}

export interface TopicBreakdown {
  topic: string
  correct: number
  incorrect: number
  notAttempted: number
  pointsEarned: number
  pointsPossible: number
  timeSpentSec: number
}

export interface AttemptAnalytics {
  totalQuestions: number
  correct: number
  incorrect: number
  notAttempted: number
  scorePercent: number
  timeSpentSec: number
  subjectBreakdown: SubjectBreakdown[]
  topicBreakdown: TopicBreakdown[]
}

export interface IAttemptQuestion {
  questionId: Types.ObjectId
  selectedOptionIndex?: number
  startedAt?: Date
  answeredAt?: Date
  timeSpentSec: number
  isCorrect?: boolean
}

export interface IAttempt {
  _id: Types.ObjectId
  userId: Types.ObjectId
  practiceSetId: Types.ObjectId
  reattemptIndex: number
  status: number
  startedAt: Date
  pausedAt?: Date
  submittedAt?: Date
  expiresAt: Date
  timeLimitSec: number
  timePerQuestionSec: number
  timeUsedSec: number
  questions: IAttemptQuestion[]
  analytics?: AttemptAnalytics
  createdAt: Date
  updatedAt: Date
}

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

