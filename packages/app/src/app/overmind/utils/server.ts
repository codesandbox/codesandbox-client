import {
  ViewConfig,
  ViewTab,
} from '@codesandbox/common/lib/templates/template';

// eslint-disable-next-line consistent-return
export function getDevToolsTabPosition({
  tabs,
  tab,
}: {
  tabs: ViewConfig[];
  tab: ViewTab;
}):
  | {
      devToolIndex: number;
      tabPosition: number;
    }
  | undefined {
  const serializedTab = JSON.stringify(tab);

  for (let i = 0; i < tabs.length; i++) {
    const view = tabs[i];

    for (let j = 0; j < view.views.length; j++) {
      const tabFounded = view.views[j];
      if (JSON.stringify(tabFounded) === serializedTab) {
        return {
          devToolIndex: i,
          tabPosition: j,
        };
      }
    }
  }
}
