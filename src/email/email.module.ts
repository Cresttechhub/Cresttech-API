import { Module } from '@nestjs/common';
import { MailService } from './email.service';

@Module({
  controllers: [],
  providers: [MailService],
})
export class EmailModule {}
