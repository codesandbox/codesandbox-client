import React from 'react';
import { AppContainer } from 'react-hot-loader';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';

import App from './pages/index';
import './global.css';
import createStore from './store';
import theme from '../common/theme';

const rootEl = document.getElementById('root');

const store = createStore;
const renderApp = (RootComponent) => {
  render(
    <AppContainer>
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <RootComponent
            store={store}
          />
        </Provider>
      </ThemeProvider>
    </AppContainer>,
    rootEl,
  );
};

renderApp(App);

if (module.hot) {
  module.hot.accept('./pages/index', () => {
    const NextApp = require('./pages/index').default; // eslint-disable-line global-require
    renderApp(NextApp);
  });
}
