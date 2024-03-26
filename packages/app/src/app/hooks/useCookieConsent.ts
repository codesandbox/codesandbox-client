import { useEffect } from 'react';
import * as CookieConsent from 'vanilla-cookieconsent';
import {
  init as initAmplitude,
  setOptOut,
} from '@codesandbox/common/lib/utils/analytics/amplitude';
import { cookieConsentConfig } from '../utils/cookieConsent/cookieConsentConfig';

export const useCookieConsent = (amplitudeApiKey: string) => {
  let isRenderedInIframe;
  try {
    isRenderedInIframe = window.self !== window.top;
  } catch (e) {
    isRenderedInIframe = true;
  }

  const handleCookieConsent = (cookie: CookieConsent.CookieValue) => {
    const allowAnalytics = cookie?.categories?.includes('analytical') || false;
    if (allowAnalytics) {
      initAmplitude(amplitudeApiKey);
    }

    setOptOut(!allowAnalytics);
  };

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      return;
    }

    if (isRenderedInIframe) {
      return;
    }

    CookieConsent.run({
      onFirstConsent: ({ cookie }) => {
        handleCookieConsent(cookie);
      },
      onChange: ({ cookie }) => {
        handleCookieConsent(cookie);
      },
      ...cookieConsentConfig,
    });

    const cookieConsent = CookieConsent.getCookie();
    handleCookieConsent(cookieConsent);
  }, []);
};
