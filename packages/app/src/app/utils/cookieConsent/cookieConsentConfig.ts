import type { CookieConsentConfig } from 'vanilla-cookieconsent';

export const cookieConsentConfig: CookieConsentConfig = {
  categories: {
    functional: {
      enabled: true,
      readOnly: true,
    },
    analytical: {},
    marketing: {},
  },

  guiOptions: {
    consentModal: {
      layout: 'box wide',
    },
  },

  language: {
    default: 'en',
    translations: {
      en: {
        consentModal: {
          title: '🍪 Yes, we use cookies',
          description:
            "This website utilizes cookies to enable essential site functionality and analytics. You may change your settings at any time or accept the default settings. You may close this banner to continue with only essential cookies.</br>Read more about this in our <a href='/legal/cookies' target='_blank'>privacy and cookie statement<a>.",
          acceptAllBtn: 'Accept all',
          acceptNecessaryBtn: 'Reject all',
          showPreferencesBtn: 'Manage preferences',
        },
        preferencesModal: {
          title: 'Cookie preferences',
          acceptAllBtn: 'Accept all',
          acceptNecessaryBtn: 'Reject all',
          savePreferencesBtn: 'Save preferences',
          closeIconLabel: 'Close',
          sections: [
            {
              title: 'Functional cookies',
              description:
                'These cookies are essential for the proper functioning of our services and cannot be disabled.',
              linkedCategory: 'functional',
            },
            {
              title: 'Analytical cookies',
              description:
                'These cookies collect information about how you use our services or potential errors you encounter. Based on this information we are able to improve your experience and react to any issues.',
              linkedCategory: 'analytical',
            },
            {
              title: 'Marketing cookies',
              description:
                'We currently do not collect cookies for marketing purposes. Though unlikely, by consenting to marketing cookies, you agree to allow us to show you advertisements relevant to you through our advertising partner in the future.',
              linkedCategory: 'marketing',
            },
            {
              title: 'Read more',
              description:
                'For more detailed information about the use of cookies across our websites, read our <a target="_blank" href="/legal/cookies">privacy and cookie statement</a>.',
            },
          ],
        },
      },
    },
  },
};
