import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import {
  DatabaseErrorNumber,
  ErrorMessages,
} from './messages/error-messages.enum';
import { ConstraintMessages } from './messages/constraint-messages.enum';

export class DatabaseExceptionFilter extends HttpException {
  private readonly logger: Logger;

  constructor(error: any) {
    let message: string;
    let status: number;

    if (error.code === DatabaseErrorNumber.DUPLICATE_KEY) {
      // Check if the constraint exists in the mapping
      message =
        error.constraint && ConstraintMessages[error.constraint]
          ? ConstraintMessages[error.constraint]
          : ErrorMessages.DATABASE_DUPLICATE_KEY;
      status = HttpStatus.CONFLICT;
    } else {
      message = ErrorMessages.DATABASE_ERROR;
      status = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    super(message, status);
    this.logger = new Logger(DatabaseExceptionFilter.name);
    this.logger.log(JSON.stringify(error));
  }
}
