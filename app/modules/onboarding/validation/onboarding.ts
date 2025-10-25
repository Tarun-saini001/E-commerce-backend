import { z } from "zod";
import {
  DEVICETYPE,
  GENDER,
  OTP_FOR,
  SOCIAL_LOGIN,
  ROLES,
  USER_STATUS
} from "@app/config/constants";

export const sendOtp = z
  .object({
    role: z.number().optional(),
    otpType: z.nativeEnum(OTP_FOR),
    phone: z.string().regex(/^[0-9]+$/).min(8).max(15).optional(),
    email: z.string().email("Please Enter a valid email").optional(),
    countryCode: z
      .string()
      .regex(/^\+\d{1,3}$/)
      .optional(),
  })
  .refine((data) => data.phone || data.email, {
    message: "Either phone or email is required",
  });

export type SendOtpType = z.infer<typeof sendOtp>;

export const verifyOtp = z.object({
  role: z.number().optional().refine(
    (val) =>
      val === undefined ||
      ([ROLES.USER, ROLES.BUSINESS] as number[]).includes(val),
    {
      message: "Only users and business roles are allowed",
    }
  ),
  otp: z.string(),
  otpType: z.nativeEnum(OTP_FOR),
  email: z.string().email("Please Enter a valid email").optional(),
  phone: z.string().regex(/^[0-9]+$/).min(8).max(15).optional(),
  countryCode: z.string().regex(/^\+\d{1,3}$/).optional(),
  secretPin: z.string().optional(),
  password: z.string().optional(),
  deviceToken: z.string().optional(),
  deviceType: z.nativeEnum(DEVICETYPE).optional()
});

export type VerifyOtpType = z.infer<typeof verifyOtp>;

export const pointSchema = z.object({
  type: z.literal("Point"),
  coordinates: z
    .array(z.number())
    .length(2, "Coordinates must have exactly two numbers [longitude, latitude]")
});

export const addressSchema = z.object({
  line1: z.string().optional(),
  line2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  country: z.string().optional()
});

export const updateProfile = z.object({
  image: z.string().url().optional(),
  fullName: z.string().min(2).optional(),
  email: z.string().email("Please enter a valid email").optional(),
  countryCode: z.string().optional(),
  phone: z.string().optional(),
  password: z.string().optional(),
  socialId: z.string().optional(),
  socialProvider: z.nativeEnum(SOCIAL_LOGIN).optional(),
  role: z.nativeEnum(ROLES).optional(),
  profileSteps: z.number().optional(),
  dob: z.preprocess(
    (val) => (val ? new Date(val as string) : undefined),
    z.date().optional()
  ),
  isBlocked: z.boolean().optional(),
  isDeleted: z.boolean().optional(),
  isProfileComplete: z.boolean().optional(),
  isEmailVerified: z.boolean().optional(),
  isPhoneVerified: z.boolean().optional(),
  isPasswordSet: z.boolean().optional(),
  location: pointSchema.optional(),
  address: addressSchema.optional(),
  status: z.nativeEnum(USER_STATUS).optional(),
  permission: z.string().optional(),
  preferences: z.array(pointSchema).optional()
});

export type UpdateProfileType = z.infer<typeof updateProfile>;

export const changePassword = z.object({
  oldPassword: z.string().optional(),
  newPassword: z.string(),
  isResetPassword: z.boolean().optional(),
});

export type ChangePasswordType = z.infer<typeof changePassword>;

export const login = z
  .object({
    email: z.string().email("Please Enter a valid email").optional(),
    password: z.string().optional(),
    deviceToken: z.string().optional(),
    deviceType: z.nativeEnum(DEVICETYPE).optional(),
    rememberMe: z.boolean().optional(),
  })
  .refine(
    (data) => {
      if (data.email) {
        return !!data.password;
      }
      return true;
    },
    {
      message: "Password is required when email is provided",
      path: ["password"],
    }
  );

export type LoginType = z.infer<typeof login>;

export const socialLoginSchema = z.object({
  role: z.number(),
  socialId: z.string().min(1, "Social ID is required"),
  socialType: z.nativeEnum(SOCIAL_LOGIN),
  email: z.string().email("Invalid email").optional(),
  fullName: z.string().optional(),
  image: z.string().url("Invalid image URL").optional(),
  deviceToken: z.string().optional(),
  deviceType: z.nativeEnum(DEVICETYPE).optional(),
});

export type SocialLoginType = z.infer<typeof socialLoginSchema>;

export const changePasswordSchema = z.object({
  oldPassword: z
    .string()
    .min(6, "Old password must be at least 6 characters")
    .optional(),
  newPassword: z
    .string()
    .min(6, "New password must be at least 6 characters"),
  isResetPassword: z.boolean().default(false),
});

export type ChangePasswordSchemaType = z.infer<typeof changePasswordSchema>;



