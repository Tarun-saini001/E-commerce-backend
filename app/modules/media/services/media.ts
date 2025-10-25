import { Request } from "express";
import { s3UploadFile } from "@app/utils/upload";
import { RESPONSE_STATUS } from "@app/config/constants";
import {
    createSuccessResponse,
    createErrorResponse,
} from "@app/utils/common";
export const Media = {
    Upload: async (req: Request) => {
      const file = req.file;
      if (!file) {
        return createErrorResponse(
          RESPONSE_STATUS.BAD_REQUEST,
          req.t("NO_FILE_PROVIDED"),
        );
      }
      // Upload to S3
      const result = await s3UploadFile(file.buffer, file.originalname);
      const fileUrl = `${process.env.AWS_CDN}/${result.Key}`;
      return createSuccessResponse(fileUrl, req.t("FILE_UPLOADED_SUCCESSFULLY"));
    },
  };
export default Media;