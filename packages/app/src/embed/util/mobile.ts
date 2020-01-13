const isTouch = !matchMedia('(pointer:fine)').matches;

export function isSmallMobileScreen() {
  if (typeof screen === 'undefined') {
    return false;
  }

  return screen.width < 800 && isTouch;
}
