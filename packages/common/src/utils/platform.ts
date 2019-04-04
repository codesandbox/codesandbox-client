export const isIOS =
  typeof navigator !== 'undefined' &&
  !!navigator.platform.match(/(iPhone|iPod|iPad)/i);
export const isSafari =
  typeof navigator !== 'undefined' &&
  /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
export const isMac =
  typeof navigator !== 'undefined' &&
  (isIOS || !!navigator.platform.match(/Mac/i));
