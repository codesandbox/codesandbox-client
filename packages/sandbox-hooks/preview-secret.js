import { protocolAndHost } from '@codesandbox/common/lib/utils/url-generator';

const PREVIEW_SECRET_COOKIE_NAME = 'csb_sandbox_secret';

export const getPreviewSecret = () =>
  document.cookie.replace(
    new RegExp(
      `(?:(?:^|.*;\\s*)${PREVIEW_SECRET_COOKIE_NAME}\\s*\\=\\s*([^;]*).*$)|^.*$`
    ),
    '$1'
  );

export const setPreviewSecret = secret => {
  if (secret === null) {
    return;
  }

  const cookieValue = getPreviewSecret();
  if (
    (cookieValue && !secret) ||
    (secret && !cookieValue) ||
    cookieValue !== secret
  ) {
    if (secret) {
      document.cookie = `${PREVIEW_SECRET_COOKIE_NAME}=${secret};samesite=none;secure;partitioned;`;

      setTimeout(() => {
        location.reload();
      }, 1000);
    } else {
      document.cookie = `${PREVIEW_SECRET_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
    }
  }
};

export const listenForPreviewSecret = () => {
  const listener = data => {
    if (data.data && data.data.$type === 'preview-secret') {
      const { previewSecret } = data.data;
      setPreviewSecret(previewSecret);
    }
  };

  window.addEventListener('message', listener);

  return () => {
    window.removeEventListener('message', listener);
  };
};

function getPopupOffset({ width, height }) {
  const wLeft = window.screenLeft ? window.screenLeft : window.screenX;
  const wTop = window.screenTop ? window.screenTop : window.screenY;

  const left = wLeft + window.innerWidth / 2 - width / 2;
  const top = wTop + window.innerHeight / 2 - height / 2;

  return { top, left };
}

function getPopupSize() {
  return { width: 1020, height: 618 };
}

function getPopupDimensions() {
  const { width, height } = getPopupSize();
  const { top, left } = getPopupOffset({ width, height });

  return `width=${width},height=${height},top=${top},left=${left}`;
}

/**
 * This helper function is purely there to also work when we're building
 * for SSE, which means that the env vars are not set and we thus don't
 * know the host.
 */
function getProtocolAndHostWithSSE() {
  if (process.env.CODESANDBOX_HOST) {
    return protocolAndHost();
  }

  if (document.location.host.endsWith('.stream')) {
    return 'https://codesandbox.stream';
  }

  return 'https://codesandbox.io';
}

export const requestPreviewSecretFromApp = sandboxId => {
  const host = getProtocolAndHostWithSSE();
  const popup = window.open(
    host + '/auth/sandbox/' + sandboxId,
    name,
    `scrollbars=no,toolbar=no,location=no,titlebar=no,directories=no,status=no,menubar=no, ${getPopupDimensions()}`
  );

  setInterval(() => {
    popup.postMessage({ $type: 'request-preview-secret' }, host);
  }, 500);

  const listener = e => {
    if (e.data && e.data.$type === 'preview-secret') {
      setPreviewSecret(e.data.previewSecret);
      window.removeEventListener('message', listener);

      popup.close();
    }
  };
  window.addEventListener('message', listener);
};
