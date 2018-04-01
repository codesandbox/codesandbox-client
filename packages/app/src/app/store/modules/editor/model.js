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
  name: types.maybe(types.string),
  receivedLikeCount: types.number,
  sandboxCount: types.number,
  showcasedSandboxShortid: types.maybe(types.string),
  subscriptionSince: types.maybe(types.string),
  username: types.string,
  viewCount: types.number,
});

const Directory = types.model({
  directoryShortid: types.maybe(types.string),
  id: types.string,
  shortid: types.string,
  sourceId: types.string,
  title: types.string,
});

const Module = types.model({
  code: types.maybe(types.string),
  directoryShortid: types.maybe(types.string),
  id: types.string,
  isBinary: types.maybe(types.boolean),
  shortid: types.string,
  sourceId: types.string,
  title: types.string,
});

const Git = types.model({
  branch: types.string,
  commitSha: types.maybe(types.string),
  path: types.string,
  repo: types.string,
  username: types.string,
});

const Sandbox = types.model({
  author: types.maybe(Author),
  description: types.maybe(types.string),
  directories: types.array(Directory),
  entry: types.string,
  externalResources: types.array(types.string),
  forkCount: types.number,
  forkedFromSandbox: types.maybe(
    types.model({
      viewCount: types.number,
      updatedAt: types.string,
      title: types.maybe(types.string),
      template: types.maybe(types.string),
      privacy: types.number,
      likeCount: types.number,
      insertedAt: types.string,
      id: types.string,
      git: types.maybe(Git),
      forkCount: types.number,
    })
  ),
  git: types.maybe(Git),
  id: types.string,
  likeCount: types.number,
  modules: types.array(Module),
  npmDependencies: types.map(types.string),
  originalGit: types.maybe(Git),
  originalGitCommitSha: types.maybe(types.string),
  owned: types.boolean,
  privacy: types.number,
  sourceId: types.string,
  tags: types.array(types.string),
  template: types.maybe(types.string),
  title: types.maybe(types.string),
  userLiked: types.boolean,
  version: types.number,
  viewCount: types.number,
});

export default {
  currentId: types.maybe(types.string),
  currentModuleShortid: types.maybe(types.string),
  isForkingSandbox: types.boolean,
  mainModuleShortid: types.maybe(types.string),
  sandboxes: types.map(Sandbox),
  isLoading: types.boolean,
  notFound: types.boolean,
  error: types.maybe(types.string),
  isResizing: types.boolean,
  changedModuleShortids: types.array(types.string),
  pendingOperation: types.maybe(
    types.array(types.union(types.string, types.number))
  ),
  pendingUserSelections: types.array(
    types.model({
      userId: types.string,
      name: types.maybe(types.string),
      selection: types.maybe(UserSelection),
      color: types.maybe(types.array(types.number)),
    })
  ),
  tabs: types.array(
    types.model({
      type: types.string,
      moduleShortid: types.string,
      dirty: types.boolean,
    })
  ),
  errors: types.array(
    types.model({
      column: types.maybe(types.number),
      line: types.maybe(types.number),
      message: types.string,
      title: types.string,
      moduleId: types.maybe(types.string),
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
      column: types.maybe(types.number),
      line: types.maybe(types.number),
      message: types.string,
      source: types.string,
      moduleId: types.maybe(types.string),
      severity: types.maybe(types.string),
    })
  ),
  isInProjectView: types.boolean,
  forceRender: types.number,
  initialPath: types.string,
  highlightedLines: types.array(types.number),
  isUpdatingPrivacy: types.boolean,
  quickActionsOpen: types.boolean,
  previewWindow: types.model({
    content: types.maybe(types.string),
    width: types.maybe(types.number),
    height: types.maybe(types.number),
    x: types.maybe(types.number),
    y: types.maybe(types.number),
  }),
};
