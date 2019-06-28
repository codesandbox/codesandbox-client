import getTemplate from '@codesandbox/common/lib/templates';

const PROJECT = {
  id: 'project',
  name: 'Sandbox Info',
};

const PROJECT_TEMPLATE = {
  ...PROJECT,
  name: 'Template Info',
};

const PROJECT_SUMMARY = {
  id: 'project-summary',
  name: 'Sandbox Info',
  hasCustomHeader: true,
};

const FILES = {
  id: 'files',
  name: 'Explorer',
  hasCustomHeader: true,
  defaultOpen: true,
};

const GITHUB = {
  id: 'github',
  name: 'GitHub',
};

const DEPLOYMENT = {
  id: 'deploy',
  name: 'Deployment',
};

const CONFIGURATION = {
  id: 'config',
  name: 'Configuration Files',
};

const LIVE = {
  id: 'live',
  name: 'Live',
};

const MORE = {
  id: 'more',
  name: 'More',
};

const SERVER = {
  id: 'server',
  name: 'Server Control Panel',
};

export default function getItems(store) {
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
    return [PROJECT_SUMMARY, CONFIGURATION, MORE];
  }

  const isCustomTemplate = !!currentSandbox.customTemplate;
  const items = [isCustomTemplate ? PROJECT_TEMPLATE : PROJECT, FILES];

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

  items.push(CONFIGURATION);

  if (store.isLoggedIn) {
    items.push(LIVE);
  }

  if (!store.isLoggedIn) {
    items.push(MORE);
  }

  return items;
}
