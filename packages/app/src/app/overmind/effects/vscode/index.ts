import * as childProcess from 'node-services/lib/child_process';
import {
  Module,
  ModuleError,
  ModuleCorrection,
  Settings,
} from '@codesandbox/common/lib/types';
import { manager } from './manager';
import { EXTENSIONS_LOCATION } from './manager/constants';
import { getTypeFetcher } from './manager/extensionHostWorker/common/type-downloader';
import {
  initializeCustomTheme,
  initializeExtensionsFolder,
  initializeSettings,
  initializeThemeCache,
  setVimExtensionEnabled,
} from './manager/initializers';

declare global {
  interface Window {
    BrowserFS: any;
    getState: any;
    getSignal: any;
  }
}

export default {
  initialize(
    settings: Settings,
    onChange: (moduleShortid: string, code: string) => void
  ) {
    // Configures BrowserFS to use the LocalStorage file system.
    return new Promise((resolve, reject) => {
      window.BrowserFS.configure(
        {
          fs: 'MountableFileSystem',
          options: {
            '/': { fs: 'InMemory', options: {} },
            '/sandbox': {
              fs: 'CodeSandboxEditorFS',
              options: {
                api: {
                  getState: () => ({
                    modulesByPath: window.getState().editor.currentSandbox
                      ? window.getState().editor.modulesByPath
                      : {},
                  }),
                },
              },
            },
            '/sandbox/node_modules': {
              fs: 'CodeSandboxFS',
              options: getTypeFetcher().options,
            },
            '/vscode': {
              fs: 'LocalStorage',
            },
            '/home': {
              fs: 'LocalStorage',
            },
            '/extensions': {
              fs: 'BundledHTTPRequest',
              options: {
                index: EXTENSIONS_LOCATION + '/extensions/index.json',
                baseUrl: EXTENSIONS_LOCATION + '/extensions',
                bundle: EXTENSIONS_LOCATION + '/bundles/main.min.json',
                logReads: process.env.NODE_ENV === 'development',
              },
            },
            '/extensions/custom-theme': {
              fs: 'InMemory',
            },
          },
        },
        async e => {
          if (e) {
            reject(e);
          } else {
            // For first-timers initialize a theme in the cache so it doesn't jump colors
            initializeExtensionsFolder();
            initializeCustomTheme();
            initializeThemeCache();
            initializeSettings();
            setVimExtensionEnabled(
              localStorage.getItem('settings.vimmode') === 'true'
            );

            // eslint-disable-next-line global-require
            manager.loadScript(['vs/editor/codesandbox.editor.main'], () => {
              if (process.env.NODE_ENV === 'development') {
                console.log('Loaded Monaco'); // eslint-disable-line
              }
              manager.acquireController({
                getSignal: window.getSignal,
                getState: window.getState,
              });

              import(
                // @ts-ignore
                'worker-loader?publicPath=/&name=ext-host-worker.[hash:8].worker.js!./manager/extensionHostWorker/bootstrappers/ext-host'
              ).then(ExtHostWorkerLoader => {
                childProcess.addDefaultForkHandler(ExtHostWorkerLoader.default);
                resolve();
              });
            });
          }
        }
      );
    });
  },
  callCallbackError(id: string, message?: string) {
    // @ts-ignore
    if (window.cbs && window.cbs[id]) {
      const errorMessage =
        message || 'Something went wrong while saving the file.';
      // @ts-ignore
      window.cbs[id](new Error(errorMessage), undefined);
      // @ts-ignore
      delete window.cbs[id];
    }
  },
  callCallback(id: string) {
    // @ts-ignore
    if (window.cbs && window.cbs[id]) {
      // @ts-ignore
      window.cbs[id](undefined, undefined);
      // @ts-ignore
      delete window.cbs[id];
    }
  },
  runCommand(command: string): Promise<void> {
    // @ts-ignore
    return manager.runCommand(command);
  },
  async createMenubar(el: HTMLElement) {
    const part = await manager.getMenubarPart();

    part.create(el);
  },
  setVimExtensionEnabled(enabled: boolean) {
    setVimExtensionEnabled(enabled);
  },
  /*
    API FOR NEW VSCODE
  */
  // This editor thing could be put in its own file
  editor: {
    mount({
      container,
      editorElement,
      statusBar,
      root,
    }: {
      [key: string]: HTMLElement;
    }) {
      // FROM - VSCode/MonacoReactComponent
      // Should start manager.initializeEditor by giving it the elements to operate on
      // Monaco instance is grabbed from "window", should probably be set up inside here too
      // Why is Configuration inside VSCode? Could it not just be an overlay?
      // Expose "editorAPI" on this effect instead
      //
      // FROM - VSCode/index
      // Should start lint worker
      // The codesandboxAPIListener is already active in Overmind, so can talk to editor directly, check "setupCodeSandboxAPIListener"
      // Listen to selections
      // Listen to model added and removed, manage model listeners by path. Check "getModelContentChangeListener"
      //    - should only use "onChange", all this live check and send transform should happen in the action managing changes
      //    - Linting should also happen from within this effect
      // Listen to active editor change
      // "configureEditor" method. "Editor" is "editorAPI". Monaco is global on window, not sure how it gets there
      // Not quite sure what "commitLibChangesInstantly" does
    },
    unmount() {
      // FROM - VSCode/MonacoReactComponent
      // "destroyMonaco" method
    },
    changeSize(width: number, height: number) {},
    changeOptions(options: { readOnly: boolean }) {},
    changeActiveModule(
      module: Module,
      {
        errors = [],
        corrections = [],
      }: { errors?: ModuleError[]; corrections?: ModuleCorrection[] }
    ) {},
    updateModules(modules: Module[]) {},
  },
};
