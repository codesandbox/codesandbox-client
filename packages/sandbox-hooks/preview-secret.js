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
      document.cookie = `${PREVIEW_SECRET_COOKIE_NAME}=${secret}`;
    } else {
      document.cookie = `${PREVIEW_SECRET_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
    }
    location.reload();
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

export const requestPreviewSecretFromApp = sandboxId => {
  const popup = window.open(
    protocolAndHost() + '/auth/sandbox/' + sandboxId,
    name,
    `scrollbars=no,toolbar=no,location=no,titlebar=no,directories=no,status=no,menubar=no, ${getPopupDimensions()}`
  );

  setInterval(() => {
    popup.postMessage({ $type: 'request-preview-secret' }, protocolAndHost());
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
