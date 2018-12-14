import { types } from 'mobx-state-tree';
import { UserSelection } from '../live/model';

const Author = types.model({
  avatarUrl: types.string,
  badges: types.array(
    types.model({
      id: types.string,
      name: types.string,
      visible: types.boolean,
    })
  ),
  forkedCount: types.number,
  givenLikeCount: types.number,
  id: types.string,
  name: types.maybeNull(types.string),
  receivedLikeCount: types.number,
  sandboxCount: types.number,
  showcasedSandboxShortid: types.maybeNull(types.string),
  subscriptionSince: types.maybeNull(types.string),
  username: types.string,
  viewCount: types.number,
});

const Team = types.model({
  id: types.string,
  name: types.string,
  roomId: types.maybeNull(types.string),
});

const Directory = types.model({
  directoryShortid: types.maybeNull(types.string),
  id: types.string,
  shortid: types.string,
  sourceId: types.string,
  title: types.string,
  insertedAt: types.string,
  updatedAt: types.string,
});

const Module = types.model({
  code: types.maybeNull(types.string),
  savedCode: types.maybeNull(types.string),
  directoryShortid: types.maybeNull(types.string),
  id: types.string,
  isBinary: types.maybeNull(types.boolean),
  shortid: types.string,
  sourceId: types.string,
  title: types.string,
  insertedAt: types.string,
  updatedAt: types.string,
});

const Git = types.model({
  branch: types.string,
  commitSha: types.maybeNull(types.string),
  path: types.string,
  repo: types.string,
  username: types.string,
});

export const Sandbox = types.model({
  author: types.maybeNull(Author),
  description: types.maybeNull(types.string),
  directories: types.array(Directory),
  entry: types.string,
  externalResources: types.array(types.string),
  forkCount: types.number,
  forkedFromSandbox: types.maybeNull(
    types.model({
      viewCount: types.number,
      updatedAt: types.string,
      title: types.maybeNull(types.string),
      template: types.maybeNull(types.string),
      privacy: types.number,
      likeCount: types.number,
      insertedAt: types.string,
      id: types.string,
      git: types.maybeNull(Git),
      forkCount: types.number,
    })
  ),
  git: types.maybeNull(Git),
  id: types.string,
  likeCount: types.number,
  modules: types.array(Module),
  npmDependencies: types.map(types.string),
  environmentVariables: types.maybeNull(types.map(types.string)),
  originalGit: types.maybeNull(Git),
  originalGitCommitSha: types.maybeNull(types.string),
  owned: types.boolean,
  isFrozen: types.boolean,
  privacy: types.number,
  sourceId: types.string,
  tags: types.array(types.string),
  template: types.maybeNull(types.string),
  title: types.maybeNull(types.string),
  userLiked: types.boolean,
  version: types.number,
  viewCount: types.number,
  team: types.maybeNull(Team),
  collection: types.maybeNull(
    types.union(
      types.boolean,
      types.model({
        path: types.string,
        id: types.string,
      })
    )
  ),
});

export default {
  currentId: types.maybeNull(types.string),
  currentModuleShortid: types.maybeNull(types.string),
  isForkingSandbox: types.boolean,
  mainModuleShortid: types.maybeNull(types.string),
  sandboxes: types.map(Sandbox),
  isLoading: types.boolean,
  notFound: types.boolean,
  error: types.maybeNull(types.string),
  isResizing: types.boolean,
  changedModuleShortids: types.array(types.string),
  pendingOperations: types.map(
    types.array(types.union(types.string, types.number))
  ),
  pendingUserSelections: types.array(
    types.model({
      userId: types.string,
      name: types.maybeNull(types.string),
      selection: types.maybeNull(UserSelection),
      color: types.maybeNull(types.array(types.number)),
    })
  ),
  currentTabId: types.maybeNull(types.string),
  tabs: types.array(
    types.union(
      types.model({
        type: types.literal('MODULE'),
        moduleShortid: types.string,
        dirty: types.boolean,
      }),
      types.model({
        id: types.string,
        type: types.literal('DIFF'),
        titleA: types.string,
        titleB: types.string,
        codeA: types.string,
        codeB: types.string,
        fileTitle: types.maybeNull(types.string),
      })
    )
  ),
  errors: types.array(
    types.model({
      column: types.maybeNull(types.number),
      line: types.maybeNull(types.number),
      message: types.string,
      title: types.string,
      moduleId: types.maybeNull(types.string),
    })
  ),
  glyphs: types.array(
    types.model({
      line: types.number,
      className: types.string,
      moduleId: types.string,
    })
  ),
  corrections: types.array(
    types.model({
      column: types.maybeNull(types.number),
      line: types.maybeNull(types.number),
      message: types.string,
      source: types.string,
      moduleId: types.maybeNull(types.string),
      severity: types.maybeNull(types.string),
    })
  ),
  isInProjectView: types.boolean,
  forceRender: types.number,
  initialPath: types.string,
  highlightedLines: types.array(types.number),
  isUpdatingPrivacy: types.boolean,
  quickActionsOpen: types.boolean,
  previewWindow: types.model({
    content: types.maybeNull(types.string),
    editorSize: types.maybe(types.number),
    width: types.maybeNull(types.number),
    height: types.maybeNull(types.number),
    x: types.maybeNull(types.number),
    y: types.maybeNull(types.number),
  }),
  themes: types.array(
    types.model({
      name: types.string,
      id: types.string,
      url: types.maybeNull(types.string),
      type: types.maybeNull(types.string),
    })
  ),
};
