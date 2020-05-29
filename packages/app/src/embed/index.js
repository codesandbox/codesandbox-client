import 'normalize.css';
import '@codesandbox/common/es/global.css';

import requirePolyfills from '@codesandbox/common/es/load-dynamic-polyfills';
import track, { identify } from '@codesandbox/common/es/utils/analytics';
// @flow
import React from 'react';
import { render } from 'react-dom';

import App from './components/App';

try {
  identify('signed_in', Boolean(localStorage.jwt));
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
