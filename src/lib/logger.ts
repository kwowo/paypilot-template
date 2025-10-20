type LogLevel = "info" | "warn" | "error";

interface LogContext {
  event: string;
  userId?: string;
  orderId?: string;
  productId?: string;
  ip?: string;
  userAgent?: string;
  [key: string]: unknown;
}

class Logger {
  private log(level: LogLevel, context: LogContext, message: string) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...context,
    };

    const isProduction = typeof process !== "undefined" && process.env.NODE_ENV === "production";

    // Use console.error for all logs to ensure visibility in Next.js Turbo mode
    // stderr is less likely to be buffered than stdout
    if (isProduction) {
      console.error(JSON.stringify(logEntry));
    } else {
      // More visible format for development
      const levelEmoji = level === "error" ? "❌" : level === "warn" ? "⚠️" : "ℹ️";
      console.error(
        `${levelEmoji} [${timestamp}] [${level.toUpperCase()}] ${message}`,
        context
      );
    }
  }

  info(context: LogContext, message: string) {
    this.log("info", context, message);
  }

  warn(context: LogContext, message: string) {
    this.log("warn", context, message);
  }

  error(context: LogContext, message: string) {
    this.log("error", context, message);
  }
}

export const logger = new Logger();
