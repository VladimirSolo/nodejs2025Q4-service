import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LoggingService {
  private logLevel: string;
  private logFilePath: string;
  private maxFileSize: number;
  private currentFileSize: number = 0;

  constructor() {
    this.logLevel = process.env.LOG_LEVEL || 'log';
    this.logFilePath = path.join(process.cwd(), 'logs', 'app.log');
    this.maxFileSize = parseInt(process.env.LOG_FILE_MAX_SIZE || '1024', 10);

    const logsDir = path.dirname(this.logFilePath);
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    if (fs.existsSync(this.logFilePath)) {
      const stats = fs.statSync(this.logFilePath);
      this.currentFileSize = stats.size / 1024;
    }
  }

  private shouldLog(level: string): boolean {
    const levels = ['error', 'warn', 'log', 'debug', 'verbose'];
    const currentLevelIndex = levels.indexOf(this.logLevel);
    const messageLevelIndex = levels.indexOf(level);
    return messageLevelIndex <= currentLevelIndex;
  }

  private rotateLogFile() {
    if (this.currentFileSize >= this.maxFileSize) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const rotatedPath = this.logFilePath.replace('.log', `-${timestamp}.log`);

      if (fs.existsSync(this.logFilePath)) {
        fs.renameSync(this.logFilePath, rotatedPath);
      }

      this.currentFileSize = 0;
    }
  }

  private writeLog(level: string, message: string, context?: string) {
    console.log('WRITE LOG CALLED', level, message); // Проверка вызова функции логирования
    if (!this.shouldLog(level)) {
      return;
    }

    const timestamp = new Date().toISOString();
    const contextStr = context ? `[${context}] ` : '';
    const logMessage = `${timestamp} [${level.toUpperCase()}] ${contextStr}${message}\n`;

    process.stdout.write(logMessage);

    this.rotateLogFile();
    fs.appendFileSync(this.logFilePath, logMessage);

    this.currentFileSize += Buffer.byteLength(logMessage) / 1024;
  }

  log(message: string, context?: string) {
    this.writeLog('log', message, context);
  }

  error(message: string, trace?: string, context?: string) {
    this.writeLog('error', `${message}${trace ? `\n${trace}` : ''}`, context);
  }

  warn(message: string, context?: string) {
    this.writeLog('warn', message, context);
  }

  debug(message: string, context?: string) {
    this.writeLog('debug', message, context);
  }

  verbose(message: string, context?: string) {
    this.writeLog('verbose', message, context);
  }

  logRequest(method: string, url: string, query: any, body: any) {
    const message = `Request: ${method} ${url} | Query: ${JSON.stringify(query)} | Body: ${JSON.stringify(body)}`;
    this.log(message, 'HTTP');
  }

  logResponse(method: string, url: string, statusCode: number) {
    const message = `Response: ${method} ${url} | Status: ${statusCode}`;
    this.log(message, 'HTTP');
  }
}
