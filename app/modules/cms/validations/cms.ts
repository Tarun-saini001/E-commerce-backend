import { CMS_TYPE } from "@app/config/constants";
import { z } from "zod";

export const addCms = z.object({
  email: z.string().email("Please Enter a valid email").optional(),
  phone: z.string().optional(),
  countryCode: z.string().optional(),
  termsAndConditions: z.string().optional(),
  privacyPolicy: z.string().optional(),
  aboutUs: z.string().optional(),
  type: z.nativeEnum(CMS_TYPE).optional()
});
export type AddCmsType = z.infer<typeof addCms>;

export const addFaq = z.object({
  question: z.string(),
  answer: z.string()
});
export type AddFaqType = z.infer<typeof addFaq>;

export const editFaq = z.object({
  question: z.string().optional(),
  answer: z.string().optional()
});
export type EditFaqType = z.infer<typeof editFaq>;