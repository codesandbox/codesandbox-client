// @flow
import React from 'react';
import { render } from 'react-dom';
import requirePolyfills from '@codesandbox/common/lib/load-dynamic-polyfills';
import 'normalize.css';
import '@codesandbox/common/lib/global.css';
import track, { identify } from '@codesandbox/common/lib/utils/analytics';
import { hasLogIn } from '@codesandbox/common/src/utils/user';
import App from './components/App';

try {
  identify('signed_in', Boolean(hasLogIn()));
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
