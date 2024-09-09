const SANDPACK_SECRET_COOKIE_NAME = 'csb_sandpack_secret';

export const getSandpackSecret = () =>
  document.cookie.replace(
    new RegExp(
      `(?:(?:^|.*;\\s*)${SANDPACK_SECRET_COOKIE_NAME}\\s*\\=\\s*([^;]*).*$)|^.*$`
    ),
    '$1'
  );

export const removeSandpackSecret = () => {
  document.cookie = `${SANDPACK_SECRET_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:01 GMT;samesite=none;secure;partitioned`;
};

export const setSandpackSecret = (secret: string) => {
  if (secret === null) {
    return;
  }

  const cookieValue = getSandpackSecret();
  if (
    (cookieValue && !secret) ||
    (secret && !cookieValue) ||
    cookieValue !== secret
  ) {
    if (secret) {
      document.cookie = `${SANDPACK_SECRET_COOKIE_NAME}=${secret};samesite=none;secure;partitioned`;

      setTimeout(() => {
        location.reload();
      }, 1000);
    } else {
      removeSandpackSecret();
    }
  }
};

function getPopupOffset({ width, height }: { width: number; height: number }) {
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

export function getProtocolAndHostWithSSE() {
  if (document.location.host.startsWith('localhost')) {
    return 'http://localhost:3000';
  }

  if (document.location.host.endsWith('.io')) {
    return 'https://codesandbox.io';
  }

  return 'https://codesandbox.stream';
}

export const requestSandpackSecretFromApp = async (
  teamId: string,
  host: string = getProtocolAndHostWithSSE()
): Promise<string> => {
  const parentDomain = (() => {
    /**
     * It gets the all ancestor browsing context of the parent, in reverse order.
     *
     * Note: ancestorOrigins is not supported by Firefox: https://bugzilla.mozilla.org/show_bug.cgi?id=1085214
     * so it default to `document.referrer`
     */
    if (document.location.ancestorOrigins) {
      return document.location.ancestorOrigins[
        document.location.ancestorOrigins.length - 1
      ];
    }

    return document.referrer;
  })();

  return new Promise(resolve => {
    const popup = window.open(
      host + '/auth/sandpack/' + teamId,
      '',
      `scrollbars=no,toolbar=no,location=no,titlebar=no,directories=no,status=no,menubar=no, ${getPopupDimensions()}`
    );

    setInterval(() => {
      if (popup) {
        popup.postMessage(
          { $type: 'request-sandpack-secret', parentDomain },
          host
        );
      }
    }, 500);

    const listener = (e: any) => {
      if (e.data && e.data.$type === 'sandpack-secret') {
        setSandpackSecret(e.data.token);
        window.removeEventListener('message', listener);

        if (popup) {
          popup.close();
        }

        resolve(e.data.token);
      }
    };

    window.addEventListener('message', listener);
  });
};
