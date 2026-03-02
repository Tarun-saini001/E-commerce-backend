import express from "express";
import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });
import cors from "cors";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import routes from "./modules/index";
import { initI18n } from "./utils/i18n";
import { logger, requestLogger } from "./utils/logger";
import { checkPortal } from "./middleware/checkHeaders";
import connectDB from "./config/db";
import helmet from "helmet";
import { decryptInput } from "./utils/encryption";
import { errorHandler } from "./middleware/error";
import { seedData } from "./utils/seed";
// import { setupSwagger } from "docs/swagger";


const app = express();

const corsOptions = {
  origin: process.env.ALLOW_ORIGIN || "*",
};

const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 1000,
  message: "Rate limit exceeded, please try again after 1 minutes",
  skip: (req: express.Request) => {
    if (req.url.includes("/swagger") || req.url.includes("/favicon")) {
      return true;
    } else {
      return false;
    }
  },
});

app.use(helmet());//for secure methods
app.use(rateLimiter);
app.use(checkPortal);//identify  admin request or user request
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
// setupSwagger(app);

if (process.env.NODE_ENV === "prod") {
  app.use(requestLogger);
}

if (process.env.NODE_ENV === "dev") {
  seedData()
}

app.use(
  morgan("combined", {// logs simplification
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  }),
);

initI18n().then((i18nMiddleware) => {//language translation
  app.use(i18nMiddleware);
  app.use(decryptInput);
  app.use(routes);
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../app/views"));

app.get("/", (req, res) => {
  res.render("index");
});

app.use(errorHandler)

connectDB();

export default app;
