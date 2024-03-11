import 'react-hot-loader/patch';
import '@codesandbox/common/lib/global.css';
import 'normalize.css';

import './split-pane.css';
import './utils/cookieConsent/cookieConsentTheme.css';
import 'vanilla-cookieconsent/dist/cookieconsent.css';

import { ApolloProvider as HooksProvider } from '@apollo/react-hooks';
import requirePolyfills from '@codesandbox/common/lib/load-dynamic-polyfills';
import registerServiceWorker from '@codesandbox/common/lib/registerServiceWorker';
import theme from '@codesandbox/common/lib/theme';
import { logError } from '@codesandbox/common/lib/utils/analytics';
import {
  initialize as initializeSentry,
  logBreadcrumb,
} from '@codesandbox/common/lib/utils/analytics/sentry';

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

/**
 * Get rid of a tippy warning that spams the console, and doesn't seem valid.
 */
const warn = console.warn;
console.warn = (...args) => {
  if (
    args &&
    args[0] &&
    typeof args[0].includes === 'function' &&
    args[0].includes('Cannot update plugins')
  ) {
    return;
  }

  warn(...args);
};

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
    'live.onViewRangeChanged',
    'editor.onSelectionChanged',
    'editor.persistCursorToUrl',
  ];

  try {
    initializeSentry(window._env_?.SENTRY_DSN);

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

const rootEl = document.getElementById('root');

overmind.initialized.then(() => {
  requirePolyfills().then(() => {
    if (isSafari) {
      // eslint-disable-next-line
      import('subworkers');
    }

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

if (module.hot) {
  module.hot.accept(['./pages/index.tsx', './overmind'], () => {
    const newOvermind = createOvermind(config, {
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
    render(
      <ApolloProvider client={client}>
        <ActualOvermindProvider value={newOvermind}>
          <OvermindProvider value={newOvermind}>
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
  });
}

const isInStandaloneMode = () =>
  'standalone' in window.navigator && window.navigator.standalone;

// If we're in PWA mode we want to override CMD+W, so that people can use that to close the tabs. This is a little
// hack, but gives good QoL improvement for a small effort.
if (isInStandaloneMode()) {
  document.addEventListener('keydown', e => {
    if (
      (window.navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey) &&
      e.keyCode === 83
    ) {
      e.preventDefault();
    }
  });
}
