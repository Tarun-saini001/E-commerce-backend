import { RESPONSE_STATUS_CODE } from "@app/config/constants";
import { Request, Response, NextFunction } from "express";
import { ZodError, ZodSchema } from "zod";

type PropertyType = "body" | "query" | "params";

const Validator = (schema: ZodSchema, property: PropertyType = "body") => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const dataToValidate = req[property];

    try {
      schema.parse(dataToValidate);
      next();
    } catch (error: any) {
      if (error instanceof ZodError) {
        const issues = error.issues.map((issue) => {
          const path = issue.path.join(".");
          const message = issue.message;
          return {
            field: path || "root",
            message: `Validation error on ${path || "root"}: ${message}`
          };
        });

        const readableMessages = issues.map((i) => i.message);

        res.status(422).json({ message: readableMessages.length > 1 ? readableMessages : readableMessages[0], statusCode: RESPONSE_STATUS_CODE.VALIDATION_ERROR, details: issues, });
      }
    }
  };
};

export default Validator;
