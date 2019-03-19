// @flow
import React from 'react';
import { render } from 'react-dom';
import { ThemeProvider } from 'styled-components';

import requirePolyfills from 'common/lib/load-dynamic-polyfills';
import 'normalize.css';
import 'app/split-pane.css';
import theme from 'common/lib/theme';
import 'common/lib/global.css';

import codesandbox from 'common/lib/themes/codesandbox.json';

import App from './components/App';

requirePolyfills().then(() => {
  function renderApp(Component) {
    render(
      <ThemeProvider theme={{ ...theme, ...codesandbox.colors }}>
        <Component />
      </ThemeProvider>,
      document.getElementById('root')
    );
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
