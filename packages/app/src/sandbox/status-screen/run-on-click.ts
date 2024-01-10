// @ts-ignore
import html from '!raw-loader!./run-on-click-screen.html';
import { createOverlay } from './overlay-manager';

export async function showRunOnClick() {
  const iframe = await createOverlay(html, true);

  iframe.contentDocument.body.addEventListener('click', () => {
    document.location.reload();
  });
}
