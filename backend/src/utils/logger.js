const fs = require("fs");
const path = require("path");
const { createLogger, format, transports } = require("winston");

const { combine, timestamp, printf, colorize, json } = format;

const logsDir = path.resolve(__dirname, "..", "..", "logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const fileFormat = combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), json());

const consoleFormat = combine(
  colorize(),
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  printf(({ timestamp: ts, level, message, ...meta }) => {
    const metaKeys = Object.keys(meta || {});
    const metaString = metaKeys.length ? ` ${JSON.stringify(meta)}` : "";
    return `${ts} ${level}: ${message}${metaString}`;
  })
);

const logger = createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: fileFormat,
  defaultMeta: { service: "vendora-backend" },
  transports: [
    new transports.File({
      filename: path.join(logsDir, "error.log"),
      level: "error",
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    new transports.File({
      filename: path.join(logsDir, "app.log"),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    new transports.Console({ format: consoleFormat }),
  ],
  exitOnError: false,
});

module.exports = logger;
