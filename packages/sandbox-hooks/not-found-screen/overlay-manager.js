let iframeReference = null;

export function resetOverlay() {
  try {
    window.document.body.removeChild(iframeReference);
    iframeReference = null;
  } catch (e) {
    /* nothing */
  }
}

function createIframe() {
  return new Promise(resolve => {
    if (iframeReference) {
      resolve(iframeReference);
    }

    const iframe = document.createElement('iframe');

    iframe.setAttribute(
      'style',
      `position: fixed; top: 0; left: 0; width: 100%; height: 100%; border: none; z-index: 214748366;`
    );
    iframe.setAttribute('id', 'not-found-frame');

    iframeReference = iframe;

    document.body.appendChild(iframe);

    if (iframe.contentDocument) {
      resolve(iframe);
    } else if (document.getElementById('not-found-frame')) {
      document.getElementById('not-found-frame').onload = () => {
        resolve(iframe);
      };
    } else {
      resolve(iframe);
    }
  });
}

export async function createOverlay(html) {
  const iframe = await createIframe();

  const isMounted = !!document.getElementById('not-found-frame');
  if (!isMounted) {
    document.body.appendChild(iframe);
  }

  iframe.contentDocument.body.innerHTML = html;

  return iframe;
}
