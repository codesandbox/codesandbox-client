import React from 'react';
import { AppContainer } from 'react-hot-loader';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import App from './pages/index';
import createStore from './store';

const rootEl = document.getElementById('root');

const store = createStore;
const renderApp = (RootComponent) => {
  render(
    <AppContainer>
      <Provider store={store}>
        <RootComponent
          store={store}
        />
      </Provider>
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
