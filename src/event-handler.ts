import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MailService } from './email/email.service';
import { EMAIL_VERIFIED, PASSWORD_RESET, SIGNUP_OTP } from './shared';
import { Templates } from './email/templates/templates';

@Injectable()
export class EventHandler {
  constructor(
    private readonly mailService: MailService,
    private readonly templates: Templates,
  ) {}

  @OnEvent(SIGNUP_OTP)
  async handleSignupOTP(payload: {
    email: string;
    fullName: string;
    otp: string;
  }) {
    await this.mailService.sendMail({
      to: [payload.email],
      subject: 'Verify Your Account',
      html: this.templates.emailVerificationTemplate(
        payload.otp,
        payload.fullName,
      ),
    });
  }

  @OnEvent(EMAIL_VERIFIED)
  async welcomeMessage(payload: { name: string; email: string }) {
    await this.mailService.sendMail({
      to: [payload.email],
      subject: 'Welcome To CrestTech Hub',
      html: this.templates.welcomeTemplate(payload.name),
    });
  }

  @OnEvent(PASSWORD_RESET)
  async passwordReset(payload: {
    email: string;
    resetToken: string;
    name: string;
  }) {
    await this.mailService.sendMail({
      to: [payload.email],
      subject: 'Password Reset Request',
      html: this.templates.passwordResetTemplate(
        payload.resetToken,
        payload.name,
      ),
    });
  }
}
