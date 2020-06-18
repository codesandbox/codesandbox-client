import { identify } from '@codesandbox/common/lib/utils/analytics';

function getCookie(name) {
  const pattern = RegExp(name + '=.[^;]*');
  const matched = document.cookie.match(pattern);
  if (matched) {
    const cookie = matched[0].split('=');
    return cookie[1];
  }
  return false;
}

export function identifyFromCookie(cookie, identifyKey) {
  if (typeof document === 'undefined') {
    return;
  }

  const cookieValue = getCookie(cookie);

  if (cookieValue) {
    identify(identifyKey, cookieValue);
  }
}
