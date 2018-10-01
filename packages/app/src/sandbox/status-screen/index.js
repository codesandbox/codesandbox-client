// @flow
// This is the loading screen
import loadingHtml from '!raw-loader!./loading-screen.html';

import { createOverlay, resetOverlay } from './overlay-manager';

type LoadingScreen = {
  type: 'loading',
  text: string,
};

type Screen = LoadingScreen;

let currentScreen: ?Screen = null;
let firstLoaded = null;

let iframeReference = null;

function changeText(text: string) {
  if (iframeReference) {
    if (
      iframeReference.contentDocument &&
      iframeReference.contentDocument.getElementsByClassName('text') &&
      iframeReference.contentDocument.getElementsByClassName('text').item(0)
    ) {
      iframeReference.contentDocument
        .getElementsByClassName('text')
        .item(0).textContent = text;
    }
  }
}

export function resetScreen() {
  currentScreen = null;
  iframeReference = null;
  resetOverlay();
}

export default function setScreen(screen: Screen) {
  if (!iframeReference) {
    if (!firstLoaded) {
      // Give the illusion of faster loading by showing the loader screen later
      firstLoaded = setTimeout(async () => {
        if (!iframeReference && currentScreen) {
          iframeReference = await createOverlay(loadingHtml);
        }

        if (currentScreen) {
          changeText(currentScreen.text);
        }

        firstLoaded = null;
      }, 1000);
    }
  } else if (currentScreen) {
    changeText(currentScreen.text);
  }

  currentScreen = screen;
}
