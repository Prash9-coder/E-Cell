import nodemailer from 'nodemailer';
import config from '../config/index.js';

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  async initializeTransporter() {
    try {
      // Create transporter based on configuration
      if (config.email.service) {
        // Use service-based configuration (Gmail, Outlook, etc.)
        this.transporter = nodemailer.createTransporter({
          service: config.email.service,
          auth: {
            user: config.email.auth.user,
            pass: config.email.auth.pass
          }
        });
      } else {
        // Use SMTP configuration
        this.transporter = nodemailer.createTransporter({
          host: config.email.host,
          port: config.email.port,
          secure: config.email.secure,
          auth: {
            user: config.email.auth.user,
            pass: config.email.auth.pass
          }
        });
      }

      // Verify connection
      await this.transporter.verify();
      console.log('✅ Email service initialized successfully');
    } catch (error) {
      console.error('❌ Email service initialization failed:', error.message);
      this.transporter = null;
    }
  }

  async sendEmail({ to, subject, text, html, attachments = [] }) {
    if (!this.transporter) {
      throw new Error('Email service not initialized');
    }

    try {
      const mailOptions = {
        from: config.email.from,
        to: Array.isArray(to) ? to.join(', ') : to,
        subject,
        text,
        html,
        attachments
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully:', result.messageId);
      return result;
    } catch (error) {
      console.error('❌ Failed to send email:', error.message);
      throw error;
    }
  }

  async sendBulkEmails(emails) {
    if (!this.transporter) {
      throw new Error('Email service not initialized');
    }

    const results = [];
    const errors = [];

    for (const emailData of emails) {
      try {
        const result = await this.sendEmail(emailData);
        results.push({ success: true, messageId: result.messageId, to: emailData.to });
        
        // Add delay between emails to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Failed to send email to ${emailData.to}:`, error.message);
        errors.push({ success: false, error: error.message, to: emailData.to });
      }
    }

    return { results, errors };
  }

  // Newsletter-specific templates
  generateNewsletterHTML(newsletter, unsubscribeUrl) {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${newsletter.subject}</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
          }
          .container {
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #0284c7;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 28px;
            font-weight: bold;
            color: #0284c7;
            margin-bottom: 10px;
          }
          .title {
            color: #0284c7;
            font-size: 24px;
            margin-bottom: 20px;
          }
          .content {
            margin-bottom: 30px;
          }
          .footer {
            border-top: 1px solid #eee;
            padding-top: 20px;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
          .unsubscribe {
            color: #999;
            text-decoration: none;
          }
          .unsubscribe:hover {
            color: #0284c7;
          }
          .social-links {
            margin: 20px 0;
          }
          .social-links a {
            display: inline-block;
            margin: 0 10px;
            color: #0284c7;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">E-Cell</div>
            <p>Entrepreneurship Cell Newsletter</p>
          </div>
          
          <h1 class="title">${newsletter.title}</h1>
          
          <div class="content">
            ${newsletter.htmlContent || newsletter.content.replace(/\n/g, '<br>')}
          </div>
          
          ${newsletter.featuredImage ? `<img src="${newsletter.featuredImage}" alt="Featured Image" style="max-width: 100%; height: auto; border-radius: 5px; margin: 20px 0;">` : ''}
          
          <div class="footer">
            <div class="social-links">
              <a href="${config.social?.facebook || '#'}">Facebook</a>
              <a href="${config.social?.instagram || '#'}">Instagram</a>
              <a href="${config.social?.linkedin || '#'}">LinkedIn</a>
            </div>
            
            <p>
              You're receiving this email because you subscribed to our newsletter.<br>
              <a href="${unsubscribeUrl}" class="unsubscribe">Unsubscribe</a> | 
              <a href="mailto:${config.email.auth.user}" class="unsubscribe">Contact Us</a>
            </p>
            
            <p>
              © ${new Date().getFullYear()} E-Cell. All rights reserved.<br>
              Entrepreneurship Cell
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  generateWelcomeEmail(subscriberEmail) {
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to E-Cell Newsletter</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
          }
          .container {
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #0284c7;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 28px;
            font-weight: bold;
            color: #0284c7;
            margin-bottom: 10px;
          }
          .welcome-title {
            color: #0284c7;
            font-size: 24px;
            margin-bottom: 20px;
          }
          .content {
            margin-bottom: 30px;
          }
          .footer {
            border-top: 1px solid #eee;
            padding-top: 20px;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">E-Cell</div>
            <p>Entrepreneurship Cell</p>
          </div>
          
          <h1 class="welcome-title">Welcome to Our Newsletter! 🎉</h1>
          
          <div class="content">
            <p>Hi there!</p>
            
            <p>Thank you for subscribing to the E-Cell newsletter! We're excited to have you join our community of entrepreneurs, innovators, and changemakers.</p>
            
            <p>Here's what you can expect from our newsletter:</p>
            <ul>
              <li>📅 Updates on upcoming events and workshops</li>
              <li>🚀 Success stories from our startup community</li>
              <li>💡 Entrepreneurship tips and insights</li>
              <li>🎯 Exclusive opportunities and resources</li>
              <li>📰 Latest news from the entrepreneurship world</li>
            </ul>
            
            <p>We typically send newsletters weekly, and we promise to keep the content valuable and relevant to your entrepreneurial journey.</p>
            
            <p>If you have any questions or suggestions, feel free to reach out to us at <a href="mailto:${config.email.auth.user}">${config.email.auth.user}</a></p>
            
            <p>Welcome aboard! 🚀</p>
            
            <p>Best regards,<br>The E-Cell Team</p>
          </div>
          
          <div class="footer">
            <p>
              © ${new Date().getFullYear()} E-Cell. All rights reserved.<br>
              Entrepreneurship Cell
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    return {
      subject: 'Welcome to E-Cell Newsletter! 🎉',
      html,
      text: `Welcome to E-Cell Newsletter!

Thank you for subscribing to our newsletter! We're excited to have you join our community of entrepreneurs, innovators, and changemakers.

Here's what you can expect:
- Updates on upcoming events and workshops
- Success stories from our startup community  
- Entrepreneurship tips and insights
- Exclusive opportunities and resources
- Latest news from the entrepreneurship world

Welcome aboard!

Best regards,
The E-Cell Team`
    };
  }
}

// Create singleton instance
const emailService = new EmailService();

export default emailService;