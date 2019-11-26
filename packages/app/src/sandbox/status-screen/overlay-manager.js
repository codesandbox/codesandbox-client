let iframeReference = null;

export function resetOverlay() {
  try {
    setTimeout(() => {
      document.body.removeChild(iframeReference);
    }, 500);
    iframeReference.style.opacity = '0';
  } catch (e) {
    /* nothing */
  }
}

function createIframe(showFullScreen: boolean) {
  return new Promise(resolve => {
    if (iframeReference) {
      document.body.appendChild(iframeReference);
      requestAnimationFrame(() => {
        iframeReference.style.opacity = '1';
      });
      resolve(iframeReference);
      return;
    }

    const iframe = document.createElement('iframe');

    iframe.setAttribute(
      'style',
      showFullScreen
        ? `position: fixed; top: 0; left: 0; width: 100%; height: 100%; border: none; z-index: 214748366;opacity: 1;transition: opacity 0.15s ease-in;`
        : `position: fixed; top: 5px; right: 5px; height: 30px; width: 200px; border-radius: 3px; border: none; z-index: 214748366; opacity: 0;transition: opacity 0.15s ease-in;`
    );
    iframe.setAttribute('id', 'frame');

    iframeReference = iframe;

    document.body.appendChild(iframe);

    requestAnimationFrame(() => {
      iframe.style.opacity = '1';
    });

    if (iframe.contentDocument) {
      resolve(iframe);
    } else if (document.getElementById('frame')) {
      document.getElementById('frame').onload = () => {
        resolve(iframe);
      };
    } else {
      resolve(iframe);
    }
  });
}

export async function createOverlay(html: string, showFullScreen: boolean) {
  const iframe = await createIframe(showFullScreen);

  const isMounted = !!document.getElementById('frame');
  if (!isMounted) {
    document.body.appendChild(iframe);
  }

  iframe.contentDocument.body.innerHTML = html;

  return iframe;
}
