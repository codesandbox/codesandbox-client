// This is the status screen handler, will show warnings, errors, loading screens
// etc

type LoadingScreen = {
  type: 'loading',
  stage: 0 | 1 | 2,
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

export function resetScreen() {
  document.body.innerHTML = '';
}

export default function setScreen(screen: Screen) {
  if (screen.type === 'loading') {
    document.body.innerHTML = 'LOADING YOOOOO';
  } else {
  }
}
