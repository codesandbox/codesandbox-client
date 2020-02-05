import getTemplate from '@codesandbox/common/lib/templates';

export interface INavigationItem {
  id: string;
  name: string;
  hasCustomHeader?: boolean;
  defaultOpen?: boolean;
  /**
   * If the item is not applicable in the current situation we sometimes still
   * want to show it because of visibility. This boolean decides that.
   */
  showAsDisabledIfHidden?: boolean;
}

const PROJECT: INavigationItem = {
  id: 'project',
  name: 'Sandbox Info',
};

const PROJECT_TEMPLATE: INavigationItem = {
  ...PROJECT,
  name: 'Template Info',
};

const PROJECT_SUMMARY: INavigationItem = {
  id: 'project-summary',
  name: 'Sandbox Info',
  hasCustomHeader: true,
};

const FILES: INavigationItem = {
  id: 'files',
  name: 'Explorer',
  hasCustomHeader: true,
  defaultOpen: true,
};

const GITHUB: INavigationItem = {
  id: 'github',
  name: 'GitHub',
  showAsDisabledIfHidden: true,
};

const DEPLOYMENT: INavigationItem = {
  id: 'deploy',
  name: 'Deployment',
  showAsDisabledIfHidden: true,
};

const CONFIGURATION: INavigationItem = {
  id: 'config',
  name: 'Configuration Files',
};

const LIVE: INavigationItem = {
  id: 'live',
  name: 'Live',
  showAsDisabledIfHidden: true,
};

const SERVER: INavigationItem = {
  id: 'server',
  name: 'Server Control Panel',
};

export function getDisabledItems(store: any): INavigationItem[] {
  const { currentSandbox } = store.editor;

  if (!currentSandbox.owned || !store.isLoggedIn) {
    return [GITHUB, DEPLOYMENT, LIVE];
  }

  return [];
}

export default function getItems(store: any): INavigationItem[] {
  if (
    store.live.isLive &&
    !(
      store.live.isOwner ||
      (store.user &&
        store.live &&
        store.live.roomInfo &&
        store.live.roomInfo.ownerIds.indexOf(store.user.id) > -1)
    )
  ) {
    return [FILES, LIVE];
  }

  const { currentSandbox } = store.editor;

  if (!currentSandbox.owned) {
    return [PROJECT_SUMMARY, CONFIGURATION];
  }

  const isCustomTemplate = !!currentSandbox.customTemplate;
  const items = [
    isCustomTemplate ? PROJECT_TEMPLATE : PROJECT,
    FILES,
    CONFIGURATION,
  ];

  if (store.isLoggedIn && currentSandbox) {
    const templateDef = getTemplate(currentSandbox.template);
    if (templateDef.isServer) {
      items.push(SERVER);
    }
  }

  if (store.isLoggedIn && currentSandbox && !currentSandbox.git) {
    items.push(GITHUB);
  }

  if (store.isLoggedIn) {
    items.push(DEPLOYMENT);
  }

  if (store.isLoggedIn) {
    items.push(LIVE);
  }

  return items;
}
