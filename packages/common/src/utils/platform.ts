export const isAndroid =
  typeof navigator !== 'undefined' &&
  Boolean(/(android)/i.test(navigator.userAgent));
export const isIOS =
  typeof navigator !== 'undefined' &&
  Boolean(navigator.platform.match(/(iPhone|iPod|iPad)/i));
export const isSafari =
  typeof navigator !== 'undefined' &&
  /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
export const isMac =
  typeof navigator !== 'undefined' &&
  (isIOS || Boolean(navigator.platform.match(/Mac/i)));
