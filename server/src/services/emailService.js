import nodemailer from 'nodemailer';

class EmailService {
  constructor() {
    this.transporter = null;
    this.isConfigured = false;
    this.init();
  }

  init() {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

    if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
      this.transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT) || 587,
        secure: Number(SMTP_PORT) === 465,
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASS
        }
      });
      this.isConfigured = true;
    } else {
      console.log('ℹ️ SMTP is not configured. Email OTPs will be printed to the server console for local testing.');
    }
  }

  async sendOtpEmail(toEmail, otp, userName = 'there') {
    const from = process.env.SMTP_FROM || '"RentKart" <no-reply@rentkart.com>';
    const subject = `${otp} is your RentKart verification code`;

    const html = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <div style="margin-bottom: 24px; text-align: center;">
          <h1 style="color: #4f46e5; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">RentKart</h1>
          <p style="color: #64748b; margin-top: 4px; font-size: 14px;">Peer-to-Peer Rental Marketplace</p>
        </div>

        <p style="font-size: 16px; color: #1e293b; margin-bottom: 16px;">Hi <strong>${userName}</strong>,</p>
        <p style="font-size: 15px; color: #475569; line-height: 1.6; margin-bottom: 24px;">
          Thank you for joining RentKart. Please enter the 6-digit verification code below to verify your email address and activate your account:
        </p>

        <div style="text-align: center; margin: 32px 0;">
          <div style="display: inline-block; background-color: #f5f3ff; border: 2px dashed #6366f1; border-radius: 12px; padding: 16px 36px;">
            <span style="font-size: 34px; font-weight: 700; letter-spacing: 8px; color: #4338ca; font-family: monospace;">${otp}</span>
          </div>
        </div>

        <p style="font-size: 14px; color: #64748b; line-height: 1.5; margin-bottom: 12px;">
          ⏳ This code is valid for <strong>10 minutes</strong> and can only be used once.
        </p>
        <p style="font-size: 13px; color: #94a3b8; line-height: 1.5;">
          If you did not request this verification, please safely ignore this email.
        </p>

        <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 28px 0 16px 0;" />
        <p style="font-size: 12px; color: #94a3b8; text-align: center;">
          &copy; ${new Date().getFullYear()} RentKart Marketplace. All rights reserved.
        </p>
      </div>
    `;

    // Always log to terminal console in development/testing mode so users don't get blocked
    console.log(`\n=============================================================`);
    console.log(`🔑 [RentKart Verification Code]`);
    console.log(`Recipient: ${toEmail}`);
    console.log(`OTP Code:  >>> ${otp} <<< (Expires in 10 minutes)`);
    console.log(`=============================================================\n`);

    if (this.isConfigured && this.transporter) {
      try {
        await this.transporter.sendMail({
          from,
          to: toEmail,
          subject,
          html,
          text: `Hi ${userName}, your RentKart verification code is: ${otp}. It expires in 10 minutes.`
        });
      } catch (err) {
        console.error('⚠️ Failed to send email via SMTP, but OTP was logged above:', err.message);
      }
    }
  }
}

export const emailService = new EmailService();
