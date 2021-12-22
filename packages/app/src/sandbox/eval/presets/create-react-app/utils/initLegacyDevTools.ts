import { dispatch } from 'codesandbox-api';

export async function initializeReactDevToolsLegacy() {
  if (!window.opener) {
    const { initialize: initializeDevTools, activate } = await import(
      /* webpackChunkName: 'react-devtools-backend' */ 'react-devtools-inline_legacy/backend'
    );
    // The dispatch needs to happen before initializing, so that the backend can already listen
    dispatch({ type: 'activate-react-devtools' });

    // @ts-ignore
    if (typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined') {
      try {
        // @ts-ignore We need to make sure that the existing chrome extension doesn't interfere
        delete window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
      } catch (e) {
        /* ignore */
      }
    }
    // Call this before importing React (or any other packages that might import React).
    initializeDevTools(window);
    activate(window);
  }
}
