const isTouch = !matchMedia('(pointer:fine)').matches;

export function isSmallScreen() {
  if (typeof screen === 'undefined') {
    return false;
  }

  return screen.width < 800;
}

export function isSmallMobileScreen() {
  return isSmallScreen() && isTouch;
}
