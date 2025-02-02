import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function GET(request: Request) {
  // The 'request' variable is used in the function body
  try {
    // Test Email Configuration
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false
      },
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Send test email
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.NOTIFICATION_EMAIL,
      subject: 'Test Email from Retirement Survey App',
      html: `
        <h2>Test Email</h2>
        <p>This is a test email to verify the email configuration is working correctly.</p>
        <p>Time sent: ${new Date().toLocaleString()}</p>
      `
    });

    return NextResponse.json({
      status: 'success',
      message: 'Email configuration test successful',
      details: {
        email: 'Email sent successfully'
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Test route error:', error);
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    }, { status: 500 });
  }
}