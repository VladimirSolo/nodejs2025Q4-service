import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggingService } from './logging.service';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  constructor(private readonly loggingService: LoggingService) { }

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, query, body } = req;

    this.loggingService.logRequest(method, originalUrl, query, body);

    const originalSend = res.send;
    res.send = function (data) {
      res.send = originalSend;
      return res.send(data);
    };

    res.on('finish', () => {
      this.loggingService.logResponse(method, originalUrl, res.statusCode);
    });

    next();
  }
}
