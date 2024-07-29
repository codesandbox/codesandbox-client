import { useAppState } from 'app/overmind';
import React from 'react';

import { Redirect } from 'react-router-dom';

export const Sandbox = ({ showModalOnTop }) => {
  const state = useAppState();

  if (state.hasLogIn) {
    if (showModalOnTop === 'newSandbox') {
      return <Redirect to="/dashboard/recent?create_sandbox=true" />;
    }

    if (showModalOnTop === 'newDevbox') {
      return <Redirect to="/dashboard/recent?create_devbox=true" />;
    }

    if (showModalOnTop === 'new') {
      return <Redirect to="/dashboard/recent?create=true" />;
    }
  }

  // For unauthenticated users we redirect to the templates universe
  // this pages only shows for /s, /d and /new URLS, which are shortcuts
  window.location.href = 'https://codesandbox.io/templates';
  return null;
};
