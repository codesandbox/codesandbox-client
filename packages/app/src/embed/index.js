// @flow
import React from 'react';
import { render } from 'react-dom';
import requirePolyfills from '@codesandbox/common/lib/load-dynamic-polyfills';
import 'normalize.css';
import '@codesandbox/common/lib/global.css';
import track, {
  identifyOnce,
  identify,
  initializeAnalytics,
} from '@codesandbox/common/lib/utils/analytics';
import { initializeExperimentStore } from '@codesandbox/ab';
import {
  getExperimentUserId,
  AB_TESTING_URL,
} from '@codesandbox/common/lib/config/env';
import App from './components/App';

initializeExperimentStore(
  AB_TESTING_URL,
  getExperimentUserId,
  async (key, value) => {
    await identify(key, value);
  }
);

try {
  initializeAnalytics({
    amplitudeApiKey: 'a205ed9b06a7baf5a594bdd30293aa80',
  });

  // If this value is not set, set it to false
  identifyOnce('signed_in', false);
} catch (e) {
  /* ignore error */
}

const trackEvent = () => {
  track('Embed Interaction');
  document.removeEventListener('click', trackEvent);
};
document.addEventListener('click', trackEvent);

requirePolyfills().then(() => {
  function renderApp(Component) {
    render(<Component />, document.getElementById('root'));
  }

  if (module.hot) {
    // $FlowIssue
    module.hot.accept('./components/App', () => {
      const NextApp = require('./components/App').default; // eslint-disable-line global-require
      renderApp(NextApp);
    });
  }

  renderApp(App);
});
