import winston, { format, transports as winstonTransports } from "winston";
import path from "path";
import { Request, Response, NextFunction } from "express";

const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
} as const;

type LogLevel = keyof typeof logLevels;

const customColors: Record<LogLevel, string> = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "cyan",
  debug: "gray",
};

if (process.env.NODE_ENV !== "prod") {
  winston.addColors(customColors);
}

const logFormat = format.combine(
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  process.env.NODE_ENV === "prod"
    ? format.json()
    : format.combine(
      format.colorize({ all: true }),
      format.printf(({ level, message, timestamp }) => {
        return `${timestamp} [${level?.toUpperCase()}]: ${message}`;
      }),
    ),
);

const consoleTransport = new winstonTransports.Console({
  level: process.env.NODE_ENV === "prod" ? "warn" : "debug",
});

const logger = winston.createLogger({
  levels: logLevels,
  format: logFormat,
  transports: [consoleTransport],
  exitOnError: false,
});

const httpLogger = winston.createLogger({
  levels: logLevels,
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new winstonTransports.File({
      filename: path.join(__dirname, "../logs/http.log"),
      level: "http",
      maxsize: 10 * 1024 * 1024,
      maxFiles: 10,
    }),
  ],
});

const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const logMessage = {
    method: req.method,
    url: req.originalUrl,
    status: res.statusCode,
    userAgent: req.headers["user-agent"],
    ip: req.ip,
  };
  httpLogger.http(JSON.stringify(logMessage));
  next();
};

export { logger, requestLogger };
