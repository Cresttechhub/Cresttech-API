import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class Templates {
  constructor(private readonly configService: ConfigService) {}

  private baseTemplate(title: string, content: string) {
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>${title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="margin-bottom: 24px;">
          <h1 style="color: #10B981; margin: 0 0 16px 0;">CrestTech Hub</h1>
          <h2 style="margin: 0 0 24px 0; font-size: 20px;">${title}</h2>
        </div>
        
        ${content}
        
        <footer style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #E5E7EB; color: #6B7280; font-size: 12px;">
          <p style="margin: 0;">© ${new Date().getFullYear()} CrestTech Hub. All rights reserved.</p>
        </footer>
      </body>
    </html>
    `;
  }

  emailVerificationTemplate(otp: string, name?: string) {
    const supportEmail = 'support@crestech.com';
    const expiryMinutes = 10;

    return this.baseTemplate(
      'Verify Your Email',
      `
      <p style="margin-bottom: 16px;">Hi <strong>${name || 'there'}</strong>,</p>
      
      <p style="margin-bottom: 24px;">
        Welcome to CrestTech Hub! Please verify your account using this one-time code:
      </p>
      
      <div style="
        background: #D1FAE5;
        color: #065F46;
        font-size: 28px;
        font-weight: bold;
        text-align: center;
        padding: 20px;
        margin: 32px 0;
        border-radius: 8px;
        letter-spacing: 8px;
      ">
        ${otp}
      </div>
      
      <div style="
        background: #ECFDF5;
        border-left: 4px solid #10B981;
        padding: 16px;
        margin: 24px 0;
        border-radius: 0 4px 4px 0;
      ">
        <p style="margin: 0; color: #065F46; font-size: 14px; line-height: 1.5;">
          <strong>⚠️ Important:</strong> This code expires in ${expiryMinutes} minutes.<br>
          Never share this code with anyone, including CrestTech staff.
        </p>
      </div>
      
      <p style="color: #6B7280; font-size: 14px; margin-top: 24px;">
        If you didn't request this, please <a href="mailto:${supportEmail}" style="color: #10B981;">contact support</a> immediately.
      </p>
      `,
    );
  }

  welcomeTemplate(name?: string) {
    const dashboardUrl = `${this.configService.get('FRONTEND_URL')}/dashboard`;
    const communityUrl = `${this.configService.get('FRONTEND_URL')}/community`;

    return this.baseTemplate(
      'Welcome to CrestTech Hub!',
      `
      <p style="margin-bottom: 16px;">Hi <strong>${name || 'new member'}</strong>,</p>
      
      <div style="
        background: #ECFDF5;
        padding: 24px;
        border-radius: 8px;
        margin-bottom: 24px;
        text-align: center;
      ">
        <p style="font-size: 48px; margin: 0 0 16px 0;">🎉</p>
        <h2 style="margin: 0 0 16px 0; color: #065F46;">Welcome to CrestTech Hub!</h2>
        <p style="margin: 0;">Your tech learning journey starts now!</p>
      </div>
      
      <div style="
        background: #F3F4F6;
        border-left: 4px solid #10B981;
        padding: 20px;
        margin: 24px 0;
        border-radius: 0 8px 8px 0;
      ">
        <h3 style="margin-top: 0; margin-bottom: 16px; color: #065F46;">Get Started</h3>
        <ol style="margin: 0; padding-left: 20px;">
          <li style="margin-bottom: 8px;">Complete your learner profile</li>
          <li style="margin-bottom: 8px;">Explore your personalized dashboard</li>
          <li style="margin-bottom: 8px;">Join our <a href="${communityUrl}" style="color: #10B981;">student community</a></li>
        </ol>
      </div>
      
      <div style="text-align: center; margin: 32px 0;">
        <a href="${dashboardUrl}" 
          style="
            display: inline-block;
            background: #10B981;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 500;
            font-size: 16px;
          ">
          Go to Dashboard
        </a>
      </div>
      
      <p style="margin-top: 24px;">
        We're excited to have you onboard!<br>
        <strong>The CrestTech Team</strong>
      </p>
      `,
    );
  }

  passwordResetTemplate(resetToken: string, name?: string) {
    const resetUrl = `${this.configService.getOrThrow('FRONTEND_URL')}/reset-password?token=${resetToken}`;
    const expiryMinutes = 15;

    return this.baseTemplate(
      'Password Reset',
      `
        <p style="margin-bottom: 1.5rem;">Hi <strong>${name || 'there'}</strong>,</p>
        <p>We received a request to reset your CrestTech Hub password.</p>
        
        <div style="text-align: center; margin: 2rem 0;">
            <a href="${resetUrl}" 
            style="
                display: inline-block;
                background: #10B981;
                color: white;
                padding: 12px 24px;
                text-decoration: none;
                border-radius: 6px;
                font-weight: 500;
                font-size: 16px;
            ">
            Reset Password
            </a>
        </div>
        
        <div style="background: #ECFDF5; border-left: 4px solid #10B981; padding: 12px; margin: 20px 0; border-radius: 0 4px 4px 0;">
            <p style="margin: 0; color: #065F46; font-size: 14px;">
            <strong>This link expires in ${expiryMinutes} minutes.</strong><br>
            For security reasons, please don't share this link.
            </p>
        </div>
        `,
    );
  }

  enrollmentConfirmation(name: string, courseTitle: string, startDate: string) {
    const dashboardUrl = `${this.configService.get('FRONTEND_URL')}/dashboard`;
    const helpCenterUrl = `${this.configService.get('FRONTEND_URL')}/help`;
    const formattedDate = new Date(startDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return this.baseTemplate(
      'Enrollment Confirmed',
      `
      <p style="margin-bottom: 16px;">Hi <strong>${name}</strong>,</p>
      
      <div style="
        background: #ECFDF5;
        padding: 24px;
        border-radius: 8px;
        margin-bottom: 24px;
        text-align: center;
      ">
        <p style="font-size: 48px; margin: 0 0 16px 0;">🎓</p>
        <h2 style="margin: 0 0 16px 0; color: #065F46;">You're Enrolled!</h2>
        <p style="margin: 0; font-size: 18px;"><strong>${courseTitle}</strong> is now in your learning dashboard.</p>
      </div>
      
      <div style="
        background: #FFFFFF;
        border: 1px solid #E5E7EB;
        border-radius: 8px;
        padding: 20px;
        margin: 24px 0;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      ">
        <h3 style="margin-top: 0; margin-bottom: 16px; color: #065F46;">Your Course Details</h3>
        
        <div style="display: flex; margin-bottom: 12px;">
          <div style="width: 80px; color: #6B7280;">Starts:</div>
          <div><strong>${formattedDate}</strong></div>
        </div>
        
        <div style="display: flex; margin-bottom: 12px;">
          <div style="width: 80px; color: #6B7280;">Access:</div>
          <div>Available immediately in your dashboard</div>
        </div>
        
        <div style="display: flex;">
          <div style="width: 80px; color: #6B7280;">Support:</div>
          <div><a href="${helpCenterUrl}" style="color: #10B981;">Visit Help Center</a></div>
        </div>
      </div>
      
      <div style="text-align: center; margin: 32px 0;">
        <a href="${dashboardUrl}" 
          style="
            display: inline-block;
            background: #10B981;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 500;
            font-size: 16px;
          ">
          Go to Dashboard
        </a>
      </div>
      
      <div style="
        background: #F9FAFB;
        border-left: 4px solid #10B981;
        padding: 16px;
        margin: 24px 0;
        border-radius: 0 4px 4px 0;
      ">
        <p style="margin: 0; color: #4B5563; font-size: 14px;">
          <strong>Pro Tip:</strong> Bookmark the course page for quick access. 
          Classes begin ${formattedDate}.
        </p>
      </div>
      
      <p style="margin-top: 24px;">
        We're excited to have you in class!<br>
        <strong>The CrestTech Team</strong>
      </p>
      `,
    );
  }
}
