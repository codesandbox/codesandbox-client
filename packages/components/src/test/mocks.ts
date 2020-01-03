import { Module, Directory, Sandbox, User } from '../types';

export function noop(): void {
  // No operation performed.
}

export function createModule(index: number = 0, params?: Module & any): Module {
  return {
    title: `test-module${index}`,
    id: `longid-module${index}`,
    shortid: `shortid-module${index}`,
    isNotSynced: false,
    code: "import test from 'koekje'",
    directoryShortid: null,
    ...params,
  };
}

export function createDirectory(
  index: number = 0,
  params?: Directory & any
): Directory {
  return {
    title: `test-dir${index}`,
    id: `longid-dir${index}`,
    shortid: `shortid-dir${index}`,
    directoryShortid: null,
    ...params,
  };
}

export function createUser(index: number = 0, params?: User & any): User {
  return {
    id: `test-user${index}`,
    sandboxCount: index + 1,
    givenLikeCount: index + 1,
    avatarUrl: `https://avatar.nl/${index}.png`,
    name: `user-${index}`,
    username: `user-username-${index}`,
    ...params,
  };
}

export function createSandbox(
  index: number = 0,
  params?: Sandbox & any
): Sandbox {
  const id = `sandbox-id${index}`;
  return {
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
    ...params,
  };
}
