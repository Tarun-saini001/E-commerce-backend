import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: ".env" });

const isCompiled = __dirname.includes("dist");
const fileExt = isCompiled ? "js" : "ts";

const modulesPath = path.resolve(__dirname, `../app/modules/**/*/routes/*.${fileExt}`);
const controllersPath = path.resolve(__dirname, `../app/modules/**/*/controllers/*.${fileExt}`);
const modelsPath = path.resolve(__dirname, `../app/modules/**/*/models/*.${fileExt}`);

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "TS Template",
      version: "1.0.0",
      description: "API documentation for TS Template",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: "Local server",
      },
    ],
  },
  apis: [modulesPath, controllersPath, modelsPath],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express) => {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
