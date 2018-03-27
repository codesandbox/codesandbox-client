const PROJECT = {
  id: 'project',
  name: 'Project Info',
};

const FILES = {
  id: 'files',
  name: 'File Editor',
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

export default function getItems(store) {
  if (
    store.live.isLive &&
    !(
      store.live.isOwner ||
      (store.user &&
        store.live &&
        store.live.roomInfo &&
        store.live.roomInfo.ownerId === store.user.id)
    )
  ) {
    return [FILES, LIVE];
  }

  const items = [PROJECT, FILES];

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

  return items;
}
