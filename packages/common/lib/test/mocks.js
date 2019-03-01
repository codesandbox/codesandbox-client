'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
function createModule(index = 0, params) {
  return Object.assign(
    {
      title: `test-module${index}`,
      id: `longid-module${index}`,
      shortid: `shortid-module${index}`,
      isNotSynced: false,
      code: "import test from 'koekje'",
      directoryShortid: null,
    },
    params
  );
}
exports.createModule = createModule;
function createDirectory(index = 0, params) {
  return Object.assign(
    {
      title: `test-dir${index}`,
      id: `longid-dir${index}`,
      shortid: `shortid-dir${index}`,
      directoryShortid: null,
    },
    params
  );
}
exports.createDirectory = createDirectory;
function createUser(index = 0, params) {
  return Object.assign(
    {
      id: `test-user${index}`,
      sandboxCount: index + 1,
      givenLikeCount: index + 1,
      avatarUrl: `https://avatar.nl/${index}.png`,
      name: `user-${index}`,
      username: `user-username-${index}`,
    },
    params
  );
}
exports.createUser = createUser;
function createSandbox(index = 0, params) {
  const id = `sandbox-id${index}`;
  return Object.assign(
    {
      title: `Test Sandbox${index}`,
      id,
      author: undefined,
      currentModule: null,
      dependencyBundle: {},
      modules: [createModule()],
      directories: [createDirectory()],
      externalResources: [],
      userLiked: false,
      owned: false,
    },
    params
  );
}
exports.createSandbox = createSandbox;
