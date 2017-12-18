// @flow
// This is the loading screen

type LoadingScreen = {
  type: 'loading',
  text: string,
};

type Screen = LoadingScreen;

let currentScreen: ?Screen = null;
let firstLoaded = null;

export function resetScreen() {
  if (document.getElementById('loading-screen')) {
    document.body.innerHTML = '';
    currentScreen = null;
  }
}

export default function setScreen(screen: Screen) {
  if (document.getElementById('loading-screen')) {
    if (!firstLoaded && !currentScreen) {
      // Give the illusion of faster loading by showing the loader screen later
      firstLoaded = setTimeout(async () => {
        if (currentScreen) {
          const loadingHtml = await import(/* webpackChunkName: 'loading-screen' */ './loading-screen.html');

          if (currentScreen) {
            document.body.innerHTML = loadingHtml;

            document.getElementsByClassName('text').item(0).textContent =
              currentScreen.text;
          }
        }
      }, 500);
    } else if (screen.type === 'loading') {
      if (document.getElementsByClassName('text').item(0)) {
        document.getElementsByClassName('text').item(0).textContent =
          screen.text;
      }
    }
  }

  currentScreen = screen;
}
