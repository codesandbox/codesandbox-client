// @flow
// This is the status screen handler, will show warnings, errors, loading screens
// etc

import loadingHTML from './loading-screen.html';

import SandboxError from '../errors/sandbox-error';

type LoadingScreen = {
  type: 'loading',
  text: string,
};

type ErrorScreen = {
  type: 'warning' | 'error',
  action: {
    title: string,
    handler: Function,
  },
  title: string,
  body: string,
};

type Screen = LoadingScreen | ErrorScreen;

let currentScreen: ?Screen = {
  type: 'loading',
  text: 'CodeSandbox',
};

export function resetScreen() {
  document.body.innerHTML = '';
  currentScreen = null;
}

export function openErrorScreen(error: Error | SandboxError) {
  if (error.severity == null || error.severity === 'error') {
    document.body.innerHTML = `<div>${error.name}

    ${error.stack}</div>`;
  } else {
    document.body.innerHTML = '<div>PANIEK EEN WARNING</div>';
  }
}

export default function setScreen(screen: Screen) {
  if (screen.type === 'loading') {
    if (!currentScreen || currentScreen.type !== 'loading') {
      document.body.innerHTML = loadingHTML;
    }
    document.getElementsByClassName('text').item(0).textContent = screen.text;
  } else {
  }

  currentScreen = screen;
}
