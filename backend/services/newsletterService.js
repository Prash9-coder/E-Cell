import { Subscriber, Newsletter } from '../models/Newsletter.js';
import emailService from './emailService.js';
import config from '../config/index.js';

class NewsletterService {
  
  // Send welcome email to new subscriber
  async sendWelcomeEmail(subscriberEmail) {
    try {
      const welcomeEmail = emailService.generateWelcomeEmail(subscriberEmail);
      
      await emailService.sendEmail({
        to: subscriberEmail,
        subject: welcomeEmail.subject,
        text: welcomeEmail.text,
        html: welcomeEmail.html
      });

      console.log(`✅ Welcome email sent to ${subscriberEmail}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to send welcome email to ${subscriberEmail}:`, error.message);
      return false;
    }
  }

  // Send newsletter to all active subscribers
  async sendNewsletter(newsletterId) {
    try {
      // Get newsletter
      const newsletter = await Newsletter.findById(newsletterId);
      if (!newsletter) {
        throw new Error('Newsletter not found');
      }

      // Check if already sent
      if (newsletter.status === 'sent') {
        throw new Error('Newsletter has already been sent');
      }

      // Get all active subscribers
      const subscribers = await Subscriber.find({ isActive: true });
      
      if (subscribers.length === 0) {
        throw new Error('No active subscribers found');
      }

      // Update newsletter status to sending
      newsletter.status = 'sending';
      await newsletter.save();

      console.log(`📧 Starting to send newsletter "${newsletter.title}" to ${subscribers.length} subscribers`);

      // Prepare emails
      const emails = subscribers.map(subscriber => {
        const unsubscribeUrl = `${config.frontend.url}/newsletter/unsubscribe/${subscriber.unsubscribeToken}`;
        
        return {
          to: subscriber.email,
          subject: newsletter.subject,
          text: newsletter.content,
          html: emailService.generateNewsletterHTML(newsletter, unsubscribeUrl)
        };
      });

      // Send emails in batches
      const batchSize = 10; // Send 10 emails at a time
      const results = [];
      const errors = [];

      for (let i = 0; i < emails.length; i += batchSize) {
        const batch = emails.slice(i, i + batchSize);
        console.log(`📤 Sending batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(emails.length / batchSize)}`);
        
        const batchResults = await emailService.sendBulkEmails(batch);
        results.push(...batchResults.results);
        errors.push(...batchResults.errors);

        // Wait between batches to avoid rate limiting
        if (i + batchSize < emails.length) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      // Update newsletter stats and status
      newsletter.stats.totalRecipients = subscribers.length;
      newsletter.sentAt = new Date();
      newsletter.status = 'sent';
      
      // Update last email sent for subscribers
      const successfulEmails = results.filter(r => r.success).map(r => r.to);
      await Subscriber.updateMany(
        { email: { $in: successfulEmails } },
        { lastEmailSent: new Date() }
      );

      await newsletter.save();

      console.log(`✅ Newsletter sent successfully!`);
      console.log(`📊 Results: ${results.length} successful, ${errors.length} failed`);

      return {
        success: true,
        totalSent: results.length,
        totalFailed: errors.length,
        errors: errors
      };

    } catch (error) {
      console.error('❌ Failed to send newsletter:', error.message);
      
      // Update newsletter status to failed
      try {
        await Newsletter.findByIdAndUpdate(newsletterId, { 
          status: 'draft' // Reset to draft so it can be sent again
        });
      } catch (updateError) {
        console.error('Failed to update newsletter status:', updateError.message);
      }

      throw error;
    }
  }

  // Send newsletter to specific email addresses
  async sendNewsletterToEmails(newsletterId, emailAddresses) {
    try {
      const newsletter = await Newsletter.findById(newsletterId);
      if (!newsletter) {
        throw new Error('Newsletter not found');
      }

      console.log(`📧 Sending newsletter "${newsletter.title}" to ${emailAddresses.length} specific recipients`);

      const emails = emailAddresses.map(email => ({
        to: email,
        subject: newsletter.subject,
        text: newsletter.content,
        html: emailService.generateNewsletterHTML(newsletter, '#')
      }));

      const results = await emailService.sendBulkEmails(emails);

      console.log(`✅ Newsletter sent to specific recipients!`);
      console.log(`📊 Results: ${results.results.length} successful, ${results.errors.length} failed`);

      return {
        success: true,
        totalSent: results.results.length,
        totalFailed: results.errors.length,
        errors: results.errors
      };

    } catch (error) {
      console.error('❌ Failed to send newsletter to specific emails:', error.message);
      throw error;
    }
  }

  // Schedule newsletter for later sending
  async scheduleNewsletter(newsletterId, scheduledDate) {
    try {
      const newsletter = await Newsletter.findById(newsletterId);
      if (!newsletter) {
        throw new Error('Newsletter not found');
      }

      newsletter.scheduledFor = scheduledDate;
      newsletter.status = 'scheduled';
      await newsletter.save();

      console.log(`📅 Newsletter "${newsletter.title}" scheduled for ${scheduledDate}`);
      return newsletter;
    } catch (error) {
      console.error('❌ Failed to schedule newsletter:', error.message);
      throw error;
    }
  }

  // Process scheduled newsletters (to be called by a cron job)
  async processScheduledNewsletters() {
    try {
      const now = new Date();
      const scheduledNewsletters = await Newsletter.find({
        status: 'scheduled',
        scheduledFor: { $lte: now }
      });

      console.log(`📅 Found ${scheduledNewsletters.length} newsletters to send`);

      for (const newsletter of scheduledNewsletters) {
        try {
          await this.sendNewsletter(newsletter._id);
        } catch (error) {
          console.error(`Failed to send scheduled newsletter ${newsletter._id}:`, error.message);
        }
      }
    } catch (error) {
      console.error('❌ Failed to process scheduled newsletters:', error.message);
    }
  }

  // Get newsletter statistics
  async getNewsletterStats(newsletterId) {
    try {
      const newsletter = await Newsletter.findById(newsletterId);
      if (!newsletter) {
        throw new Error('Newsletter not found');
      }

      const totalSubscribers = await Subscriber.countDocuments({ isActive: true });
      
      return {
        newsletter: newsletter.title,
        status: newsletter.status,
        totalRecipients: newsletter.stats.totalRecipients,
        totalSubscribers,
        sentAt: newsletter.sentAt,
        scheduledFor: newsletter.scheduledFor,
        stats: newsletter.stats
      };
    } catch (error) {
      console.error('❌ Failed to get newsletter stats:', error.message);
      throw error;
    }
  }
}

// Create singleton instance
const newsletterService = new NewsletterService();

export default newsletterService;