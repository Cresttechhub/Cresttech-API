import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly transporter;
  private readonly senderEmail: string;
  private readonly logger = new Logger(MailService.name);

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.getOrThrow<string>('SMTP_HOST'),
      port: this.configService.getOrThrow<number>('SMTP_PORT'), // 465 for SSL, 587 for TLS
      secure: true, // true for 465, false for other ports
      auth: {
        user: this.configService.getOrThrow<string>('SMTP_USERNAME'),
        pass: this.configService.getOrThrow<string>('SMTP_PASSWORD'),
      },
    });

    this.senderEmail = this.configService.getOrThrow<string>('SENDER_EMAIL');
  }

  async sendMail(params: {
    from?: string;
    to: string[];
    subject: string;
    html: string;
    text?: string;
  }): Promise<boolean> {
    try {
      const mailOptions = {
        from:
          params.from ||
          `"${this.configService.get('SENDER_NAME', 'CrestTech Hub')}" <${this.senderEmail}>`,
        to: params.to.join(','),
        subject: params.subject,
        html: params.html,
        text: params.text || params.subject.replace(/<[^>]*>/g, ''),
      };

      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent: ${info.messageId}`);
      return true;
    } catch (error) {
      this.logger.error('Email sending failed:', error);
      throw new InternalServerErrorException(
        `Failed to send email: ${error.message}`,
      );
    }
  }
}

// import * as FormData from 'form-data';
// import Mailgun from 'mailgun.js';
// import {
//   Injectable,
//   InternalServerErrorException,
//   Logger,
// } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';

// @Injectable()
// export class MailService {
//   private readonly mgClient;
//   private readonly senderEmail: string;
//   private readonly domain: string;
//   private readonly logger = new Logger(MailService.name);

//   constructor(private configService: ConfigService) {
//     const mailgun = new Mailgun(FormData);
//     this.mgClient = mailgun.client({
//       username: 'api',
//       key: this.configService.getOrThrow<string>('MAILGUN_API_KEY'),
//     });

//     this.senderEmail = this.configService.getOrThrow<string>('SENDER_EMAIL');
//     this.domain = this.configService.getOrThrow<string>('MAILGUN_DOMAIN');
//   }

//   async sendMail(params: {
//     from?: string;
//     to: string[];
//     subject: string;
//     html: string;
//     text?: string;
//   }): Promise<boolean> {
//     try {
//       const data = {
//         // from: 'Mailgun Sandbox <postmaster@sandbox040201351b224682a32665204354e165.mailgun.org>',
//         from: params.from || this.senderEmail,
//         to: params.to.join(','),
//         subject: params.subject,
//         html: params.html,
//         text: params.text || params.subject,
//       };

//       await this.mgClient.messages.create(this.domain, data);
//       return true;
//     } catch (error) {
//       this.logger.error('Mailgun error:', error);
//       console.log(error);
//       throw new InternalServerErrorException(
//         `Failed to send email: ${error.message}`,
//       );
//     }
//   }
// }
