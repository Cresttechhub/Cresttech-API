// // password-reset/tasks/cleanup.tokens.task.ts
// import { Injectable, Logger } from '@nestjs/common';
// import { Cron, CronExpression } from '@nestjs/schedule';
// import { PasswordResetService } from '../password-reset.service';

// @Injectable()
// export class CleanupTokensTask {
//   private readonly logger = new Logger(CleanupTokensTask.name);

//   constructor(private readonly passwordResetService: PasswordResetService) {}

//   @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
//   async handleCleanup() {
//     this.logger.log('Cleaning up expired password reset tokens...');
//     await this.passwordResetService.cleanupExpiredTokens();
//     this.logger.log('Expired password reset tokens cleaned up');
//   }
// }
