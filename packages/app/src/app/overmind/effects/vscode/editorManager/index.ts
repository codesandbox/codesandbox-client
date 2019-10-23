import DEFAULT_PRETTIER_CONFIG from '@codesandbox/common/lib/prettify-default-config';
import {
  getModulePath,
  resolveModule,
} from '@codesandbox/common/lib/sandbox/modules';
import {
  EditorSelection,
  Module,
  ModuleCorrection,
  ModuleError,
  Settings,
} from '@codesandbox/common/lib/types';
import prettify from 'app/src/app/utils/prettify';
import { listen } from 'codesandbox-api';
import throttle from 'lodash-es/throttle';

import { FilesSync, OnFileChangeData } from './FilesSync';
import { Linter } from './Linter';
import { getCode, getCurrentModelPath, getModel, getSelection } from './utils';
import { VsCodeOptions } from '..';

export class VSCodeEditorManager {
  private options: VsCodeOptions;
  private reactionDisposers: Function[];
  private editor: any;
  private monaco: any;
  private currentFilesSync: FilesSync;
  private codeSandboxAPIListener: () => void;
  private activeEditorListener: { dispose: Function };
  private modelSelectionListener: { dispose: Function };
  private linter: Linter;
  private readOnly: boolean;
  private isApplyingCode: boolean = false;
  private settings: Settings;

  constructor(options: VsCodeOptions) {
    this.options = options;
  }

  initialize(editor, monaco) {
    const global = window as any;

    global.CSEditor = {
      editor,
      monaco,
    };

    this.editor = editor;
    this.monaco = monaco;

    this.initializeReactions();
    this.configureMonacoLanguages(monaco);
    this.currentFilesSync = new FilesSync(
      editor,
      monaco,
      this.options.getCurrentSandbox(),
      this.onFileChange
    );
    this.activeEditorListener = editor.editorService.onDidActiveEditorChange(
      this.onActiveEditorChange
    );
    this.codeSandboxAPIListener = this.initializeCodeSandboxAPIListener();

    if (!editor.getActiveCodeEditor()) {
      this.openModule(this.options.getCurrentModule());
    }

    if (this.settings.lintEnabled) {
      this.createLinter();
    }
  }

  dispose() {
    this.reactionDisposers.forEach(dispose => dispose());

    if (this.linter) {
      this.linter = this.linter.dispose();
    }

    if (this.codeSandboxAPIListener) {
      this.codeSandboxAPIListener();
    }

    if (this.modelSelectionListener) {
      this.modelSelectionListener.dispose();
    }

    this.currentFilesSync = this.currentFilesSync.dispose();

    const groupsToClose = this.editor.editorService.editorGroupService.getGroups();

    Promise.all(groupsToClose.map(g => g.closeAllEditors()))
      .then(() => {
        groupsToClose.forEach(group =>
          this.editor.editorService.editorGroupService.removeGroup(group)
        );
      })
      .then(() => {
        /*
        Not found any reference to this stuff?
        
        if (this.quickopenService) {
          // Make sure that the quickopenWidget is gone, it's attached to an old dom node
          if (this.quickopenService.quickOpenWidget) {
            this.quickopenService.quickOpenWidget.dispose();
          }
          this.quickopenService.quickOpenWidget = undefined;
        }
        */
      });
  }

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
  }

  updateOptions(options: { readOnly: boolean }) {
    this.editor.getActiveCodeEditor().updateOptions(options);
  }

  updateUserSelections(userSelections: EditorSelection[]) {
    this.currentFilesSync.updateUserSelections(
      this.options.getCurrentModule(),
      userSelections
    );
  }

  changeModule(
    newModule: Module,
    errors?: ModuleError[],
    corrections?: ModuleCorrection[]
  ) {
    this.openModule(newModule);

    // Let the model load first, this seems
    // very hacky
    setTimeout(() => {
      if (errors) {
        this.setErrors(errors);
      }
      if (corrections) {
        this.setCorrections(corrections);
      }
    }, 100);

    /*
    Not sure about this stuff, do not want any LIVE related code in here
    
    if (this.props.onCodeReceived) {
      // Whenever the user changes a module we set up a state that defines
      // that the changes of code are not sent to live users. We need to reset
      // this state when we're doing changing modules
      this.props.onCodeReceived();
      this.liveOperationCode = '';
    }
    */
  }

  setReadOnly(enabled: boolean) {
    this.readOnly = enabled;

    const activeEditor = this.editor.getActiveCodeEditor();

    activeEditor.updateOptions({ readOnly: enabled });
  }

  openModule(module: Module) {
    if (module.id) {
      const sandbox = this.options.getCurrentSandbox();
      const path = getModulePath(
        sandbox.modules,
        sandbox.directories,
        module.id
      );

      if (path && getCurrentModelPath(this.editor) !== path) {
        this.editor.openFile(path);
      }
    }
  }

  updateLayout = throttle(
    (width: number, height: number) => {
      if (this.editor) {
        this.editor.editorPart.layout(width, height);
      }
    },
    50,
    {
      leading: true,
      trailing: true,
    }
  );

  private createLinter() {
    this.linter = new Linter(
      this.options.getCurrentSandbox().template,
      this.editor,
      this.monaco
    );

    const model = getModel(this.editor);

    if (model) {
      this.linter.lint(
        getCode(this.editor),
        this.options.getCurrentModule().title,
        model.getVersionId()
      );
    }
  }

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

        this.editor.codeEditorService.openCodeEditor({
          resource: this.monaco.Uri.file('/sandbox' + path),
          options,
        });
      }
    });
  }

  private initializeReactions() {
    const { reaction } = this.options;

    this.reactionDisposers = [
      reaction(state => state.editor.errors, this.setErrors, {
        nested: true,
      }),
      reaction(state => state.editor.corrections, this.setCorrections, {
        nested: true,
      }),
      reaction(state => state.editor.modulePaths, this.updateModules),
      reaction(state => state.preferences.settings, this.changeSettings, {
        nested: true,
        immediate: true,
      }),
      reaction(
        state =>
          state.editor.parsedConfigurations &&
          state.editor.parsedConfigurations.package,
        this.changeDependencies
      ),
      reaction(
        state =>
          state.editor.parsedConfigurations &&
          state.editor.parsedConfigurations.typescript,
        this.setTSConfig
      ),
      reaction(state => state.live.receivingCode, this.setReceivingCode),
      reaction(
        state => state.editor.changedModuleShortids,
        this.moduleSyncedChanged,
        {
          nested: true,
        }
      ),
    ];
  }

  private setErrors = errors => {};
  private setCorrections = corrections => {};
  private updateModules = () => {};
  private changeDependencies = packageConfiguration => {
    /*
  const { parsed } = state.editor.parsedConfigurations.package;

  await effects.vscode.editor.changeSandbox(
    sandbox,
    state.editor.currentModule,
    parsed && parsed.dependencies
      ? parsed.dependencies
      : json(sandbox.npmDependencies)
  );
    */
  };

  private changeSettings = (settings: Settings) => {
    this.settings = settings;

    if (!this.linter && this.settings.lintEnabled) {
      this.createLinter();
    } else if (this.linter && !this.settings.lintEnabled) {
      this.linter = this.linter.dispose();
    }
  };

  private setTSConfig = typescript => {};
  private setReceivingCode = isReceivingCode => {};
  private moduleSyncedChanged = () => {};
  private getVSCodePath(moduleId: string) {
    const sandbox = this.options.getCurrentSandbox();

    return `/sandbox${getModulePath(
      sandbox.modules,
      sandbox.directories,
      moduleId
    )}`;
  }

  private onActiveEditorChange = () => {
    if (this.modelSelectionListener) {
      this.modelSelectionListener.dispose();
    }

    const activeEditor = this.editor.getActiveCodeEditor();

    if (activeEditor) {
      const modulePath = activeEditor.getModel().uri.path;

      activeEditor.updateOptions({ readOnly: this.readOnly });

      if (!modulePath.startsWith('/sandbox')) {
        return;
      }

      if (this.linter) {
        this.linter.lint(
          activeEditor.getModel().getValue(),
          modulePath,
          activeEditor.getModel().getVersionId()
        );
      }

      const currentModule = this.options.getCurrentModule();

      if (
        modulePath === this.getVSCodePath(currentModule.id) &&
        currentModule.code !== undefined &&
        activeEditor.getValue() !== currentModule.code
      ) {
        // Don't send these changes over live, since these changes can also be made by someone else and
        // we don't want to keep singing these changes
        // TODO: a better long term solution would be to store the changes of someone else in a model, even if the
        // model is not opened in an editor.

        this.isApplyingCode = true;
        // This means that the file in Cerebral is dirty and has changed,
        // VSCode only gets saved contents. In this case we manually set the value correctly.
        const model = activeEditor.getModel();
        model.applyEdits([
          {
            text: currentModule.code,
            range: model.getFullModelRange(),
          },
        ]);
        this.isApplyingCode = false;
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

  private onFileChange = (data: OnFileChangeData) => {
    if (this.isApplyingCode) {
      return;
    }

    this.options.onCodeChange(data);
  };

  private configureMonacoLanguages(monaco) {
    monaco.languages.registerDocumentFormattingEditProvider('typescript', {
      provideDocumentFormattingEdits: this.provideDocumentFormattingEdits,
    });
    monaco.languages.registerDocumentFormattingEditProvider('typescriptreact', {
      provideDocumentFormattingEdits: this.provideDocumentFormattingEdits,
    });
    monaco.languages.registerDocumentFormattingEditProvider('javascript', {
      provideDocumentFormattingEdits: this.provideDocumentFormattingEdits,
    });
    monaco.languages.registerDocumentFormattingEditProvider('javascriptreact', {
      provideDocumentFormattingEdits: this.provideDocumentFormattingEdits,
    });
    monaco.languages.registerDocumentFormattingEditProvider('css', {
      provideDocumentFormattingEdits: this.provideDocumentFormattingEdits,
    });
    monaco.languages.registerDocumentFormattingEditProvider('less', {
      provideDocumentFormattingEdits: this.provideDocumentFormattingEdits,
    });
    monaco.languages.registerDocumentFormattingEditProvider('sass', {
      provideDocumentFormattingEdits: this.provideDocumentFormattingEdits,
    });
    monaco.languages.registerDocumentFormattingEditProvider('graphql', {
      provideDocumentFormattingEdits: this.provideDocumentFormattingEdits,
    });
    monaco.languages.registerDocumentFormattingEditProvider('html', {
      provideDocumentFormattingEdits: this.provideDocumentFormattingEdits,
    });
    monaco.languages.registerDocumentFormattingEditProvider('markdown', {
      provideDocumentFormattingEdits: this.provideDocumentFormattingEdits,
    });
    monaco.languages.registerDocumentFormattingEditProvider('json', {
      provideDocumentFormattingEdits: this.provideDocumentFormattingEdits,
    });
  }

  private provideDocumentFormattingEdits(model, _, token) {
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
}
