import { plainToInstance } from 'class-transformer';
import { map } from 'rxjs/operators';
import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { SuccessResponse } from '../response.dto';

export class ResSerializerInterceptor implements NestInterceptor {
  constructor(private readonly dto: any) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((response) => {
        if (!(response instanceof SuccessResponse)) {
          return this.serializeData(response);
        }

        return new SuccessResponse(
          response.message,
          this.serializeData(response.data),
          response.statusCode,
        );
      }),
    );
  }

  private serializeData(data: any) {
    if (data === undefined || data === null) return data;

    return Array.isArray(data)
      ? data.map((item) => this.transformItem(item))
      : this.transformItem(data);
  }

  private transformItem(item: any) {
    return plainToInstance(this.dto, item, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }
}
