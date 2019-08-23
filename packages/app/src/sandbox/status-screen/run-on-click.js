import html from '!raw-loader!./run-on-click-screen.html';
import { createOverlay } from './overlay-manager';

export function showRunOnClick() {
  return new Promise(async () => {
    const iframe = await createOverlay(html);

    iframe.contentDocument.body.addEventListener('click', () => {
      document.location.reload();
    });
  });
}
