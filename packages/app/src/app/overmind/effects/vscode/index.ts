import {
  EditorSelection,
  Module,
  Sandbox,
} from '@codesandbox/common/lib/types';
import { Reaction } from 'app/overmind';
import * as childProcess from 'node-services/lib/child_process';

import { manager } from './manager';
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

let reactionDisposers: Function[];
let _reaction: Reaction;
let _editor;

export default {
  initialize(options: { createReaction: Reaction }) {
    _reaction = options.createReaction;
    return new Promise((resolve, reject) => {
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
        )
          .then(ExtHostWorkerLoader => {
            childProcess.addDefaultForkHandler(ExtHostWorkerLoader.default);
            resolve();
          })
          .catch(reject);
      });
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
    /*
    {
      container,
      editorElement,
      statusBar,
      root,
    }: {
      [key: string]: HTMLElement;
    }
    */
    mount(editor: any) {
      // To be removed when VSCode has full control
      _editor = editor;
      // _editor.changeSettings(settings);
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

      reactionDisposers = [
        _reaction(
          state => state.editor.errors,
          errors => {
            _editor.editor.setErrors(errors);
          },
          {
            nested: true,
          }
        ),
        _reaction(
          state => state.editor.corrections,
          corrections => {
            _editor.editor.setCorrections(corrections);
          },
          {
            nested: true,
          }
        ),
        _reaction(
          state => state.editor.modulePaths,
          () => {
            _editor.updateModules();
          }
        ),
        _reaction(
          state => state.preferences.settings,
          newSettings => {
            if (!_editor) {
              return;
            }

            _editor.changeSettings(newSettings);
          },
          {
            nested: true,
          }
        ),
        _reaction(
          state => state.editor.parsedConfigurations.package,
          packageConfiguration => {
            if (packageConfiguration.parsed) {
              _editor.changeDependencies(
                packageConfiguration.parsed.dependencies || {}
              );
            }
          }
        ),
        _reaction(
          state => state.editor.parsedConfigurations.typescript,
          typescript => {
            if (typescript && typescript.parsed) {
              _editor.setTSConfig(typescript.parsed);
            }
          }
        ),
        _reaction(
          state => state.live.receivingCode,
          isReceivingCode => {
            _editor.setReceivingCode(isReceivingCode);
          }
        ),
        _reaction(
          state => state.editor.changedModuleShortids,
          () => {
            _editor.moduleSyncedChanged();
          },
          {
            nested: true,
          }
        ),
      ];
    },
    unmount() {
      // FROM - VSCode/MonacoReactComponent
      // "destroyMonaco" method

      reactionDisposers.forEach(dispose => dispose());
    },
    changeSandbox(
      sandbox: Sandbox,
      currentModule: Module,
      dependencies: { [key: string]: string }
    ) {
      if (_editor) {
        _editor.changeSandbox(sandbox, currentModule, dependencies);
      }
    },
    // Seems to only get one transformation at a time, why all?
    // And why even have it in state as it seems to come directly
    // from live message?
    applyOperations(operations: { [x: string]: (string | number)[] }) {
      _editor.setReceivingCode(true);
      _editor.applyOperations(operations);
      _editor.setReceivingCode(false);
    },
    // In previous version these userSelections was always
    // cleared out after being consumed, because of the reaction, so now we are just pushing
    // in new updates, not using state at all, might be something I have missed.
    // Commented out old code just in case
    updateUserSelections(userSelections: EditorSelection[]) {
      _editor.updateUserSelections(userSelections);
    },
    changeModule(module: Module) {
      _editor.changeModule(module, module.errors, module.corrections);
    },
    lint(module: Module) {
      // This is actually linting
      _editor.changeCode(module.code || '', module.id);
    },
  },
};
