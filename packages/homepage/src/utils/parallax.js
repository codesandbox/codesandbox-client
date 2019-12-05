import Rellax from 'rellax';
import { SMALL_BREAKPOINT } from '../components/layout';

export function applyParallax(el, options) {
  if (window.document.innerWidth > SMALL_BREAKPOINT) {
    // eslint-disable-next-line no-new
    new Rellax(el, options);
  }
}
