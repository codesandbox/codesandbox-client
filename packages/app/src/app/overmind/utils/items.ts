import getTemplate from '@codesandbox/common/lib/templates';

interface INavigationItem {
  id: string;
  name: string;
  hasCustomHeader?: boolean;
  defaultOpen?: boolean;
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
};

const DEPLOYMENT: INavigationItem = {
  id: 'deploy',
  name: 'Deployment',
};

const CONFIGURATION: INavigationItem = {
  id: 'config',
  name: 'Configuration Files',
};

const LIVE: INavigationItem = {
  id: 'live',
  name: 'Live',
};

const MORE: INavigationItem = {
  id: 'more',
  name: 'More',
};

const SERVER: INavigationItem = {
  id: 'server',
  name: 'Server Control Panel',
};

export default function getItems(store): INavigationItem[] {
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

  if (!store.editor.currentSandbox.owned) {
    return [PROJECT_SUMMARY, CONFIGURATION, MORE];
  }

  const isCustomTemplate = !!store.editor.currentSandbox.customTemplate;
  const items = [isCustomTemplate ? PROJECT_TEMPLATE : PROJECT, FILES];

  if (store.isLoggedIn && store.editor.currentSandbox) {
    const templateDef = getTemplate(store.editor.currentSandbox.template);
    if (templateDef.isServer) {
      items.push(SERVER);
    }
  }

  if (
    store.isLoggedIn &&
    store.editor.currentSandbox &&
    !store.editor.currentSandbox.git
  ) {
    items.push(GITHUB);
  }

  if (store.isLoggedIn) {
    items.push(DEPLOYMENT);
  }

  items.push(CONFIGURATION);

  if (store.isLoggedIn) {
    items.push(LIVE);
  }

  if (!store.isLoggedIn) {
    items.push(MORE);
  }

  return items;
}
