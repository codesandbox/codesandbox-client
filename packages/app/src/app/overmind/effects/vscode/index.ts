import { Reaction } from 'app/overmind';
import * as childProcess from 'node-services/lib/child_process';
import {
  Sandbox,
  Module,
  EditorSelection,
  ModuleError,
  ModuleCorrection,
} from '@codesandbox/common/lib/types';
import FontFaceObserver from 'fontfaceobserver';
import { VSCodeEditorManager } from './editorManager';
import { VSCodeManager, ICustomEditorApi } from './manager';
import {
  initializeCustomTheme,
  initializeExtensionsFolder,
  initializeSettings,
  initializeThemeCache,
} from './manager/initializers';
import { OnFileChangeData } from './editorManager/FilesSync';

export type VsCodeOptions = {
  getCurrentSandbox: () => Sandbox;
  getCurrentModule: () => Module;
  onCodeChange: (data: OnFileChangeData) => void;
  onSelectionChange: (selection: any) => void;
  reaction: Reaction;
};

declare global {
  interface Window {
    BrowserFS: any;
    getState: any;
    getSignal: any;
    monaco: any;
  }
}

let _manager: VSCodeManager;
let _editorManager: VSCodeEditorManager;

export default {
  initialize(options: VsCodeOptions) {
    _editorManager = new VSCodeEditorManager(options);
    _manager = new VSCodeManager();

    return new Promise((resolve, reject) => {
      // For first-timers initialize a theme in the cache so it doesn't jump colors
      initializeExtensionsFolder();
      initializeCustomTheme();
      initializeThemeCache();
      initializeSettings();
      this.setVimExtensionEnabled(
        localStorage.getItem('settings.vimmode') === 'true'
      );

      // eslint-disable-next-line global-require
      _manager.loadScript(['vs/editor/codesandbox.editor.main'], () => {
        if (process.env.NODE_ENV === 'development') {
          console.log('Loaded Monaco'); // eslint-disable-line
        }
        _manager.acquireController({
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
    return _manager.runCommand(command);
  },
  async createMenubar(el: HTMLElement) {
    const part = await _manager.getMenubarPart();

    part.create(el);
  },
  setVimExtensionEnabled(enabled: boolean) {
    if (enabled) {
      _manager.enableExtension('vscodevim.vim');
    } else {
      // Auto disable vim extension
      if (
        [null, undefined].includes(
          localStorage.getItem('vs-global://extensionsIdentifiers/disabled')
        )
      ) {
        localStorage.setItem(
          'vs-global://extensionsIdentifiers/disabled',
          '[{"id":"vscodevim.vim"}]'
        );
      }

      _manager.disableExtension('vscodevim.vim');
    }
  },
  mount(rootEl: HTMLElement, customEditorAPI: ICustomEditorApi) {
    const container = document.createElement('div');
    const part = document.createElement('div');

    part.id = 'vscode-editor';
    part.className = 'part editor has-watermark';
    part.style.width = '100%';
    part.style.height = '100%';

    container.appendChild(part);

    const r = window.require;
    const [
      { IEditorService },
      { ICodeEditorService },
      { ITextFileService },
      { ILifecycleService },
      { IEditorGroupsService },
      { IStatusbarService },
      { IExtensionService },
      { IContextViewService },
      { IQuickOpenService },
      { IInstantiationService },
    ] = [
      r('vs/workbench/services/editor/common/editorService'),
      r('vs/editor/browser/services/codeEditorService'),
      r('vs/workbench/services/textfile/common/textfiles'),
      r('vs/platform/lifecycle/common/lifecycle'),
      r('vs/workbench/services/editor/common/editorGroupsService'),
      r('vs/platform/statusbar/common/statusbar'),
      r('vs/workbench/services/extensions/common/extensions'),
      r('vs/platform/contextview/browser/contextView'),
      r('vs/platform/quickOpen/common/quickOpen'),
      r('vs/platform/instantiation/common/instantiation'),
    ];

    return new Promise(resolve => {
      _manager.initializeEditor(container, customEditorAPI, services => {
        // Probably grab this from "container"?
        const editorElement = document.getElementById(
          'workbench.main.container'
        );

        container.className = 'monaco-workbench';
        container.style.width = '100%';
        container.style.height = '100%';

        editorElement.className += ' monaco-workbench mac nopanel';

        const instantiationService = services.get(IInstantiationService);
        instantiationService.invokeFunction(accessor => {
          const EditorPart = accessor.get(IEditorGroupsService);

          EditorPart.create(part);

          const statusBarPart = accessor.get(IStatusbarService);
          statusBarPart.create(
            document.getElementById('workbench.parts.statusbar')
          );

          EditorPart.layout(container.offsetWidth, container.offsetHeight);

          const codeEditorService = accessor.get(ICodeEditorService);
          const textFileService = accessor.get(ITextFileService);
          const editorService = accessor.get(IEditorService);
          this.lifecycleService = accessor.get(ILifecycleService);
          this.quickopenService = accessor.get(IQuickOpenService);

          if (this.lifecycleService.phase !== 3) {
            this.lifecycleService.phase = 2; // Restoring
            requestAnimationFrame(() => {
              this.lifecycleService.phase = 3; // Running
            });
          } else {
            // It seems like the VSCode instance has been started before
            const extensionService = accessor.get(IExtensionService);
            const contextViewService = accessor.get(IContextViewService);

            // It was killed in the last quit
            extensionService.startExtensionHost();
            contextViewService.setContainer(rootEl);

            // We force this to recreate, otherwise it's bound to an element that's disposed
            this.quickopenService.quickOpenWidget = undefined;
          }

          const editorApi = {
            openFile(path) {
              new FontFaceObserver('dm')
                .load()
                .catch(() => {})
                .then(() => {
                  codeEditorService.openCodeEditor({
                    resource: window.monaco.Uri.file('/sandbox' + path),
                  });
                });
            },
            getActiveCodeEditor() {
              return codeEditorService.getActiveCodeEditor();
            },
            textFileService,
            editorPart: EditorPart,
            editorService,
            codeEditorService,
          };
          if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line
            console.log(accessor);
          }

          this.editor = editorApi;

          // After initializing monaco editor
          // this.editorDidMount(editorApi, context.monaco);
          _editorManager.initialize(editorApi, window.monaco);
          document.getElementById('root').className += ` monaco-shell`;

          resolve(container);
        });
      });
    });
  },
  unmount() {
    _editorManager.dispose();
  },
  async applyOperations(operations: { [x: string]: (string | number)[] }) {
    this.isApplyingCode = true;

    // The call to "apployOperations" should "try" and treat error as "moduleStateMismatch"
    // this.props.onModuleStateMismatch();

    try {
      await this.currentFilesSync.applyOperations(operations);
    } catch (error) {
      this.isApplyingCode = false;
      throw error;
    }
  },
  updateOptions(options: { readOnly: boolean }) {
    _editorManager.updateOptions(options);
  },
  updateUserSelections(userSelections: EditorSelection[]) {
    _editorManager.updateUserSelections(userSelections);
  },
  changeModule(
    newModule: Module,
    errors?: ModuleError[],
    corrections?: ModuleCorrection[]
  ) {
    _editorManager.changeModule(newModule, errors, corrections);
  },
  setReadOnly(enabled: boolean) {
    _editorManager.setReadOnly(enabled);
  },
  openModule(module: Module) {
    _editorManager.openModule(module);
  },
  updateLayout(width: number, height: number) {
    _editorManager.updateLayout(width, height);
  },
};
