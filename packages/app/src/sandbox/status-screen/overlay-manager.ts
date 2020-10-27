let iframeReference: HTMLIFrameElement = null;
let iframeRenderedAt = 0;

export function resetOverlay() {
  try {
    // We add a delay to unmounting the iframe if the iframe has only just
    // appeared. We want to do this, because we want to prevent a flicker for
    // the user, which is a bad perceivement.
    const delay = Date.now() - iframeRenderedAt > 1000 ? 0 : 1000;

    /**
     * To make sure no iframe rendered between now and the clear we do
     * after a timeout, we keep track of the last rendered at and compare
     * it before clearing the iframe
     */
    const lastIframeRenderedAt = iframeRenderedAt;

    setTimeout(() => {
      if (iframeReference && lastIframeRenderedAt === iframeRenderedAt) {
        iframeReference.style.opacity = '0';
        setTimeout(() => {
          if (iframeReference.parentNode) {
            document.body.removeChild(iframeReference);
          }
        }, 500);
      }
    }, delay);
  } catch (e) {
    /* nothing */
  }
}

const setIframeStyle = (iframe: HTMLIFrameElement, showFullScreen: boolean) => {
  iframe.setAttribute(
    'style',
    showFullScreen
      ? `position: fixed; top: 0; left: 0; width: 100%; height: 100%; border: none; z-index: 214748366;opacity: 1;transition: opacity 0.15s ease-in;`
      : `position: fixed; top: 10px; left: 10px; height: 45px; width: 45px; border-radius: 2px; border: none; z-index: 214748366; opacity: 0;transition: opacity 0.15s ease-in;`
  );
};

function createIframe(showFullScreen: boolean): Promise<HTMLIFrameElement> {
  return new Promise(resolve => {
    iframeRenderedAt = Date.now();
    if (iframeReference) {
      document.body.appendChild(iframeReference);
      requestAnimationFrame(() => {
        iframeReference.style.opacity = '1';
      });
      setIframeStyle(iframeReference, showFullScreen);
      resolve(iframeReference);
      return;
    }

    const iframe = document.createElement('iframe');
    setIframeStyle(iframe, showFullScreen);

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
  const iframe: HTMLIFrameElement = await createIframe(showFullScreen);

  const isMounted = !!document.getElementById('frame');
  if (!isMounted) {
    document.body.appendChild(iframe);
  }

  iframe.contentDocument.body.innerHTML = html;

  return iframe;
}
