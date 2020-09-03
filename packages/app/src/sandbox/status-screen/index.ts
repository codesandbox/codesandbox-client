// @ts-ignore
import indicatorHtml from '!raw-loader!./indicator-screen.html';
// This is the loading screen
// @ts-ignore
import loadingHtml from '!raw-loader!./loading-screen.html';

import { createOverlay, resetOverlay } from './overlay-manager';

type LoadingScreen = {
  type: 'loading';
  text: string;
  showFullScreen?: boolean;
};

type Screen = LoadingScreen;

let currentScreen: Screen = null;
let loadTimeoutID: number = null;
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

  clearTimeout(loadTimeoutID);
  loadTimeoutID = null;
}

export default function setScreen(screen: Screen) {
  const showFullScreen =
    typeof screen.showFullScreen === 'undefined' ? true : screen.showFullScreen;

  if (!iframeReference) {
    if (!loadTimeoutID) {
      // Give the illusion of faster loading by showing the loader screen later
      loadTimeoutID = window.setTimeout(
        async () => {
          if (!iframeReference && currentScreen) {
            iframeReference = await createOverlay(
              showFullScreen ? loadingHtml : indicatorHtml,
              showFullScreen
            );
          }

          if (currentScreen) {
            changeText(currentScreen.text);
          }

          loadTimeoutID = null;
        },
        showFullScreen ? 1000 : 0
      );
    }
  } else if (currentScreen) {
    changeText(screen.text);
  }

  currentScreen = screen;
}
