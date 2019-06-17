import immer from 'immer';
import {
  ViewConfig,
  ViewTab,
} from '@codesandbox/common/lib/templates/template';
import { ITabPosition } from 'app/components/Preview/DevTools/Tabs';

const isEqual = (prevPos: ITabPosition, nextPos: ITabPosition) =>
  prevPos.devToolIndex === nextPos.devToolIndex &&
  prevPos.tabPosition === nextPos.tabPosition;

export function addDevToolsTab(
  tabs: ViewConfig[],
  newTab: ViewTab,
  position?: ITabPosition
) {
  const positionToAdd: ITabPosition = position || {
    devToolIndex: 0,
    tabPosition: tabs[0].views.length - 1,
  };

  return immer(tabs, draft => {
    const devTools = draft[positionToAdd.devToolIndex];

    devTools.views.push(newTab);
  });
}

export function moveDevToolsTab(
  tabs: ViewConfig[],
  prevPos: ITabPosition,
  nextPos: ITabPosition
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
      } else if (i === nextPos.devToolIndex) {
        return nextDevTools;
      }

      return t;
    });
  });
}
