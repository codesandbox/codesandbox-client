import immer from 'immer';
import {
  ViewConfig,
  ViewTab,
} from '@codesandbox/common/lib/templates/template';
import { DevToolsTabPosition } from '@codesandbox/common/lib/types';

const isEqual = (prevPos: DevToolsTabPosition, nextPos: DevToolsTabPosition) =>
  prevPos.devToolIndex === nextPos.devToolIndex &&
  prevPos.tabPosition === nextPos.tabPosition;

export function addDevToolsTab(
  tabs: ViewConfig[],
  newTab: ViewTab,
  position?: DevToolsTabPosition
) {
  const positionToAdd: DevToolsTabPosition = position || {
    devToolIndex: 0,
    tabPosition: tabs[0].views.length,
  };

  return {
    devTools: immer(tabs, draft => {
      const devTools = draft[positionToAdd.devToolIndex];

      devTools.views.splice(positionToAdd.tabPosition, 0, newTab);
    }),
    position: { ...positionToAdd, tabPosition: positionToAdd.tabPosition },
  };
}

export function moveDevToolsTab(
  tabs: ViewConfig[],
  prevPos: DevToolsTabPosition,
  nextPos: DevToolsTabPosition
) {
  if (isEqual(prevPos, nextPos)) {
    return tabs;
  }

  // We want to do this immutable, to prevent conflicts while the file is changing
  return immer(tabs, draft => {
    const prevDevTools = draft[prevPos.devToolIndex];
    const nextDevTools = draft[nextPos.devToolIndex];
    const prevTab = draft[prevPos.devToolIndex].views[prevPos.tabPosition];

    prevDevTools.views = prevDevTools.views.filter(
      (_, i) => i !== prevPos.tabPosition
    );

    nextDevTools.views.splice(nextPos.tabPosition, 0, prevTab);

    draft.map((t, i) => {
      if (i === prevPos.devToolIndex) {
        return prevDevTools;
      }

      if (i === nextPos.devToolIndex) {
        return nextDevTools;
      }

      return t;
    });
  });
}

export function closeDevToolsTab(
  tabs: ViewConfig[],
  closePos: DevToolsTabPosition
) {
  // We want to do this immutable, to prevent conflicts while the file is changing
  return immer(tabs, draft => {
    const devTools = draft[closePos.devToolIndex];

    devTools.views.splice(closePos.tabPosition, 1);
  });
}
