export const isIOS =
  typeof navigator !== 'undefined' &&
  !!navigator.platform.match(/(iPhone|iPod|iPad)/i);
export const isMac =
  typeof navigator !== 'undefined' &&
  (isIOS || !!navigator.platform.match(/Mac/i));