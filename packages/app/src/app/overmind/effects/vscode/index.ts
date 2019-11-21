import DEFAULT_PRETTIER_CONFIG from '@codesandbox/common/lib/prettify-default-config';
import { resolveModule } from '@codesandbox/common/lib/sandbox/modules';
import {
  EditorSelection,
  Module,
  ModuleCorrection,
  ModuleError,
  Sandbox,
  SandboxFs,
  Settings,
} from '@codesandbox/common/lib/types';
import { notificationState } from '@codesandbox/common/lib/utils/notifications';
import { NotificationMessage } from '@codesandbox/notifications/lib/state';
import { Reaction } from 'app/overmind';
import prettify from 'app/src/app/utils/prettify';
import { blocker } from 'app/utils/blocker';
import { listen } from 'codesandbox-api';
import FontFaceObserver from 'fontfaceobserver';
import * as childProcess from 'node-services/lib/child_process';

import { EXTENSIONS_LOCATION, VIM_EXTENSION_ID } from './constants';
import {
  initializeCustomTheme,
  initializeExtensionsFolder,
  initializeSettings,
  initializeThemeCache,
} from './initializers';
import { Linter } from './Linter';
import {
  ModelsHandler,
  OnFileChangeData,
  OnOperationAppliedData,
} from './ModelsHandler';
import SandboxFsSync from './SandboxFsSync';
import { getSelection } from './utils';
import loadScript from './vscode-script-loader';
import { Workbench } from './Workbench';

export type VsCodeOptions = {
  getCurrentSandbox: () => Sandbox;
  getCurrentModule: () => Module;
  getSandboxFs: () => SandboxFs;
  onCodeChange: (data: OnFileChangeData) => void;
  onOperationApplied: (data: OnOperationAppliedData) => void;
  onSelectionChange: (selection: any) => void;
  reaction: Reaction;
  // These two should be removed
  getSignal: any;
  getState: any;
};

declare global {
  interface Window {
    CSEditor: any;
    monaco: any;
  }
}

/**
 * Responsible for rendering React components for files that are supported
 */
export interface ICustomEditorApi {
  getCustomEditor(
    modulePath: string
  ): false | ((container: HTMLElement, extraProps: object) => void);
}

const context: any = window;

/**
 * Handles the VSCode instance for the whole app. The goal is to deprecate/remove this service at one point
 * and let the VSCode codebase handle the initialization of all elements. We are going for a gradual approach though,
 * that's why in the first phase we let the CodeSandbox application handle all the initialization of the VSCode
 * parts.
 */
export class VSCodeEffect {
  public initialized: Promise<void>;
  public sandboxFsSync: SandboxFsSync;

  private isFirstTypingsSync = true;
  private monaco: any;
  private editorApi: any;
  private options: VsCodeOptions;
  private controller: any;
  private commandService = blocker<any>();
  private extensionService = blocker<any>();
  private extensionEnablementService = blocker<any>();
  private workbench: Workbench;
  private settings: Settings;
  private linter: Linter;
  private modelsHandler: ModelsHandler;
  private modelSelectionListener: { dispose: Function };
  private readOnly: boolean;
  private elements = {
    editor: document.createElement('div'),
    editorPart: document.createElement('div'),
    menubar: document.createElement('div'),
    statusbar: document.createElement('div'),
  };

  private customEditorApi: ICustomEditorApi = {
    getCustomEditor: () => null,
  };

  public initialize(options: VsCodeOptions) {
    this.options = options;
    this.controller = {
      getState: options.getState,
      getSignal: options.getSignal,
    };

    this.prepareElements();

    import(
      // @ts-ignore
      'worker-loader?publicPath=/&name=ext-host-worker.[hash:8].worker.js!./extensionHostWorker/bootstrappers/ext-host'
    ).then(ExtHostWorkerLoader => {
      childProcess.addDefaultForkHandler(ExtHostWorkerLoader.default);
    });

    // It will only load the editor once. We should probably call this
    const container = this.elements.editor;

    this.initialized = this.initializeFileSystem().then(() => {
      // We want to initialize before VSCode, but after browserFS is configured
      // For first-timers initialize a theme in the cache so it doesn't jump colors
      initializeExtensionsFolder();
      initializeCustomTheme();
      initializeThemeCache();
      initializeSettings();
      this.setVimExtensionEnabled(
        localStorage.getItem('settings.vimmode') === 'true'
      );

      return Promise.all([
        new FontFaceObserver('dm').load(),
        new Promise(resolve => {
          loadScript(true, ['vs/editor/codesandbox.editor.main'])(resolve);
        }),
      ]).then(() => this.loadEditor(window.monaco, container));
    });

    return this.initialized;
  }

  public getEditorElement(
    getCustomEditor: ICustomEditorApi['getCustomEditor']
  ) {
    this.customEditorApi.getCustomEditor = getCustomEditor;
    return this.elements.editor;
  }

  public getMenubarElement() {
    return this.elements.menubar;
  }

  public getStatusbarElement() {
    return this.elements.statusbar;
  }

  public runCommand = async (id: string, ...args: any[]) => {
    const commandService = await this.commandService.promise;

    return commandService.executeCommand(id, ...args);
  };

  public callCallbackError(id: string, message?: string) {
    // @ts-ignore
    if (window.cbs && window.cbs[id]) {
      const errorMessage =
        message || 'Something went wrong while saving the file.';
      // @ts-ignore
      window.cbs[id](new Error(errorMessage), undefined);
      // @ts-ignore
      delete window.cbs[id];
    }
  }

  public callCallback(id: string) {
    // @ts-ignore
    if (window.cbs && window.cbs[id]) {
      // @ts-ignore
      window.cbs[id](undefined, undefined);
      // @ts-ignore
      delete window.cbs[id];
    }
  }

  public setVimExtensionEnabled(enabled: boolean) {
    if (enabled) {
      this.enableExtension(VIM_EXTENSION_ID);
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

      this.disableExtension(VIM_EXTENSION_ID);
    }
  }

  public async applyOperation(
    moduleShortid: string,
    operation: (string | number)[]
  ) {
    return this.modelsHandler.applyOperation(moduleShortid, operation);
  }

  public updateOptions(options: { readOnly: boolean }) {
    this.editorApi.getActiveCodeEditor().updateOptions(options);
  }

  public updateUserSelections(userSelections: EditorSelection[]) {
    if (!this.modelsHandler) {
      return;
    }

    this.modelsHandler.updateUserSelections(
      this.options.getCurrentModule(),
      userSelections
    );
  }

  public setReadOnly(enabled: boolean) {
    this.readOnly = enabled;

    const activeEditor = this.editorApi.getActiveCodeEditor();

    activeEditor.updateOptions({ readOnly: enabled });
  }

  public updateLayout = (width: number, height: number) => {
    if (this.editorApi) {
      this.editorApi.editorPart.layout(width, height);
    }
  };

  public async changeSandbox(sandbox: Sandbox) {
    await this.initialized;

    if (this.modelsHandler) {
      this.modelsHandler.dispose();
    }

    if (this.sandboxFsSync) {
      this.sandboxFsSync.dispose();
    }

    this.modelsHandler = new ModelsHandler(
      this.editorApi,
      this.monaco,
      sandbox,
      this.onFileChange,
      this.onOperationApplied
    );
    this.sandboxFsSync = new SandboxFsSync(this.options);

    return this.sandboxFsSync.create(sandbox);
  }

  public syncTypings() {
    if (this.isFirstTypingsSync) {
      this.isFirstTypingsSync = false;
      this.sandboxFsSync.syncTypings(() => {});
    } else {
      this.editorApi.extensionService.stopExtensionHost();
      this.sandboxFsSync.syncTypings(() => {
        this.editorApi.extensionService.startExtensionHost();
      });
    }
  }

  public async closeAllTabs() {
    if (this.editorApi) {
      const groupsToClose = this.editorApi.editorService.editorGroupService.getGroups();

      await Promise.all(
        groupsToClose.map(group =>
          Promise.all([
            group.closeAllEditors(),
            this.editorApi.editorService.editorGroupService.removeGroup(group),
          ])
        )
      );
    }
  }

  public async updateTabsPath(oldPath: string, newPath: string) {
    return this.modelsHandler.updateTabsPath(oldPath, newPath);
  }

  public async openModule(module: Module) {
    await this.initialized;

    try {
      const model = await this.modelsHandler.changeModule(module);

      this.lint(module.title, model);
    } catch (error) {
      // We might try to open a module that is not actually opened in the editor,
      // but the configuration wizard.. currently this throws an error as there
      // is really no good way to identify when it happen. This needs to be
      // improved in next version
    }
  }

  setErrors = (errors: ModuleError[]) => {
    const activeEditor = this.editorApi.getActiveCodeEditor();

    if (activeEditor) {
      if (errors.length > 0) {
        const currentPath = this.getCurrentModelPath();
        const thisModuleErrors = errors.filter(
          error => error.path === currentPath
        );
        const errorMarkers = thisModuleErrors
          .map(error => {
            if (error) {
              return {
                severity: this.monaco.MarkerSeverity.Error,
                startColumn: 1,
                startLineNumber: error.line,
                endColumn: error.column,
                endLineNumber: error.line + 1,
                message: error.message,
              };
            }

            return null;
          })
          .filter(x => x);

        this.monaco.editor.setModelMarkers(
          activeEditor.getModel(),
          'error',
          errorMarkers
        );
      } else {
        this.monaco.editor.setModelMarkers(
          activeEditor.getModel(),
          'error',
          []
        );
      }
    }
  };

  setCorrections = (corrections: ModuleCorrection[]) => {
    const activeEditor = this.editorApi.getActiveCodeEditor();
    if (activeEditor) {
      if (corrections.length > 0) {
        const currentPath = this.getCurrentModelPath();
        const correctionMarkers = corrections
          .filter(correction => correction.path === currentPath)
          .map(correction => {
            if (correction) {
              return {
                severity:
                  correction.severity === 'warning'
                    ? this.monaco.MarkerSeverity.Warning
                    : this.monaco.MarkerSeverity.Notice,
                startColumn: correction.column,
                startLineNumber: correction.line,
                endColumn: correction.columnEnd || 1,
                endLineNumber: correction.lineEnd || correction.line + 1,
                message: correction.message,
                source: correction.source,
              };
            }

            return null;
          })
          .filter(x => x);

        this.monaco.editor.setModelMarkers(
          activeEditor.getModel(),
          'correction',
          correctionMarkers
        );
      } else {
        this.monaco.editor.setModelMarkers(
          activeEditor.getModel(),
          'correction',
          []
        );
      }
    }
  };

  private async disableExtension(id: string) {
    const extensionService = await this.extensionService.promise;
    const extensionEnablementService = await this.extensionEnablementService
      .promise;

    const extensionDescription = await extensionService.getExtension(id);

    if (extensionDescription) {
      const { toExtension } = context.require(
        'vs/workbench/services/extensions/common/extensions'
      );
      const extension = toExtension(extensionDescription);
      extensionEnablementService.setEnablement([extension], 0);
    }
  }

  private initializeFileSystem() {
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
                  getSandboxFs: this.options.getSandboxFs,
                },
              },
            },
            '/sandbox/node_modules': {
              fs: 'CodeSandboxFS',
              options: {
                manager: {
                  getTranspiledModules: () => this.sandboxFsSync.getTypes(),
                  addModule() {},
                  removeModule() {},
                  moveModule() {},
                  updateModule() {},
                },
              },
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
            resolve();
          }
        }
      );
    });
  }

  private initializeReactions() {
    const { reaction } = this.options;

    reaction(state => state.preferences.settings, this.changeSettings, {
      nested: true,
      immediate: true,
    });
  }

  private async enableExtension(id: string) {
    const extensionEnablementService = await this.extensionEnablementService
      .promise;
    const extensionIdentifier = (
      await extensionEnablementService.getDisabledExtensions()
    ).find(ext => ext.id === id);

    if (extensionIdentifier) {
      // Sadly we have to call a private api for this. Might change this once we have extension management
      // built in.
      extensionEnablementService._enableExtension(extensionIdentifier);
    }
  }

  private async loadEditor(monaco: any, container: HTMLElement) {
    this.monaco = monaco;
    this.workbench = new Workbench(monaco, this.controller, this.runCommand);

    if (localStorage.getItem('settings.vimmode') === 'true') {
      this.enableExtension(VIM_EXTENSION_ID);
    }

    this.workbench.addWorkbenchActions();

    const r = window.require;
    const [
      { IEditorService },
      { ICodeEditorService },
      { ITextFileService },

      { IEditorGroupsService },
      { IStatusbarService },
      { IExtensionService },
      { CodeSandboxService },
      { CodeSandboxConfigurationUIService },
      { ICodeSandboxEditorConnectorService },
      { ICommandService },
      { SyncDescriptor },
      { IInstantiationService },
      { IExtensionEnablementService },
      { IContextViewService },
    ] = [
      r('vs/workbench/services/editor/common/editorService'),
      r('vs/editor/browser/services/codeEditorService'),
      r('vs/workbench/services/textfile/common/textfiles'),
      r('vs/workbench/services/editor/common/editorGroupsService'),
      r('vs/platform/statusbar/common/statusbar'),
      r('vs/workbench/services/extensions/common/extensions'),
      r('vs/codesandbox/services/codesandbox/browser/codesandboxService'),
      r('vs/codesandbox/services/codesandbox/configurationUIService'),
      r(
        'vs/codesandbox/services/codesandbox/common/codesandboxEditorConnector'
      ),
      r('vs/platform/commands/common/commands'),
      r('vs/platform/instantiation/common/descriptors'),
      r('vs/platform/instantiation/common/instantiation'),
      r('vs/platform/extensionManagement/common/extensionManagement'),
      r('vs/platform/contextview/browser/contextView'),
    ];

    const { serviceCollection } = await new Promise<any>(resolve => {
      monaco.editor.create(
        container,
        {
          codesandboxService: i =>
            new SyncDescriptor(CodeSandboxService, [this.controller, this]),
          codesandboxConfigurationUIService: i =>
            new SyncDescriptor(CodeSandboxConfigurationUIService, [
              this.customEditorApi,
            ]),
        },
        resolve
      );
    });

    // It has to run the accessor within the callback
    serviceCollection.get(IInstantiationService).invokeFunction(accessor => {
      // Initialize these services
      accessor.get(CodeSandboxConfigurationUIService);
      accessor.get(ICodeSandboxEditorConnectorService);

      const statusbarPart = accessor.get(IStatusbarService);
      const menubarPart = accessor.get('menubar');
      const commandService = accessor.get(ICommandService);
      const extensionService = accessor.get(IExtensionService);
      const extensionEnablementService = accessor.get(
        IExtensionEnablementService
      );

      this.commandService.resolve(commandService);
      this.extensionService.resolve(extensionService);

      this.extensionEnablementService.resolve(extensionEnablementService);

      const editorPart = accessor.get(IEditorGroupsService);

      const codeEditorService = accessor.get(ICodeEditorService);
      const textFileService = accessor.get(ITextFileService);
      const editorService = accessor.get(IEditorService);
      const contextViewService = accessor.get(IContextViewService);

      contextViewService.setContainer(container);

      this.editorApi = {
        openFile(path) {
          return codeEditorService.openCodeEditor({
            resource: monaco.Uri.file('/sandbox' + path),
          });
        },
        getActiveCodeEditor() {
          return codeEditorService.getActiveCodeEditor();
        },
        textFileService,
        editorPart,
        editorService,
        codeEditorService,
        extensionService,
      };

      window.CSEditor = {
        editor: this.editorApi,
        monaco,
      };

      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line
        console.log(accessor);
      }

      statusbarPart.create(this.elements.statusbar);
      menubarPart.create(this.elements.menubar);
      editorPart.create(this.elements.editorPart);
      editorPart.layout(container.offsetWidth, container.offsetHeight);

      editorPart.parent = container;

      container.appendChild(this.elements.editorPart);

      this.initializeReactions();

      this.configureMonacoLanguages(monaco);

      editorService.onDidActiveEditorChange(this.onActiveEditorChange);
      this.initializeCodeSandboxAPIListener();

      if (this.settings.lintEnabled) {
        this.createLinter();
      }
    });
  }

  private prepareElements() {
    this.elements.editor.className = 'monaco-workbench';
    this.elements.editor.style.width = '100%';
    this.elements.editor.style.height = '100%';

    this.elements.menubar.style.alignItems = 'center';
    this.elements.menubar.style.height = '38px';
    this.elements.menubar.style.fontSize = '0.875rem';
    this.elements.menubar.className = 'menubar';

    this.elements.statusbar.className = 'part statusbar';
    this.elements.statusbar.id = 'workbench.parts.statusbar';

    this.elements.editorPart.id = 'vscode-editor';
    this.elements.editorPart.className = 'part editor has-watermark';
    this.elements.editorPart.style.width = '100%';
    this.elements.editorPart.style.height = '100%';
  }

  private configureMonacoLanguages(monaco) {
    [
      'typescript',
      'typescriptreact',
      'javascript',
      'javascriptreact',
      'css',
      'less',
      'sass',
      'graphql',
      'html',
      'markdown',
      'json',
    ].forEach(language => {
      monaco.languages.registerDocumentFormattingEditProvider(language, {
        provideDocumentFormattingEdits: this.provideDocumentFormattingEdits,
      });
    });
  }

  private provideDocumentFormattingEdits = (model, _, token) =>
    prettify(
      model.uri.fsPath,
      () => model.getValue(),
      this.getPrettierConfig(),
      () => false,
      token
    ).then(newCode => [
      {
        range: model.getFullModelRange(),
        text: newCode,
      },
    ]);

  private changeSettings = (settings: Settings) => {
    this.settings = settings;

    if (!this.linter && this.settings.lintEnabled) {
      this.createLinter();
    } else if (this.linter && !this.settings.lintEnabled) {
      this.linter = this.linter.dispose();
    }
  };

  private createLinter() {
    this.linter = new Linter(this.editorApi, this.monaco);
  }

  private getPrettierConfig = () => {
    try {
      const sandbox = this.options.getCurrentSandbox();
      const module = resolveModule(
        '/.prettierrc',
        sandbox.modules,
        sandbox.directories
      );

      return JSON.parse(module.code || '');
    } catch (e) {
      return this.settings.prettierConfig || DEFAULT_PRETTIER_CONFIG;
    }
  };

  private onOperationApplied = (data: OnOperationAppliedData) => {
    if (data.moduleShortid === this.options.getCurrentModule().shortid) {
      this.lint(data.title, data.model);
    }

    this.options.onOperationApplied(data);
  };

  private onFileChange = (data: OnFileChangeData) => {
    this.lint(data.title, data.model);
    this.options.onCodeChange(data);
  };

  private onActiveEditorChange = () => {
    if (this.modelSelectionListener) {
      this.modelSelectionListener.dispose();
    }

    const activeEditor = this.editorApi.getActiveCodeEditor();

    if (activeEditor && activeEditor.getModel()) {
      const modulePath = activeEditor.getModel().uri.path;

      activeEditor.updateOptions({ readOnly: this.readOnly });

      if (!modulePath.startsWith('/sandbox')) {
        return;
      }

      if (this.linter) {
        this.linter.lint(
          activeEditor.getModel().getValue(),
          modulePath,
          activeEditor.getModel().getVersionId(),
          this.options.getCurrentSandbox().template
        );
      }

      const currentModule = this.options.getCurrentModule();

      if (
        modulePath === `/sandbox${currentModule.path}` &&
        currentModule.code !== undefined &&
        activeEditor.getValue() !== currentModule.code
      ) {
        // This means that the file in Cerebral is dirty and has changed,
        // VSCode only gets saved contents. In this case we manually set the value correctly.
        this.modelsHandler.isApplyingOperation = true;
        const model = activeEditor.getModel();
        model.applyEdits([
          {
            text: currentModule.code,
            range: model.getFullModelRange(),
          },
        ]);
        this.modelsHandler.isApplyingOperation = false;
      }

      this.modelSelectionListener = activeEditor.onDidChangeCursorSelection(
        selectionChange => {
          const lines = activeEditor.getModel().getLinesContent() || [];
          const data = {
            primary: getSelection(lines, selectionChange.selection),
            secondary: selectionChange.secondarySelections.map(s =>
              getSelection(lines, s)
            ),
          };

          this.options.onSelectionChange(data);
        }
      );
    }
  };

  private initializeCodeSandboxAPIListener() {
    return listen(({ action, type, code, path, lineNumber, column }: any) => {
      if (type === 'add-extra-lib') {
        // TODO: bring this func back
        // const dtsPath = `${path}.d.ts`;
        // this.monaco.languages.typescript.typescriptDefaults._extraLibs[
        //   `file:///${dtsPath}`
        // ] = code;
        // this.commitLibChanges();
      } else if (action === 'editor.open-module') {
        const options: {
          selection?: { startLineNumber: number; startColumn: number };
        } = {};

        if (lineNumber || column) {
          options.selection = {
            startLineNumber: lineNumber,
            startColumn: column || 0,
          };
        }

        this.editorApi.codeEditorService.openCodeEditor({
          resource: this.monaco.Uri.file('/sandbox' + path),
          options,
        });
      }
    });
  }

  private lint(title: string, model: any) {
    this.linter.lint(
      model.getValue(),
      title,
      model.getVersionId(),
      this.options.getCurrentSandbox().template
    );
  }

  private getCurrentModelPath = () => {
    const activeEditor = this.editorApi.getActiveCodeEditor();

    if (!activeEditor) {
      return undefined;
    }
    const model = activeEditor.getModel();
    if (!model) {
      return undefined;
    }

    return model.uri.path.replace(/^\/sandbox/, '');
  };

  // This is used by the CodesandboxService internally
  private addNotification(notification: NotificationMessage) {
    notificationState.addNotification(notification);
  }
}

export default new VSCodeEffect();
