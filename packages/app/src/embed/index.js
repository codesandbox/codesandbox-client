// @flow
import React from 'react';
import { render } from 'react-dom';
import requirePolyfills from '@codesandbox/common/lib/load-dynamic-polyfills';
import 'normalize.css';
import '@codesandbox/common/lib/global.css';
import track, {
  identifyOnce,
  init as initializeAmplitude,
} from '@codesandbox/common/lib/utils/analytics/amplitude';
import App from './components/App';

try {
  initializeAmplitude(window._env_?.AMPLITUDE_API_KEY);

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
