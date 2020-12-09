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
  Directory,
  Module,
  ModuleCorrection,
  ModuleError,
  ModuleTab,
  Sandbox,
  SandboxFs,
  Tabs,
  WindowOrientation,
} from '@codesandbox/common/lib/types';
import { getSandboxOptions } from '@codesandbox/common/lib/url';
import { CollaboratorFragment, InvitationFragment } from 'app/graphql/types';
import { RecoverData } from 'app/overmind/effects/moduleRecover.ts';
import immer from 'immer';
import { derived } from 'overmind';

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
  devToolTabs: ViewConfig[];
  isLoading: boolean;
  error: {
    status: number;
    message: string;
  } | null;
  isResizing: boolean;
  changedModuleShortids: string[];
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
  workspaceConfig: {
    'responsive-preview'?: {
      [preset: string]: [number, number];
    };
  } | null;
  statusBar: boolean;
  previewWindowOrientation: WindowOrientation;
  canWriteCode: boolean;
  isAllModulesSynced: boolean;
  currentSandbox: Sandbox | null;
  currentModule: Module;
  mainModule: Module | null;
  currentPackageJSON: Module | null;
  currentPackageJSONCode: string | null;
  parsedConfigurations: ParsedConfigurationFiles | null;
  currentTab: ModuleTab | DiffTab | undefined;
  modulesByPath: SandboxFs;
  isAdvancedEditor: boolean;
  shouldDirectoryBeOpen: (params: {
    directoryId: string;
    module?: Module;
  }) => boolean;
  currentDevToolsPosition: DevToolsTabPosition;
  sessionFrozen: boolean;
  hasLoadedInitialModule: boolean;
  recoveredFiles: Array<{ recoverData: RecoverData; module: Module }>;
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
  changedModuleShortids: derived(({ currentSandbox }: State) => {
    if (!currentSandbox) {
      return [];
    }

    return currentSandbox.modules.reduce((aggr, module) => {
      if (module.savedCode !== null && module.savedCode !== module.code) {
        return aggr.concat(module.shortid);
      }

      return aggr;
    }, [] as string[]);
  }),
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
  recoveredFiles: [],
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
  workspaceConfig: derived(
    ({ currentSandbox, modulesByPath, workspaceConfigCode }: State) => {
      if (!currentSandbox) {
        return null;
      }

      if (currentSandbox.owned) {
        return modulesByPath['/.codesandbox/workspace.json']
          ? JSON.parse(
              (modulesByPath['/.codesandbox/workspace.json'] as Module).code
            )
          : null;
      }

      return workspaceConfigCode ? JSON.parse(workspaceConfigCode) : null;
    }
  ),
  currentDevToolsPosition: {
    devToolIndex: 0,
    tabPosition: 0,
  },
  canWriteCode: derived(
    ({ currentSandbox }: State) =>
      currentSandbox?.authorization === 'write_code'
  ),
  currentSandbox: derived(({ sandboxes, currentId }: State) => {
    if (currentId && sandboxes[currentId]) {
      return sandboxes[currentId];
    }

    return null;
  }),

  isAllModulesSynced: derived(
    ({ changedModuleShortids }: State) => !changedModuleShortids.length
  ),
  currentModule: derived(
    ({ currentSandbox, currentModuleShortid }: State) =>
      (currentSandbox &&
        currentSandbox.modules.find(
          module => module.shortid === currentModuleShortid
        )) ||
      ({} as Module)
  ),
  currentTab: derived(({ currentTabId, currentModuleShortid, tabs }: State) => {
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
  }),
  /**
   * We have two types of editors in CodeSandbox: an editor focused on smaller projects and
   * an editor that works with bigger projects that run on a container. The advanced editor
   * only has added features, so it's a subset on top of the existing editor.
   */
  isAdvancedEditor: derived(({ currentSandbox }: State) => {
    if (!currentSandbox) {
      return false;
    }

    const { isServer } = getTemplate(currentSandbox.template);

    return isServer && currentSandbox.owned;
  }),
  parsedConfigurations: derived(({ currentSandbox }: State) =>
    currentSandbox ? parseConfigurations(currentSandbox) : null
  ),
  mainModule: derived(({ currentSandbox, parsedConfigurations }: State) =>
    currentSandbox ? getMainModule(currentSandbox, parsedConfigurations) : null
  ),
  currentPackageJSON: derived(({ currentSandbox }: State) => {
    if (!currentSandbox) {
      return null;
    }

    const module = currentSandbox.modules.find(
      m => m.directoryShortid == null && m.title === 'package.json'
    );

    return module || null;
  }),
  currentPackageJSONCode: derived(
    ({ currentSandbox, currentPackageJSON }: State) => {
      if (!currentPackageJSON || !currentSandbox) {
        return null;
      }

      return currentPackageJSON.code
        ? currentPackageJSON.code
        : generateFileFromSandbox(currentSandbox);
    }
  ),
  shouldDirectoryBeOpen: derived(
    ({ currentSandbox, currentModule }: State) => ({
      directoryId,
      module = currentModule,
    }) => {
      if (!currentSandbox) {
        return false;
      }

      const { modules, directories } = currentSandbox;
      const currentModuleId = module.id;
      const currentModuleParents = getModuleParents(
        modules,
        directories,
        currentModuleId
      );

      const isParentOfModule = currentModuleParents.includes(directoryId);

      return isParentOfModule;
    }
  ),
  devToolTabs: derived(
    ({
      currentSandbox: sandbox,
      parsedConfigurations,
      workspaceConfigCode: intermediatePreviewCode,
    }: State) => {
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
    }
  ),
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
