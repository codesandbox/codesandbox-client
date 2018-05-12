import { createOverlay, resetOverlay } from './overlay-manager';
import html from '!raw-loader!./run-on-click-screen.html';

export function showRunOnClick() {
  return new Promise(async resolve => {
    const iframe = await createOverlay(html);

    iframe.contentDocument.body.addEventListener('click', () => {
      document.location.reload();
    });
  });
}
