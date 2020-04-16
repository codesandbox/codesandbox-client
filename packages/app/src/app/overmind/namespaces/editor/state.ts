import getTemplate from '@codesandbox/common/lib/templates';
import { generateFileFromSandbox } from '@codesandbox/common/lib/templates/configuration/package-json';
import { getPreviewTabs } from '@codesandbox/common/lib/templates/devtools';
import {
  ParsedConfigurationFiles,
  ViewConfig,
} from '@codesandbox/common/lib/templates/template';
import {
  DevToolsTabPosition,
  DiffTab,
  Module,
  ModuleCorrection,
  ModuleError,
  ModuleTab,
  Sandbox,
  SandboxFs,
  Tabs,
  WindowOrientation,
  Directory,
} from '@codesandbox/common/lib/types';
import { getSandboxOptions } from '@codesandbox/common/lib/url';
import { CollaboratorFragment, InvitationFragment } from 'app/graphql/types';
import { Derive } from 'app/overmind';
import immer from 'immer';

import { mainModule as getMainModule } from '../../utils/main-module';
import { parseConfigurations } from '../../utils/parse-configurations';

type State = {
  /**
   * Never use this! It doesn't reflect the id of the current sandbox. Use editor.currentSandbox.id instead.
   */
  currentId: string | null;
  currentModuleShortid: string | null;
  isForkingSandbox: boolean;
  mainModuleShortid: string | null;
  sandboxes: {
    [id: string]: Sandbox;
  };
  collaborators: CollaboratorFragment[];
  invitations: InvitationFragment[];
  // TODO: What is this really? Could not find it in Cerebral, but
  // EditorPreview is using it... weird stuff
  devToolTabs: Derive<State, ViewConfig[]>;
  isLoading: boolean;
  error: {
    status: number;
    message: string;
  } | null;
  isResizing: boolean;
  changedModuleShortids: Derive<State, string[]>;
  currentTabId: string | null;
  tabs: Tabs;
  errors: ModuleError[];
  corrections: ModuleCorrection[];
  isInProjectView: boolean;
  initialPath: string;
  highlightedLines: number[];
  isUpdatingPrivacy: boolean;
  quickActionsOpen: boolean;
  previewWindowVisible: boolean;
  workspaceConfigCode: string;
  statusBar: boolean;
  previewWindowOrientation: WindowOrientation;
  canWriteCode: Derive<State, boolean>;
  isAllModulesSynced: Derive<State, boolean>;
  currentSandbox: Derive<State, Sandbox | null>;
  currentModule: Derive<State, Module>;
  mainModule: Derive<State, Module | null>;
  currentPackageJSON: Derive<State, Module | null>;
  currentPackageJSONCode: Derive<State, string | null>;
  parsedConfigurations: Derive<State, ParsedConfigurationFiles | null>;
  currentTab: Derive<State, ModuleTab | DiffTab | undefined>;
  modulesByPath: SandboxFs;
  isAdvancedEditor: Derive<State, boolean>;
  shouldDirectoryBeOpen: Derive<State, (directoryShortid: string) => boolean>;
  currentDevToolsPosition: DevToolsTabPosition;
  sessionFrozen: boolean;
  hasLoadedInitialModule: boolean;
};

export const state: State = {
  hasLoadedInitialModule: false,
  sandboxes: {},
  currentId: null,
  isForkingSandbox: false,
  currentModuleShortid: null,
  mainModuleShortid: null,
  isLoading: true,
  error: null,
  isResizing: false,
  modulesByPath: {},
  collaborators: [],
  invitations: [],
  changedModuleShortids: ({ currentSandbox }) => {
    if (!currentSandbox) {
      return [];
    }

    return currentSandbox.modules.reduce((aggr, module) => {
      if (module.savedCode !== null && module.savedCode !== module.code) {
        return aggr.concat(module.shortid);
      }

      return aggr;
    }, [] as string[]);
  },
  currentTabId: null,
  tabs: [],
  errors: [],
  sessionFrozen: true,
  corrections: [],
  isInProjectView: false,
  initialPath: '/',
  highlightedLines: [],
  isUpdatingPrivacy: false,
  quickActionsOpen: false,
  previewWindowVisible: true,
  statusBar: true,
  previewWindowOrientation:
    window.innerHeight / window.innerWidth > 0.9
      ? WindowOrientation.HORIZONTAL
      : WindowOrientation.VERTICAL,

  /**
   * Normally we save this code in a file (.codesandbox/workspace.json), however, when someone
   * doesn't own a sandbox and changes the UI we don't want to fork the sandbox (yet). That's
   * why we introduce this field until we have datasources. When we have datasources we can store
   * the actual content in the localStorage.
   */
  workspaceConfigCode: '',
  currentDevToolsPosition: {
    devToolIndex: 0,
    tabPosition: 0,
  },
  canWriteCode: ({ currentSandbox }) =>
    currentSandbox?.authorization === 'write_code',
  currentSandbox: ({ sandboxes, currentId }) => {
    if (currentId && sandboxes[currentId]) {
      return sandboxes[currentId];
    }

    return null;
  },

  isAllModulesSynced: ({ changedModuleShortids }) =>
    !changedModuleShortids.length,
  currentModule: ({ currentSandbox, currentModuleShortid }) =>
    (currentSandbox &&
      currentSandbox.modules.find(
        module => module.shortid === currentModuleShortid
      )) ||
    ({} as Module),
  currentTab: ({ currentTabId, currentModuleShortid, tabs }) => {
    if (currentTabId) {
      const foundTab = tabs.find(tab => 'id' in tab && tab.id === currentTabId);

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
  isAdvancedEditor: ({ currentSandbox }) => {
    if (!currentSandbox) {
      return false;
    }

    const { isServer } = getTemplate(currentSandbox.template);

    return isServer && currentSandbox.owned;
  },
  parsedConfigurations: ({ currentSandbox }) =>
    currentSandbox ? parseConfigurations(currentSandbox) : null,
  mainModule: ({ currentSandbox, parsedConfigurations }) =>
    currentSandbox ? getMainModule(currentSandbox, parsedConfigurations) : null,
  currentPackageJSON: ({ currentSandbox }) => {
    if (!currentSandbox) {
      return null;
    }

    const module = currentSandbox.modules.find(
      m => m.directoryShortid == null && m.title === 'package.json'
    );

    return module || null;
  },
  currentPackageJSONCode: ({ currentSandbox, currentPackageJSON }) => {
    if (!currentPackageJSON || !currentSandbox) {
      return null;
    }

    return currentPackageJSON.code
      ? currentPackageJSON.code
      : generateFileFromSandbox(currentSandbox);
  },
  shouldDirectoryBeOpen: ({ currentSandbox, currentModule }) => (
    directoryShortid: string
  ) => {
    if (!currentSandbox) {
      return false;
    }

    const { modules, directories } = currentSandbox;
    const currentModuleId = currentModule.id;
    const currentModuleParents = getModuleParents(
      modules,
      directories,
      currentModuleId
    );
    const isParentOfModule = currentModuleParents.includes(directoryShortid);

    return isParentOfModule;
  },
  devToolTabs: ({
    currentSandbox: sandbox,
    parsedConfigurations,
    workspaceConfigCode: intermediatePreviewCode,
  }) => {
    if (!sandbox || !parsedConfigurations) {
      return [];
    }

    const views = getPreviewTabs(
      sandbox,
      parsedConfigurations,
      intermediatePreviewCode
    );

    // Do it in an immutable manner, prevents changing the original object
    return immer(views, draft => {
      const sandboxConfig = sandbox.modules.find(
        x => x.directoryShortid == null && x.title === 'sandbox.config.json'
      );
      let view = 'browser';
      if (sandboxConfig) {
        try {
          view = JSON.parse(sandboxConfig.code || '').view || 'browser';
        } catch (e) {
          /* swallow */
        }
      }

      const sandboxOptions = getSandboxOptions(location.href);
      if (
        sandboxOptions.previewWindow &&
        (sandboxOptions.previewWindow === 'tests' ||
          sandboxOptions.previewWindow === 'console')
      ) {
        // Backwards compatibility for ?previewwindow=

        view = sandboxOptions.previewWindow;
      }

      if (view !== 'browser') {
        // Backwards compatibility for sandbox.config.json
        if (view === 'console') {
          draft[0].views = draft[0].views.filter(
            t => t.id !== 'codesandbox.console'
          );
          draft[0].views.unshift({ id: 'codesandbox.console' });
        } else if (view === 'tests') {
          draft[0].views = draft[0].views.filter(
            t => t.id !== 'codesandbox.tests'
          );
          draft[0].views.unshift({ id: 'codesandbox.tests' });
        }
      }
    });
  },
};

// This should be moved somewhere else
function getModuleParents(
  modules: Module[],
  directories: Directory[],
  id: string
): string[] {
  const module = modules.find(moduleEntry => moduleEntry.id === id);

  if (!module) return [];

  let directory = directories.find(
    directoryEntry => directoryEntry.shortid === module.directoryShortid
  );
  let directoryIds: string[] = [];
  while (directory != null) {
    directoryIds = [...directoryIds, directory!.id];
    directory = directories.find(
      directoryEntry => directoryEntry.shortid === directory!.directoryShortid // eslint-disable-line
    );
  }

  return directoryIds;
}
