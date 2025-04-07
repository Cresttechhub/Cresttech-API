export class Templates {
  private static baseTemplate(title: string, content: string) {
    return `
      <div style="
        max-width: 36rem; 
        margin: 0 auto; 
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        border: 1px solid #E5E7EB;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      ">
        <header style="
          background-color: #10B981;
          padding: 2rem; 
          color: white;
          text-align: center;
        ">
          <h1 style="margin:0; font-weight: 600; font-size: 1.5rem;">CrestTech Hub ${title}</h1>
        </header>
        
        <main style="padding: 2.5rem; line-height: 1.6; color: #374151;">
          ${content}
        </main>
        
        <footer style="
          padding: 1.5rem 2rem;
          background: #F3F4F6;
          font-size: 0.9rem;
          color: #6B7280;
          text-align: center;
          border-top: 1px solid #E5E7EB;
        ">
          <p style="margin:0 0 0.5rem 0;">
            © ${new Date().getFullYear()} CrestTech Hub. All rights reserved.
          </p>
          <p style="margin:0; font-weight: 500; color: #10B981;">
            Learn · Build · Innovate
          </p>
        </footer>
      </div>`;
  }

  static emailVerificationTemplate(otp: string, name?: string) {
    const content = `
      <p style="margin-bottom: 1.5rem;">Hi <strong>${name || 'there'}</strong>,</p>
      <p style="margin-bottom: 1.5rem;">Welcome to CrestTech Hub! Verify your account with this OTP:</p>
      
      <div style="
        background: #D1FAE5;
        color: #065F46;
        font-size: 1.75rem;
        font-weight: bold;
        text-align: center;
        padding: 1.25rem;
        margin: 2rem 0;
        border-radius: 8px;
        letter-spacing: 0.1em;
      ">
        ${otp}
      </div>
      
      <div style="
        margin: 2rem 0;
        padding: 1rem;
        background: #ECFDF5;
        border-left: 4px solid #10B981;
        border-radius: 0 4px 4px 0;
      ">
        <p style="margin: 0; color: #065F46; font-size: 0.9rem;">
          <strong>This code expires in 10 minutes.</strong><br>
          For security reasons, please don't share this code with anyone.
        </p>
      </div>
      
      <p style="margin-top: 2rem;">
        Sincerely,<br>
        <strong>The CrestTech Team</strong>
      </p>`;

    return this.baseTemplate('Verification', content);
  }

  static welcomeTemplate(name?: string) {
    const content = `
      <p style="margin-bottom: 1.5rem;">Hi <strong>${name}</strong>,</p>
      
      <div style="
        background: #ECFDF5;
        padding: 1.5rem;
        border-radius: 8px;
        margin-bottom: 2rem;
        text-align: center;
      ">
        <p style="font-size: 3rem; margin: 0 0 1rem 0;">🎉</p>
        <h2 style="margin: 0 0 1rem 0; color: #065F46;">Welcome to CrestTech Hub!</h2>
        <p style="margin: 0;">Your tech learning journey starts now!</p>
      </div>
      
      <div style="
        background: #F3F4F6;
        border-left: 4px solid #10B981;
        padding: 1.25rem;
        margin: 2rem 0;
        border-radius: 0 8px 8px 0;
      ">
        <h3 style="margin-top: 0; color: #065F46;">Get Started</h3>
        <ol style="margin: 0; padding-left: 1.25rem;">
          <li style="margin-bottom: 0.5rem;">Complete your learner profile</li>
          <li style="margin-bottom: 0.5rem;">Explore your personalized dashboard</li>
          <li style="margin-bottom: 0.5rem;">Join our student community</li>
        </ol>
      </div>
      
      <a href="[DASHBOARD_URL]" 
        style="
          display: inline-block;
          background: #10B981;
          color: white;
          padding: 0.75rem 1.5rem;
          text-decoration: none;
          border-radius: 6px;
          margin: 1.5rem 0;
          font-weight: 500;
          text-align: center;
        ">
        Go to Dashboard
      </a>
      
      <p style="margin-top: 2rem;">
        We're excited to have you onboard!<br>
        <strong>The CrestTech Team</strong>
      </p>`;

    return this.baseTemplate('Welcome', content);
  }

  static passwordResetTemplate(link: string, name?: string) {
    const content = `
      <p style="margin-bottom: 1.5rem;">Hi <strong>${name || 'there'}</strong>,</p>
      <p style="margin-bottom: 2rem;">We received a request to reset your CrestTech Hub password.</p>
      
      <div style="text-align: center; margin: 2rem 0;">
        <a href="${link}" 
          style="
            display: inline-block;
            background: #10B981;
            color: white;
            padding: 0.75rem 1.5rem;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 500;
            margin: 1rem 0;
          ">
          Reset Password
        </a>
      </div>
      
      <div style="
        margin: 2rem 0;
        padding: 1rem;
        background: #ECFDF5;
        border-left: 4px solid #10B981;
        border-radius: 0 4px 4px 0;
      ">
        <p style="margin: 0; color: #065F46; font-size: 0.9rem;">
          <strong>This link expires in 1 hour.</strong><br>
          For security reasons, please don't share this link with anyone.
        </p>
      </div>
      
      <p style="margin-top: 2rem; color: #6B7280; font-size: 0.9rem;">
        If you didn't request this, please <a href="[SECURITY_URL]" style="color: #10B981;">secure your account</a>.
      </p>`;

    return this.baseTemplate('Password Reset', content);
  }

  static enrollmentConfirmation(
    name: string,
    courseTitle: string,
    startDate: string,
  ) {
    const content = `
      <p style="margin-bottom: 1.5rem;">Hi <strong>${name}</strong>,</p>
      
      <div style="
        background: #ECFDF5;
        padding: 1.5rem;
        border-radius: 8px;
        margin-bottom: 2rem;
        text-align: center;
      ">
        <p style="font-size: 3rem; margin: 0 0 1rem 0;">✨</p>
        <h2 style="margin: 0 0 1rem 0; color: #065F46;">Enrollment Confirmed!</h2>
        <p style="margin: 0;">You're now enrolled in <strong>${courseTitle}</strong></p>
      </div>
      
      <div style="
        background: #F3F4F6;
        border: 1px solid #E5E7EB;
        border-radius: 8px;
        padding: 1.25rem;
        margin: 2rem 0;
      ">
        <h3 style="margin-top: 0; color: #065F46;">Course Details</h3>
        <p style="margin: 0.5rem 0;"><strong>Starts:</strong> ${startDate}</p>
        <p style="margin: 0.5rem 0;"><strong>Access:</strong> Available in your dashboard</p>
      </div>
      
      <div style="text-align: center; margin: 2rem 0;">
        <a href="[DASHBOARD_URL]" 
          style="
            display: inline-block;
            background: #10B981;
            color: white;
            padding: 0.75rem 1.5rem;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 500;
          ">
          View Course
        </a>
      </div>
      
      <p style="margin-top: 2rem;">
        Happy learning!<br>
        <strong>The CrestTech Team</strong>
      </p>`;

    return this.baseTemplate('Enrollment Confirmed', content);
  }
}
