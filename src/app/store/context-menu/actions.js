// @flow
import type { ContextMenuItem } from './reducer';

export const CLOSE_CONTEXT_MENU = 'CLOSE_CONTEXT_MENU';
export const OPEN_CONTEXT_MENU = 'OPEN_CONTEXT_MENU';

const openMenu = (
  items: Array<ContextMenuItem>,
  x: number,
  y: number,
  onClose: ?() => void
) => ({
  type: OPEN_CONTEXT_MENU,
  items,
  x,
  y,
  onClose,
});

export default {
  openMenu,
  closeMenu: () => ({ type: CLOSE_CONTEXT_MENU }),
};
