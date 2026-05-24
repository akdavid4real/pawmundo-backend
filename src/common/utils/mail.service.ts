import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter?: nodemailer.Transporter;
  private readonly isConfigured: boolean;

  constructor() {
    this.isConfigured = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

    if (!this.isConfigured) {
      const message = 'SMTP is not fully configured. Password reset emails are disabled until SMTP_HOST, SMTP_USER, and SMTP_PASS are set.';

      if (process.env.NODE_ENV === 'production') {
        throw new Error(message);
      }

      this.logger.warn(message);
      return;
    }

    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendResetPassword(email: string, token: string) {
    if (!this.transporter) {
      throw new Error('SMTP is not configured');
    }

    const frontend = process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetUrl = `${frontend}/reset-password?token=${encodeURIComponent(token)}`;

    const mailOptions = {
      from: process.env.FROM_EMAIL || 'no-reply@PawMundo.app',
      to: email,
      subject: 'PawMundo — Password reset',
      html: `
        <p>You requested a password reset. Click the link below (expires in 10 minutes):</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>If you did not request this, ignore this email.</p>
      `,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Reset email sent to ${email}: ${info.messageId}`);
      return info;
    } catch (err) {
      this.logger.error('Error sending reset email', err as any);
      throw err;
    }
  }
}
