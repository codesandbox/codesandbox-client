import { Breadcrumb } from '@sentry/browser';

import VERSION from '../../version';
import { DO_NOT_TRACK_ENABLED } from './utils';

let _Sentry: typeof import('@sentry/browser');

function getSentry(): Promise<typeof import('@sentry/browser')> {
  return import(/* webpackChunkName: 'sentry' */ '@sentry/browser');
}

let sentryInitialized = false;
let latestVersionPromise: Promise<string>;
const versionTimeout = 1 * 60 * 1000;
function getLatestVersion() {
  if (!latestVersionPromise) {
    latestVersionPromise = fetch('/version.txt')
      .then(x => x.text())
      .catch(x => '');

    setTimeout(() => {
      latestVersionPromise = undefined;
    }, versionTimeout);
  }

  return latestVersionPromise;
}

export async function initialize(dsn: string) {
  if (!DO_NOT_TRACK_ENABLED) {
    _Sentry = await getSentry();
    const latestVersion = await getLatestVersion();

    if (VERSION !== latestVersion) {
      // If we're not running the latest version we don't want to see the errors appear
      return Promise.resolve();
    }

    sentryInitialized = true;

    return _Sentry.init({
      dsn,
      release: VERSION,
      ignoreErrors: [
        'Custom Object', // Called for errors coming from sandbox (https://sentry.io/organizations/codesandbox/issues/965255074/?project=155188&query=is%3Aunresolved&statsPeriod=14d)
        'TypeScript Server Error', // Called from the TSC server
        /^Canceled$/, // Used by VSCode to stop currently running actions

        // react devtools Outside of our scope for now, but we definitely want to check this out.
        // TODO: check what's happening here: https://sentry.io/organizations/codesandbox/issues/1239466583/?project=155188&query=is%3Aunresolved+release%3APROD-1573653062-4134efc0a
        /because a node with that id is already in the Store/,
        /Node \d* was removed before its children\./,
        /Cannot remove node \d* because no matching node was found in the Store\./,
        /Cannot add child \d* to parent \d* because parent node was not found in the Store\./,
        /Children cannot be added or removed during a reorder operation\./,
        /Cannot reorder children for node/,

        "undefined is not an object (evaluating 'window.__pad.performLoop')", // Only happens on Safari, but spams our servers. Doesn't break anything
        "Cannot assign to read only property 'exports' of object '#<Object>'", // eslint error in the v1 editor
      ],
      integrations: [
        new _Sentry.Integrations.TryCatch({
          setTimeout: false,
          setInterval: false,
          requestAnimationFrame: false,
        }),
      ],
      allowUrls: [/https?:\/\/((uploads|www)\.)?codesandbox\.io/],
      maxBreadcrumbs: 100,
      /**
       * Don't send messages from the sandbox, so don't send from eg.
       * new.codesandbox.io or new.csb.app
       */
      denyUrls: ['codesandbox.editor.main.js', /.*\.csb\.app/],
      beforeSend: (event, hint) => {
        const exception = event?.exception?.values?.[0];
        const exceptionFrame = exception?.stacktrace?.frames?.[0];
        const filename = exceptionFrame?.filename;

        if (
          !(hint.originalException instanceof Error) &&
          typeof hint.originalException === 'object' &&
          hint.originalException &&
          'error' in hint.originalException
        ) {
          return null;
        }

        let errorMessage =
          typeof hint.originalException === 'string'
            ? hint.originalException
            : hint.originalException?.message || exception.value;

        if (typeof errorMessage !== 'string') {
          errorMessage = '';
        }

        if (filename) {
          if (
            filename.includes('typescript-worker') &&
            errorMessage.includes('too much recursion')
          ) {
            // https://sentry.io/organizations/codesandbox/issues/1293123855/events/b01ee0feb7e3415a8bb81b6a9df19152/?project=155188&query=is%3Aunresolved&statsPeriod=14d
            return null;
          }

          if (
            filename.endsWith('codesandbox.editor.main.js') ||
            filename.startsWith('/extensions/')
          ) {
            // This is the spammy event that doesn't do anything: https://sentry.io/organizations/codesandbox/issues/1054971728/?project=155188&query=is%3Aunresolved
            // Don't do anything with it right now, I can't seem to reproduce it for some reason.
            // We need to add sourcemaps
            return null;
          }

          if (filename.includes('tsserver.js')) {
            // We don't have control over this
            return null;
          }
        }

        const customError = ((hint && (hint.originalException as any)) || {})
          .error;

        if (
          customError &&
          errorMessage.startsWith('Non-Error exception captured') &&
          exception.mechanism.handled
        ) {
          // This is an error coming from the sandbox, return with no error.
          return null;
        }

        if (errorMessage.includes('Unexpected frame by generating stack.')) {
          // A firefox error with error-polyfill, not critical. Referenced here: https://sentry.io/organizations/codesandbox/issues/1293236389/?project=155188&query=is%3Aunresolved
          return null;
        }

        return event;
      },
    });
  }

  return Promise.resolve();
}

export const logBreadcrumb = (breadcrumb: Breadcrumb) => {
  if (_Sentry && sentryInitialized) {
    _Sentry.addBreadcrumb(breadcrumb);
  }
};

export const captureException = (err: Error) => {
  if (_Sentry && sentryInitialized) {
    return _Sentry.captureException(err);
  }
  return null;
};

export const configureScope = cb => {
  if (_Sentry && sentryInitialized) {
    _Sentry.configureScope(cb);
  }
};

export const setUserId = userId => {
  if (_Sentry && sentryInitialized) {
    _Sentry.configureScope(scope => {
      scope.setUser({ id: userId });
    });
  }
};

export const resetUserId = () => {
  if (_Sentry && sentryInitialized) {
    _Sentry.configureScope(scope => {
      scope.setUser({ id: undefined });
    });
  }
};
