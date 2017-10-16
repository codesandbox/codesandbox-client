import React from 'react';
import { render } from 'react-dom';
import { ThemeProvider } from 'styled-components';
import requirePolyfills from 'common/load-dynamic-polyfills';
import 'normalize.css';

import theme from '../common/theme';
import '../common/global.css';

import App from './App';

requirePolyfills().then(() => {
  function renderApp(Component) {
    render(
      <ThemeProvider theme={theme}>
        <Component />
      </ThemeProvider>,
      document.getElementById('root')
    );
  }

  if (module.hot) {
    module.hot.accept('./App', () => {
      const NextApp = require('./App').default; // eslint-disable-line global-require
      renderApp(NextApp);
    });
  }

  renderApp(App);
});
