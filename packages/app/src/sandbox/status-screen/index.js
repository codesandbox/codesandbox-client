// @flow
// This is the status screen handler, will show warnings, errors, loading screens
// etc

import loadingHTML from './loading-screen.html';

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
  if (document.getElementById('loading-screen')) {
    document.body.innerHTML = '';
    currentScreen = null;
  }
}

export default function setScreen(screen: Screen) {
  if (document.getElementById('loading-screen')) {
    if (screen.type === 'loading') {
      if (!currentScreen || currentScreen.type !== 'loading') {
        document.body.innerHTML = loadingHTML;
      }
      document.getElementsByClassName('text').item(0).textContent = screen.text;
    }
  }

  currentScreen = screen;
}
