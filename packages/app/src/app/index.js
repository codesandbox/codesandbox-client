import React from 'react';
import { AppContainer } from 'react-hot-loader';
import { render } from 'react-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { ConnectedRouter } from 'react-router-redux';
import registerServiceWorker from 'common/registerServiceWorker';
import requirePolyfills from 'common/load-dynamic-polyfills';
import 'normalize.css';
import notificationActions from 'app/store/notifications/actions';
import 'common/global.css';
import theme from 'common/theme';
import { Provider } from 'mobx-react';
import controller from './controller';

import App from './pages/index';
import './split-pane.css';
import createStore from './store';
import logError from './utils/error';
import history from './utils/history';

if (process.env.NODE_ENV === 'production') {
  try {
    Raven.config('https://3943f94c73b44cf5bb2302a72d52e7b8@sentry.io/155188', {
      release: VERSION,
      ignoreErrors: [
        // Random plugins/extensions
        'top.GLOBALS',
        // See: http://blog.errorception.com/2012/03/tale-of-unfindable-js-error. html
        'originalCreateNotification',
        'canvas.contentDocument',
        'MyApp_RemoveAllHighlights',
        'http://tt.epicplay.com',
        "Can't find variable: ZiteReader",
        'jigsaw is not defined',
        'ComboSearch is not defined',
        'http://loading.retry.widdit.com/',
        'atomicFindClose',
        // Facebook borked
        'fb_xd_fragment',
        // ISP "optimizing" proxy - `Cache-Control: no-transform` seems to
        // reduce this. (thanks @acdha)
        // See http://stackoverflow.com/questions/4113268
        'bmi_SafeAddOnload',
        'EBCallBackMessageReceived',
        // See http://toolbar.conduit.com/Developer/HtmlAndGadget/Methods/JSInjection.aspx
        'conduitPage',
      ],
      ignoreUrls: [
        // Facebook flakiness
        /graph\.facebook\.com/i,
        // Facebook blocked
        /connect\.facebook\.net\/en_US\/all\.js/i,
        // Woopra flakiness
        /eatdifferent\.com\.woopra-ns\.com/i,
        /static\.woopra\.com\/js\/woopra\.js/i,
        // Chrome extensions
        /extensions\//i,
        /^chrome:\/\//i,
        // Other plugins
        /127\.0\.0\.1:4001\/isrunning/i, // Cacaoweb
        /webappstoolbarba\.texthelp\.com\//i,
        /metrics\.itunes\.apple\.com\.edgesuite\.net\//i,
      ],
    }).install();
  } catch (error) {
    console.error(error);
  }
}

requirePolyfills().then(() => {
  const rootEl = document.getElementById('root');

  const store = createStore(history);

  const showNotification = (message, type) =>
    store.dispatch(notificationActions.addNotification(message, type));

  registerServiceWorker('/service-worker.js', showNotification);

  const renderApp = RootComponent => {
    try {
      render(
        <Provider {...controller.provide()}>
          <AppContainer>
            <ThemeProvider theme={theme}>
              <ReduxProvider store={store}>
                <ConnectedRouter history={history}>
                  <RootComponent />
                </ConnectedRouter>
              </ReduxProvider>
            </ThemeProvider>
          </AppContainer>
        </Provider>,
        rootEl
      );
    } catch (e) {
      logError(e);
    }
  };

  renderApp(App);

  if (module.hot) {
    module.hot.accept('./pages/index', () => {
      const NextApp = require('./pages/index').default; // eslint-disable-line global-require
      renderApp(NextApp);
    });
  }
});
