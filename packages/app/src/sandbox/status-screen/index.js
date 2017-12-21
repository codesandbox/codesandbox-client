// @flow
// This is the loading screen
import loadingHtml from './loading-screen.html';

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
    iframeReference.contentDocument
      .getElementsByClassName('text')
      .item(0).textContent = text;
  }
}

function createOverlay() {
  return new Promise(resolve => {
    const iframe = document.createElement('iframe');

    iframe.setAttribute(
      'style',
      `position: fixed; top: 0; left: 0; width: 100%; height: 100%; border: none; z-index: ${2147483647 -
        2};`
    );

    iframe.onload = () => {
      iframe.contentDocument.body.innerHTML = loadingHtml;
      iframeReference = iframe;

      if (currentScreen) {
        changeText(currentScreen.text);
      }
      resolve();
    };

    document.body.appendChild(iframe);
  });
}

export function resetScreen() {
  currentScreen = null;
  try {
    window.document.body.removeChild(iframeReference);
    iframeReference = null;
  } catch (e) {
    /* nothing */
  }
}

export default function setScreen(screen: Screen) {
  if (!iframeReference && !currentScreen) {
    if (!firstLoaded) {
      // Give the illusion of faster loading by showing the loader screen later
      firstLoaded = setTimeout(() => {
        if (currentScreen) {
          createOverlay();
        }
      }, 600);
    } else {
      createOverlay(screen.text);
    }
  } else if (screen.type === 'loading') {
    changeText(screen.text);
  }

  currentScreen = screen;
}
