import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MailService } from './email/email.service';
import { EMAIL_VERIFIED, SIGNUP_OTP } from './shared';
import { Templates } from './email/templates/templates';

@Injectable()
export class EventHandler {
  constructor(private readonly mailService: MailService) {}

  @OnEvent(SIGNUP_OTP)
  async handleSignupOTP(payload: {
    email: string;
    fullName: string;
    otp: string;
  }) {
    await this.mailService.sendMail({
      to: [payload.email],
      subject: 'Verify Your Account',
      html: Templates.emailVerificationTemplate(payload.otp, payload.fullName),
    });
  }

  @OnEvent(EMAIL_VERIFIED)
  async welcomeMessage(payload: { name: string; email: string }) {
    await this.mailService.sendMail({
      to: [payload.email],
      subject: 'Welcome To CrestTech Hub',
      html: Templates.welcomeTemplate(payload.name),
    });
  }
}
