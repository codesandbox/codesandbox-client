const { initializeExperimentStore } = require('@codesandbox/ab');
const {
  AB_TESTING_URL,
  getExperimentUserId,
} = require('@codesandbox/common/lib/config/env');
const analytics = require('@codesandbox/common/lib/utils/analytics');

exports.onClientEntry = () => {
  (function addDocSearch() {
    const path = `https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.css`;
    const link = document.createElement(`link`);
    link.setAttribute(`rel`, `stylesheet`);
    link.setAttribute(`type`, `text/css`);
    link.setAttribute(`href`, path);
    document.head.appendChild(link);
  })();

  /**
   * AB framework
   */
  initializeExperimentStore(
    AB_TESTING_URL,
    getExperimentUserId,
    async (key, value) => {
      await analytics.identify(key, value);
    }
  );
};

exports.onRouteUpdate = () => {
  analytics.trackPageview();
};
