import '@codesandbox/common/lib/global.css';
import 'normalize.css';

import './split-pane.css';

import { ApolloProvider as HooksProvider } from '@apollo/react-hooks';
import requirePolyfills from '@codesandbox/common/lib/load-dynamic-polyfills';
import registerServiceWorker from '@codesandbox/common/lib/registerServiceWorker';
import theme from '@codesandbox/common/lib/theme';
import {
  initializeSentry,
  logError,
} from '@codesandbox/common/lib/utils/analytics';
import _debug from '@codesandbox/common/lib/utils/debug';
import {
  convertTypeToStatus,
  notificationState,
} from '@codesandbox/common/lib/utils/notifications';
import { isSafari } from '@codesandbox/common/lib/utils/platform';
import { client } from 'app/graphql/client';
import history from 'app/utils/history';
import { createOvermind } from 'overmind';
import { Provider as ActualOvermindProvider } from 'overmind-react';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { render } from 'react-dom';
import { Router } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import { config } from './overmind';
import { Provider as OvermindProvider } from './overmind/Provider';
import { Routes as App } from './pages';

const debug = _debug('cs:app');

window.setImmediate = (func, delay) => setTimeout(func, delay);

window.addEventListener('unhandledrejection', e => {
  if (e && e.reason && e.reason.name === 'Canceled') {
    // This is an error from vscode that vscode uses to cancel some actions
    // We don't want to show this to the user
    e.preventDefault();
  }
});

if (process.env.NODE_ENV === 'production') {
  try {
    initializeSentry(
      'https://3943f94c73b44cf5bb2302a72d52e7b8@sentry.io/155188'
    );
  } catch (error) {
    console.error(error);
  }
}

window.__isTouch = !matchMedia('(pointer:fine)').matches;

const overmind = createOvermind(config, {
  devtools:
    (window.opener && window.opener !== window) || !window.chrome
      ? false
      : 'localhost:3031',
  name:
    'CodeSandbox - ' +
    (navigator.userAgent.indexOf('Chrome/76') > 0 ? 'Chrome' : 'Canary'),
  logProxies: true,
});

/*
  Temporary global functions to grab state and actions, related to old
  Cerebral implementation
*/
window.getState = path =>
  path
    ? path.split('.').reduce((aggr, key) => aggr[key], overmind.state)
    : overmind.state;
window.getSignal = path =>
  path.split('.').reduce((aggr, key) => aggr[key], overmind.actions);

overmind.initialized.then(() => {
  requirePolyfills().then(() => {
    if (isSafari) {
      import('subworkers');
    }

    const rootEl = document.getElementById('root');

    const showNotification = (message, type) => {
      notificationState.addNotification({
        message,
        status: convertTypeToStatus(type),
      });
    };

    window.showNotification = showNotification;

    registerServiceWorker('/service-worker.js', {
      onUpdated: () => {
        debug('Updated SW');

        window.getSignal('setUpdateStatus')({ status: 'available' });
      },
      onInstalled: () => {
        debug('Installed SW');

        showNotification(
          'CodeSandbox has been installed, it now works offline!',
          'success'
        );
      },
    });

    try {
      render(
        <ApolloProvider client={client}>
          <ActualOvermindProvider value={overmind}>
            <OvermindProvider value={overmind}>
              <HooksProvider client={client}>
                <ThemeProvider theme={theme}>
                  <Router history={history}>
                    <App />
                  </Router>
                </ThemeProvider>
              </HooksProvider>
            </OvermindProvider>
          </ActualOvermindProvider>
        </ApolloProvider>,
        rootEl
      );
    } catch (e) {
      logError(e);
    }
  });
});
