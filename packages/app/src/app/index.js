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
import { logBreadcrumb } from '@codesandbox/common/lib/utils/analytics/sentry';
import _debug from '@codesandbox/common/lib/utils/debug';
import {
  convertTypeToStatus,
  notificationState,
} from '@codesandbox/common/lib/utils/notifications';
import { isSafari } from '@codesandbox/common/lib/utils/platform';
import { Severity } from '@sentry/browser';
import { client } from 'app/graphql/client';
import history from 'app/utils/history';
import { createOvermind } from 'overmind';
import { Provider as ActualOvermindProvider } from 'overmind-react';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { DndProvider } from 'react-dnd';
import { render } from 'react-dom';
import { Router } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import { config } from './overmind';
import { Provider as OvermindProvider } from './overmind/Provider';
import { Routes as App } from './pages';
import HTML5Backend from './pages/common/HTML5BackendWithFolderSupport';

const debug = _debug('cs:app');

window.setImmediate = (func, delay) => setTimeout(func, delay);

window.addEventListener('unhandledrejection', e => {
  if (e && e.reason && e.reason.name === 'Canceled') {
    // This is an error from vscode that vscode uses to cancel some actions
    // We don't want to show this to the user
    e.preventDefault();
  }
});

window.__isTouch = !matchMedia('(pointer:fine)').matches;

const overmind = createOvermind(config, {
  delimiter: ' ',
  devtools:
    (window.opener && window.opener !== window) ||
    !window.chrome ||
    location.search.includes('noDevtools')
      ? false
      : 'localhost:3031',
  name:
    'CodeSandbox - ' +
    (navigator.userAgent.indexOf('Chrome/76') > 0 ? 'Chrome' : 'Canary'),
  logProxies: true,
});

if (process.env.NODE_ENV === 'production') {
  const ignoredOvermindActions = [
    'onInitialize',
    'server.onCodeSandboxAPIMessage',
    'track',
    'editor.previewActionReceived',
    'live.onSelectionChanged',
  ];

  try {
    initializeSentry(
      'https://f595bc90ce3646c4a9d76a8d3b84b403@sentry.io/2071895'
    );

    overmind.eventHub.on('action:start', event => {
      if (ignoredOvermindActions.includes(event.actionName)) {
        return;
      }

      // We try as the payload might cause a stringify error
      try {
        logBreadcrumb({
          category: 'overmind-action',
          message: event.actionName,
          level: Severity.Info,
          data: {
            value: JSON.stringify(event.value),
          },
        });
      } catch (e) {
        logBreadcrumb({
          category: 'overmind-action',
          message: event.actionName,
          level: Severity.Info,
        });
      }
    });
  } catch (error) {
    console.error(error);
  }
}

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
                  <DndProvider backend={HTML5Backend}>
                    <Router history={history}>
                      <App />
                    </Router>
                  </DndProvider>
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
