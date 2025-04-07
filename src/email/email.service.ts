import * as FormData from 'form-data';
import Mailgun from 'mailgun.js';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private readonly mgClient;
  private readonly senderEmail: string;
  private readonly domain: string;
  private readonly logger = new Logger(MailService.name);

  constructor(private configService: ConfigService) {
    const mailgun = new Mailgun(FormData);
    this.mgClient = mailgun.client({
      username: 'api',
      key: this.configService.getOrThrow<string>('MAILGUN_API_KEY'),
    });

    this.senderEmail = this.configService.getOrThrow<string>('SENDER_EMAIL');
    this.domain = this.configService.getOrThrow<string>('MAILGUN_DOMAIN');
  }

  async sendMail(params: {
    from?: string;
    to: string[];
    subject: string;
    html: string;
    text?: string;
  }): Promise<boolean> {
    try {
      const data = {
        // from: 'Mailgun Sandbox <postmaster@sandbox040201351b224682a32665204354e165.mailgun.org>',
        from: params.from || this.senderEmail,
        to: params.to.join(','),
        subject: params.subject,
        html: params.html,
        text: params.text || params.subject,
      };

      await this.mgClient.messages.create(this.domain, data);
      return true;
    } catch (error) {
      this.logger.error('Mailgun error:', error);
      console.log(error);
      throw new InternalServerErrorException(
        `Failed to send email: ${error.message}`,
      );
    }
  }
}
