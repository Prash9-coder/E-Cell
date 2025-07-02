const mongoose = require('mongoose');

/**
 * Settings Schema
 * Stores global site settings
 */
const SettingsSchema = new mongoose.Schema({
  general: {
    siteName: {
      type: String,
      default: 'E-Cell'
    },
    siteDescription: {
      type: String,
      default: 'Entrepreneurship Cell'
    },
    contactEmail: {
      type: String,
      default: 'contact@gmail.com'
    },
    contactPhone: {
      type: String,
      default: '+91 6300472707'
    },
    address: {
      type: String,
      default: 'E-Cell Office, Main Building, College Campus'
    },
    logo: {
      type: String,
      default: '/images/logo.png'
    },
    favicon: {
      type: String,
      default: '/images/favicon.ico'
    }
  },
  social: {
    facebook: {
      type: String,
      default: 'https://facebook.com/your_ecell'
    },
    instagram: {
      type: String,
      default: 'https://instagram.com/your_ecell'
    },
    twitter: {
      type: String,
      default: 'https://twitter.com/your_ecell'
    },
    linkedin: {
      type: String,
      default: 'https://linkedin.com/company/your_ecell'
    },
    youtube: {
      type: String,
      default: 'https://youtube.com/channel/your_ecell'
    }
  },
  homepage: {
    heroTitle: {
      type: String,
      default: 'Welcome to E-Cell'
    },
    heroSubtitle: {
      type: String,
      default: 'Fostering Innovation and Entrepreneurship'
    },
    featuredEventsCount: {
      type: Number,
      default: 3
    },
    featuredStartupsCount: {
      type: Number,
      default: 4
    },
    showTestimonials: {
      type: Boolean,
      default: true
    }
  },
  footer: {
    copyrightText: {
      type: String,
      default: '© 2024 E-Cell. All rights reserved.'
    },
    showSocialLinks: {
      type: Boolean,
      default: true
    },
    showQuickLinks: {
      type: Boolean,
      default: true
    },
    showContactInfo: {
      type: Boolean,
      default: true
    }
  },
  seo: {
    metaTitle: {
      type: String,
      default: 'E-Cell - Entrepreneurship Cell'
    },
    metaDescription: {
      type: String,
      default: 'Fostering innovation and entrepreneurship among students'
    },
    ogImage: {
      type: String,
      default: '/images/og-image.jpg'
    },
    googleAnalyticsId: {
      type: String,
      default: ''
    }
  }
}, { timestamps: true });

// Create a singleton pattern for settings
// There should only be one settings document in the collection
SettingsSchema.statics.getSiteSettings = async function() {
  const settings = await this.findOne({});
  if (settings) {
    return settings;
  }
  
  // If no settings exist, create default settings
  return await this.create({});
};

const Settings = mongoose.model('Settings', SettingsSchema);

module.exports = Settings;