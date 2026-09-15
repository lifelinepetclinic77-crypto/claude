export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

export class Logger {
  private level: LogLevel;

  constructor(level: LogLevel = LogLevel.INFO) {
    this.level = level;
  }

  private log(level: LogLevel, message: string, data?: unknown) {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level}]`;

    if (data) {
      console.log(`${prefix} ${message}`, data);
    } else {
      console.log(`${prefix} ${message}`);
    }
  }

  debug(message: string, data?: unknown) {
    if (this.shouldLog(LogLevel.DEBUG)) {
      this.log(LogLevel.DEBUG, message, data);
    }
  }

  info(message: string, data?: unknown) {
    if (this.shouldLog(LogLevel.INFO)) {
      this.log(LogLevel.INFO, message, data);
    }
  }

  warn(message: string, data?: unknown) {
    if (this.shouldLog(LogLevel.WARN)) {
      this.log(LogLevel.WARN, message, data);
    }
  }

  error(message: string, error?: unknown) {
    if (this.shouldLog(LogLevel.ERROR)) {
      this.log(LogLevel.ERROR, message, error);
    }
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
    return levels.indexOf(level) >= levels.indexOf(this.level);
  }
}

export const createLogger = (level?: LogLevel) => new Logger(level);
