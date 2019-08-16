import {
  Sandbox,
  EditorSelection,
  EditorError,
  EditorCorrection,
  WindowOrientation,
  Module,
  Tabs,
  DiffTab,
  ModuleTab,
} from '@codesandbox/common/lib/types';
import { generateFileFromSandbox } from '@codesandbox/common/lib/templates/configuration/package-json';
import { dirname } from 'path';
import { parseSandboxConfigurations } from '@codesandbox/common/lib/templates/configuration/parse-sandbox-configurations';
import {
  getModulePath,
  getDirectoryPath,
} from '@codesandbox/common/lib/sandbox/modules';
import { Derive } from 'app/overmind';
import { mainModule as getMainModule } from '../../utils/main-module';
import getTemplate from '@codesandbox/common/lib/templates';

type State = {
  currentId: string;
  currentModuleShortid: string;
  isForkingSandbox: boolean;
  mainModuleShortid: string;
  sandboxes: {
    [id: string]: Sandbox;
  };
  isLoading: boolean;
  notFound: boolean;
  error: string;
  isResizing: boolean;
  changedModuleShortids: string[];
  pendingOperations: {
    [id: string]: Array<string | number>;
  };
  pendingUserSelections: EditorSelection[];
  currentTabId: string;
  tabs: Tabs;
  errors: EditorError[];
  corrections: EditorCorrection[];
  isInProjectView: boolean;
  forceRender: number;
  initialPath: string;
  highlightedLines: number[];
  isUpdatingPrivacy: boolean;
  quickActionsOpen: boolean;
  previewWindowVisible: boolean;
  previewWindowOrientation: WindowOrientation;
  isAllModulesSynced: boolean;
  currentSandbox: Sandbox;
  currentModule: Module;
  mainModule: Module;
  currentPackageJSON: Module;
  currentPackageJSONCode: string;
  parsedConfigurations: any;
  currentTab: ModuleTab | DiffTab;
  modulesByPath: {
    [path: string]: Module;
  };
  isAdvancedEditor: boolean;
  isModuleSynced: Derive<State, (moduleShortid: string) => boolean>;
  shouldDirectoryBeOpen: Derive<State, (directoryShortid: string) => boolean>;
};

export const state: State = {
  sandboxes: {},
  currentId: null,
  isForkingSandbox: false,
  currentModuleShortid: null,
  mainModuleShortid: null,
  isLoading: true,
  notFound: false,
  error: null,
  isResizing: false,
  changedModuleShortids: [],
  currentTabId: null,
  tabs: [],
  errors: [],
  corrections: [],
  pendingOperations: {},
  pendingUserSelections: [],
  isInProjectView: false,
  forceRender: 0,
  initialPath: '/',
  highlightedLines: [],
  isUpdatingPrivacy: false,
  quickActionsOpen: false,
  previewWindowVisible: true,
  previewWindowOrientation:
    window.innerHeight / window.innerWidth > 0.9
      ? WindowOrientation.HORIZONTAL
      : WindowOrientation.VERTICAL,
  get currentSandbox() {
    const state: State = this;

    return state.sandboxes[state.currentId];
  },
  get isAllModulesSynced() {
    const state: State = this;

    return !state.changedModuleShortids.length;
  },
  get currentModule() {
    const state: State = this;

    return (
      (state.currentSandbox &&
        state.currentSandbox.modules.find(
          module => module.shortid === state.currentModuleShortid
        )) ||
      null
    );
  },
  // This would benefit being a derived
  get modulesByPath() {
    const state: State = this;
    const modulesObject = {};

    if (!state.currentSandbox) {
      return modulesObject;
    }

    state.currentSandbox.modules.forEach(m => {
      const path = getModulePath(
        state.currentSandbox.modules,
        state.currentSandbox.directories,
        m.id
      );
      if (path) {
        modulesObject[path] = { ...m, type: 'file' };
      }
    });

    state.currentSandbox.directories.forEach(d => {
      const path = getDirectoryPath(
        state.currentSandbox.modules,
        state.currentSandbox.directories,
        d.id
      );

      // If this is a single directory with no children
      if (!Object.keys(modulesObject).some(p => dirname(p) === path)) {
        modulesObject[path] = { ...d, type: 'directory' };
      }
    });

    return modulesObject;
  },
  get currentTab() {
    const state: State = this;
    const currentTabId = state.currentTabId;
    const tabs = state.tabs;
    const currentModuleShortid = state.currentModuleShortid;

    if (currentTabId) {
      const foundTab = state.tabs.find(
        tab => 'id' in tab && tab.id === currentTabId
      );

      if (foundTab) {
        return foundTab;
      }
    }

    return tabs.find(
      tab =>
        'moduleShortid' in tab && tab.moduleShortid === currentModuleShortid
    );
  },
  /**
   * We have two types of editors in CodeSandbox: an editor focused on smaller projects and
   * an editor that works with bigger projects that run on a container. The advanced editor
   * only has added features, so it's a subset on top of the existing editor.
   */
  get isAdvancedEditor() {
    const state: State = this;

    if (!state.currentSandbox) {
      return false;
    }

    const isServer = getTemplate(state.currentSandbox.template).isServer;

    return isServer && state.currentSandbox.owned;
  },
  get parsedConfigurations() {
    const state: State = this;

    return state.currentSandbox
      ? parseSandboxConfigurations(state.currentSandbox)
      : null;
  },
  get mainModule() {
    const state: State = this;

    return state.currentSandbox
      ? getMainModule(state.currentSandbox, state.parsedConfigurations)
      : null;
  },
  get currentPackageJSON() {
    const state: State = this;

    if (!state.currentSandbox) {
      return null;
    }

    const module = state.currentSandbox.modules.find(
      m => m.directoryShortid == null && m.title === 'package.json'
    );

    return module;
  },
  get currentPackageJSONCode() {
    const state: State = this;

    if (!state.currentPackageJSON) {
      return null;
    }

    return state.currentPackageJSON
      ? state.currentPackageJSON.code
      : generateFileFromSandbox(state.currentSandbox);
  },
  isModuleSynced: state => moduleShortid => {
    return state.changedModuleShortids.indexOf(moduleShortid) === -1;
  },
  shouldDirectoryBeOpen: state => directoryShortid => {
    const { modules, directories } = state.currentSandbox;
    const currentModuleId = state.currentModule.id;
    const currentModuleParents = getModuleParents(
      modules,
      directories,
      currentModuleId
    );
    const isParentOfModule = currentModuleParents.includes(directoryShortid);

    return isParentOfModule;
  },
};

// This should be moved somewhere else
function getModuleParents(modules, directories, id) {
  const module = modules.find(moduleEntry => moduleEntry.id === id);

  if (!module) return [];

  let directory = directories.find(
    directoryEntry => directoryEntry.shortid === module.directoryShortid
  );
  let directoryIds = [];
  while (directory != null) {
    directoryIds = [...directoryIds, directory.id];
    directory = directories.find(
      directoryEntry => directoryEntry.shortid === directory.directoryShortid // eslint-disable-line
    );
  }

  return directoryIds;
}
