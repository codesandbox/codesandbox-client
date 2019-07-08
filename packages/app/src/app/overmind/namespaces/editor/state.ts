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
import themes from '@codesandbox/common/lib/themes';
import { dirname } from 'path';
import { parseConfigurations } from '../../utils/parse-configurations';
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
  themes: typeof themes;
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
  themes,
  get currentSandbox(this: State) {
    return this.sandboxes[this.currentId];
  },
  get isAllModulesSynced(this: State) {
    return !this.changedModuleShortids.length;
  },
  get currentModule(this: State) {
    return (
      this.currentSandbox.modules.find(
        module => module.shortid === this.currentModuleShortid
      ) || null
    );
  },
  // This would benefit being a derived
  get modulesByPath(this: State) {
    const modulesObject = {};

    this.currentSandbox.modules.forEach(m => {
      const path = getModulePath(
        this.currentSandbox.modules,
        this.currentSandbox.directories,
        m.id
      );
      if (path) {
        modulesObject[path] = { ...m, type: 'file' };
      }
    });

    this.currentSandbox.directories.forEach(d => {
      const path = getDirectoryPath(
        this.currentSandbox.modules,
        this.currentSandbox.directories,
        d.id
      );

      // If this is a single directory with no children
      if (!Object.keys(modulesObject).some(p => dirname(p) === path)) {
        modulesObject[path] = { ...d, type: 'directory' };
      }
    });

    return modulesObject;
  },
  get currentTab(this: State) {
    const currentTabId = this.currentTabId;
    const tabs = this.tabs;
    const currentModuleShortid = this.currentModuleShortid;

    if (currentTabId) {
      const foundTab = this.tabs.find(
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
  get isAdvancedEditor(this: State) {
    if (!this.currentSandbox) {
      return false;
    }

    const isServer = getTemplate(this.currentSandbox.template).isServer;

    return isServer && this.currentSandbox.owned;
  },
  get parsedConfigurations(this: State) {
    return parseConfigurations(this.currentSandbox);
  },
  get mainModule(this: State) {
    return getMainModule(this.currentSandbox, this.parsedConfigurations);
  },
  get currentPackageJSON(this: State) {
    const module = this.currentSandbox.modules.find(
      m => m.directoryShortid == null && m.title === 'package.json'
    );

    return module;
  },
  get currentPackageJSONCode(this: State) {
    return this.currentPackageJSON
      ? this.currentPackageJSON.code
      : generateFileFromSandbox(this.currentSandbox);
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
