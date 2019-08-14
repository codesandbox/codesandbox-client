import React from 'react';
import { render } from 'react-dom';
import { ThemeProvider } from 'styled-components';
import { TextOperation } from 'ot';
import { debounce } from 'lodash-es';
import {
  getModulePath,
  resolveModule,
} from '@codesandbox/common/lib/sandbox/modules';
import { listen, actions, dispatch } from 'codesandbox-api';

import prettify from 'app/src/app/utils/prettify';
import DEFAULT_PRETTIER_CONFIG from '@codesandbox/common/lib/prettify-default-config';
import getUI from '@codesandbox/common/lib/templates/configuration/ui';

import getTemplate from '@codesandbox/common/lib/templates';
import theme from '@codesandbox/common/lib/theme';
import {
  Module,
  Sandbox,
  ModuleError,
  ModuleCorrection,
} from '@codesandbox/common/lib/types';
import { getTextOperation } from '@codesandbox/common/lib/utils/diff';

/* eslint-disable import/no-webpack-loader-syntax */
// @ts-ignore
import LinterWorker from 'worker-loader?publicPath=/&name=monaco-linter.[hash:8].worker.js!../Monaco/workers/linter';
/* eslint-enable import/no-webpack-loader-syntax */

import eventToTransform from '../Monaco/event-to-transform';
import MonacoEditorComponent, { EditorAPI } from './MonacoReactComponent';
import { Container, GlobalStyles } from './elements';
import getSettings from '../Monaco/settings';

import { Props, Editor } from '../types';
import getMode from '../Monaco/mode';
import {
  lineAndColumnToIndex,
  indexToLineAndColumn,
} from '../Monaco/monaco-index-converter';
import { updateUserSelections } from '../Monaco/live-decorations';

import Configuration from './Configuration';

function getSelection(lines, selection) {
  const startSelection = lineAndColumnToIndex(
    lines,
    selection.startLineNumber,
    selection.startColumn
  );
  const endSelection = lineAndColumnToIndex(
    lines,
    selection.endLineNumber,
    selection.endColumn
  );

  return {
    selection:
      startSelection === endSelection ? [] : [startSelection, endSelection],
    cursorPosition: lineAndColumnToIndex(
      lines,
      selection.positionLineNumber,
      selection.positionColumn
    ),
  };
}

type UserSelection =
  | {
      userId: string;
      selection: null;
    }
  | {
      userId: string;
      name: string;
      selection: any;
      color: number[];
    };

class MonacoEditor extends React.Component<Props> implements Editor {
  static defaultProps = {
    width: '100%',
    height: '100%',
  };

  sandbox: Props['sandbox'];
  currentModule: Props['currentModule'];
  currentTitle: string;
  currentDirectoryShortid: string | undefined;
  settings: Props['settings'];
  dependencies: Props['dependencies'] | undefined;
  tsconfig: Props['tsconfig'] | undefined;
  disposeInitializer?: Function;
  lintWorker: Worker | undefined;
  editor?: any;
  monaco?: any;
  receivingCode: boolean = false;
  codeSandboxAPIListener: () => void;
  sizeProbeInterval: number | null;

  modelSelectionListener: {
    dispose: () => void;
  };

  resizeEditor: (() => void) | EventListener;
  commitLibChanges: () => void;

  constructor(props: Props) {
    super(props);
    this.state = {
      fuzzySearchEnabled: false,
    };
    this.sandbox = props.sandbox;
    this.currentModule = props.currentModule;
    this.currentTitle = props.currentModule.title;
    this.currentDirectoryShortid = props.currentModule.directoryShortid;
    this.settings = props.settings;
    this.dependencies = props.dependencies;

    this.tsconfig = props.tsconfig;

    this.lintWorker = null;
    this.sizeProbeInterval = null;

    this.resizeEditor = debounce(this.resizeEditorInstantly, 150);
    this.commitLibChanges = debounce(this.commitLibChangesInstantly, 300);

    this.codeSandboxAPIListener = this.setupCodeSandboxAPIListener();
  }

  shouldComponentUpdate(nextProps: Props) {
    if (
      this.props.width !== nextProps.width ||
      this.props.height !== nextProps.height
    ) {
      this.resizeEditorInstantly();
    }

    const activeEditor = this.editor && this.editor.getActiveCodeEditor();

    if (this.props.readOnly !== nextProps.readOnly && activeEditor) {
      activeEditor.updateOptions({ readOnly: Boolean(nextProps.readOnly) });
    }

    return false;
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeEditor);
    // Make sure that everything has run before disposing, to prevent any inconsistensies

    if (this.lintWorker) {
      this.lintWorker.terminate();
    }
    if (this.codeSandboxAPIListener) {
      this.codeSandboxAPIListener();
    }
    clearInterval(this.sizeProbeInterval);
    if (this.modelSelectionListener) {
      this.modelSelectionListener.dispose();
    }

    this.disposeContentListeners();

    if (this.disposeInitializer) {
      this.disposeInitializer();
    }
  }

  updateModules = () => {
    Object.keys(this.modelListeners).forEach(path => {
      const shortid = this.modelListeners[path].moduleShortid;
      const model = this.modelListeners[path].model;
      const module = this.sandbox.modules.find(m => m.shortid === shortid);
      if (!module) {
        // Deleted
        return;
      }

      const modulePath = this.getVSCodePath(module.id);

      if (modulePath !== model.uri.path) {
        this.editor.textFileService
          .move(model.uri, this.monaco.Uri.file(modulePath))
          .then(() => {
            const editor = this.editor.getActiveCodeEditor();
            const currentModel = editor && editor.getModel();
            const isCurrentFile =
              currentModel && currentModel.uri.path === path;
            if (isCurrentFile) {
              this.editor.openFile(modulePath.replace('/sandbox', ''));
            }

            // Don't move the listener from old path to new path, that's handled by the model
            // logic
          });
      }
    });
  };

  getVSCodePath = (moduleId: string) =>
    `/sandbox${getModulePath(
      this.sandbox.modules,
      this.sandbox.directories,
      moduleId
    )}`;

  getCurrentModuleVSCodePath = () => this.getVSCodePath(this.currentModule.id);

  getPrettierConfig = () => {
    try {
      const module = resolveModule(
        '/.prettierrc',
        this.sandbox.modules,
        this.sandbox.directories
      );

      return JSON.parse(module.code || '');
    } catch (e) {
      return this.settings.prettierConfig || DEFAULT_PRETTIER_CONFIG;
    }
  };

  provideDocumentFormattingEdits = (model, options, token) =>
    prettify(
      model.uri.fsPath,
      () => model.getValue(1),
      this.getPrettierConfig(),
      () => false,
      token
    ).then(newCode => [
      {
        range: model.getFullModelRange(),
        text: newCode,
      },
    ]);

  setupCodeSandboxAPIListener() {
    // @ts-ignore
    return listen(({ action, type, code, path, lineNumber, column }) => {
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
            startColumn: column,
          };
        }

        this.editor.codeEditorService.openCodeEditor({
          resource: this.monaco.Uri.file('/sandbox' + path),
          options,
        });
      }
    });
  }

  modelListeners: {
    [path: string]: {
      listener: { dispose: () => void };
      moduleShortid: string;
      model: any;
    };
  } = {};
  modelRemovedListener: { dispose: () => void };
  modelAddedListener: { dispose: () => void };
  activeEditorListener: { dispose: () => void };

  getModelContentChangeListener = model =>
    model.onDidChangeContent(e => {
      const path = model.uri.path;
      try {
        const module = resolveModule(
          path.replace(/^\/sandbox/, ''),
          this.sandbox.modules,
          this.sandbox.directories
        );

        const { isLive, sendTransforms } = this.props;

        if (
          path === this.getCurrentModuleVSCodePath() &&
          isLive &&
          sendTransforms &&
          !this.receivingCode
        ) {
          this.sendChangeOperations(e);
        }

        this.handleChange(module.shortid, module.title, model.getValue(1));
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.error('caught', err);
        }
      }
    });

  listenForFileChanges = () => {
    this.modelAddedListener = this.editor.textFileService.modelService.onModelAdded(
      model => {
        if (this.modelListeners[model.uri.path] === undefined) {
          let module: Module;
          try {
            module = resolveModule(
              model.uri.path.replace(/^\/sandbox/, ''),
              this.sandbox.modules,
              this.sandbox.directories
            );
          } catch (e) {
            return;
          }

          const listener = this.getModelContentChangeListener(model);
          this.modelListeners[model.uri.path] = {
            moduleShortid: module.shortid,
            model,
            listener,
          };
        }
      }
    );

    this.modelRemovedListener = this.editor.textFileService.modelService.onModelRemoved(
      model => {
        if (this.modelListeners[model.uri.path]) {
          this.modelListeners[model.uri.path].listener.dispose();

          const csbPath = model.uri.path.replace('/sandbox', '');
          dispatch(actions.correction.clear(csbPath, 'eslint'));

          delete this.modelListeners[model.uri.path];
        }
      }
    );
  };

  disposeContentListeners = () => {
    if (this.modelAddedListener) {
      this.modelAddedListener.dispose();
    }
    if (this.modelRemovedListener) {
      this.modelRemovedListener.dispose();
    }
    if (this.activeEditorListener) {
      this.activeEditorListener.dispose();
    }
    Object.keys(this.modelListeners).forEach(p => {
      this.modelListeners[p].listener.dispose();
    });
  };

  configureEditor = async (editor: EditorAPI, monaco: any) => {
    this.editor = editor;
    this.monaco = monaco;

    monaco.languages.registerDocumentFormattingEditProvider('typescript', this);
    monaco.languages.registerDocumentFormattingEditProvider(
      'typescriptreact',
      this
    );
    monaco.languages.registerDocumentFormattingEditProvider('javascript', this);
    monaco.languages.registerDocumentFormattingEditProvider(
      'javascriptreact',
      this
    );
    monaco.languages.registerDocumentFormattingEditProvider('css', this);
    monaco.languages.registerDocumentFormattingEditProvider('less', this);
    monaco.languages.registerDocumentFormattingEditProvider('sass', this);
    monaco.languages.registerDocumentFormattingEditProvider('graphql', this);
    monaco.languages.registerDocumentFormattingEditProvider('html', this);
    monaco.languages.registerDocumentFormattingEditProvider('markdown', this);
    monaco.languages.registerDocumentFormattingEditProvider('json', this);

    // eslint-disable-next-line no-underscore-dangle
    const global = window as any;
    global.CSEditor = {
      editor: this.editor,
      monaco: this.monaco,
    };

    this.listenForFileChanges();
    this.activeEditorListener = editor.editorService.onDidActiveEditorChange(
      () => {
        if (this.modelSelectionListener) {
          this.modelSelectionListener.dispose();
        }

        const activeEditor = editor.getActiveCodeEditor();

        if (activeEditor) {
          const modulePath = activeEditor.getModel().uri.path;

          activeEditor.updateOptions({ readOnly: this.props.readOnly });

          if (!modulePath.startsWith('/sandbox')) {
            return;
          }

          this.lint(
            activeEditor.getModel().getValue(),
            modulePath,
            activeEditor.getModel().getVersionId()
          );

          if (
            modulePath === this.getCurrentModuleVSCodePath() &&
            this.currentModule.code !== undefined &&
            activeEditor.getValue(1) !== this.currentModule.code
          ) {
            // Don't send these changes over live, since these changes can also be made by someone else and
            // we don't want to keep singing these changes
            // TODO: a better long term solution would be to store the changes of someone else in a model, even if the
            // model is not opened in an editor.

            this.receivingCode = true;
            // This means that the file in Cerebral is dirty and has changed,
            // VSCode only gets saved contents. In this case we manually set the value correctly.
            const model = activeEditor.getModel();
            model.applyEdits([
              {
                text: this.currentModule.code,
                range: model.getFullModelRange(),
              },
            ]);
            this.receivingCode = false;
          }

          this.modelSelectionListener = activeEditor.onDidChangeCursorSelection(
            selectionChange => {
              // TODO: add another debounced action to send the current data. So we can
              // have the correct cursor pos no matter what
              const { onSelectionChanged, isLive } = this.props;
              // Reason 3 is update by mouse or arrow keys
              if (isLive) {
                const lines = activeEditor.getModel().getLinesContent() || [];
                const data = {
                  primary: getSelection(lines, selectionChange.selection),
                  secondary: selectionChange.secondarySelections.map(s =>
                    getSelection(lines, s)
                  ),
                };
                if (
                  (selectionChange.reason === 3 ||
                    /* alt + shift + arrow keys */ selectionChange.source ===
                      'moveWordCommand' ||
                    /* click inside a selection */ selectionChange.source ===
                      'api') &&
                  onSelectionChanged
                ) {
                  this.onSelectionChangedDebounced.cancel();
                  onSelectionChanged({
                    selection: data,
                    moduleShortid: this.currentModule.shortid,
                  });
                } else {
                  // This is just on typing, we send a debounced selection update as a
                  // safeguard to make sure we are in sync
                  this.onSelectionChangedDebounced({
                    selection: data,
                    moduleShortid: this.currentModule.shortid,
                  });
                }
              }
            }
          );
        }
      }
    );

    requestAnimationFrame(() => {
      if (this.editor && !this.editor.getActiveCodeEditor()) {
        this.openModule(this.currentModule);
      }
      this.setupWorkers();
    });

    window.addEventListener('resize', this.resizeEditor);
    this.sizeProbeInterval = window.setInterval(() => {
      if (this.props.width && this.props.height) {
        return;
      }

      this.resizeEditorInstantly();
    }, 3000);

    const { dependencies } = this;
    if (dependencies != null) {
      if (Object.keys(dependencies)) {
        setTimeout(() => {}, this.hasNativeTypescript() ? 500 : 5000);
      }
    }

    if (this.props.onInitialized) {
      this.disposeInitializer = this.props.onInitialized(this);
    }
  };

  changeModule = (
    newModule: Module,
    errors?: ModuleError[],
    corrections?: ModuleCorrection[]
  ) => {
    this.swapDocuments(newModule);

    this.currentModule = newModule;
    this.currentTitle = newModule.title;
    this.currentDirectoryShortid = newModule.directoryShortid;

    // Let the model load first
    setTimeout(() => {
      if (errors) {
        this.setErrors(errors);
      }
      if (corrections) {
        this.setCorrections(corrections);
      }
    }, 100);

    if (this.props.onCodeReceived) {
      // Whenever the user changes a module we set up a state that defines
      // that the changes of code are not sent to live users. We need to reset
      // this state when we're doing changing modules
      this.props.onCodeReceived();
      this.liveOperationCode = '';
    }
  };

  onSelectionChangedDebounced = debounce(data => {
    if (this.props.onSelectionChanged) {
      this.props.onSelectionChanged(data);
    }
  });

  liveOperationCode = '';
  sendChangeOperations = changeEvent => {
    const { sendTransforms, isLive, onCodeReceived } = this.props;

    if (sendTransforms && changeEvent.changes) {
      this.liveOperationCode =
        this.liveOperationCode || this.currentModule.code || '';
      try {
        const { operation, newCode } = eventToTransform(
          changeEvent,
          this.liveOperationCode
        );

        this.liveOperationCode = newCode;

        sendTransforms(operation);
      } catch (e) {
        // Something went wrong while composing the operation, so we're opting for a full sync
        console.error(e);

        this.props.onModuleStateMismatch();
      }

      requestAnimationFrame(() => {
        this.liveOperationCode = '';
      });
    } else if (!isLive && onCodeReceived) {
      onCodeReceived();
    }
  };

  userClassesGenerated = {};
  userSelectionDecorations = {};
  updateUserSelections = (userSelections: UserSelection[]) => {
    if (this.editor.getActiveCodeEditor()) {
      updateUserSelections(
        this.monaco,
        this.editor.getActiveCodeEditor(),
        this.currentModule,
        userSelections
      );
    }
  };

  changeSandbox = (
    newSandbox: Sandbox,
    newCurrentModule: Module,
    dependencies: Props['dependencies']
  ): Promise<null> =>
    new Promise(resolve => {
      this.sandbox = newSandbox;
      this.dependencies = dependencies;
      this.changeModule(newCurrentModule, [], []);

      // Do in setTimeout, since disposeModules is async
      setTimeout(() => {
        resolve(null);
      });
    });

  moduleSyncedChanged = () => {
    const openedModels = this.editor.textFileService.getFileModels();

    openedModels.forEach(fileModel => {
      const path = fileModel.resource.path;

      if (!path.startsWith('/sandbox') || !fileModel.isDirty()) {
        return;
      }

      const module = resolveModule(
        path.replace(/^\/sandbox/, ''),
        this.sandbox.modules,
        this.sandbox.directories
      );

      if (
        module &&
        this.props.isModuleSynced(module.shortid) &&
        fileModel.isDirty
      ) {
        // Do a revert to remove the dirty state and get the code from the FS, since in Cerebral
        // we're already synced
        fileModel.revert();
      }
    });
  };

  changeCode = (code: string, moduleId?: string) => {
    const editor = this.editor.getActiveCodeEditor();
    if (
      code !== this.getCode() &&
      (!moduleId || this.currentModule.id === moduleId) &&
      editor
    ) {
      this.lint(
        code,
        this.currentModule.title,
        editor.getModel().getVersionId()
      );
    }
  };

  applyOperationToModel = (
    operation,
    pushStack = false,
    model = this.editor.getActiveCodeEditor().getModel()
  ) => {
    const results = [];
    let index = 0;
    for (let i = 0; i < operation.ops.length; i++) {
      const op = operation.ops[i];
      if (TextOperation.isRetain(op)) {
        index += op;
      } else if (TextOperation.isInsert(op)) {
        const { lineNumber, column } = indexToLineAndColumn(
          model.getLinesContent() || [],
          index
        );
        const range = new this.monaco.Range(
          lineNumber,
          column,
          lineNumber,
          column
        );
        results.push({
          range,
          text: op,
          forceMoveMarkers: true,
        });
      } else if (TextOperation.isDelete(op)) {
        const lines = model.getLinesContent() || [];
        const from = indexToLineAndColumn(lines, index);
        const to = indexToLineAndColumn(lines, index - op);
        results.push({
          range: new this.monaco.Range(
            from.lineNumber,
            from.column,
            to.lineNumber,
            to.column
          ),
          text: '',
        });
        index -= op;
      }
    }

    this.receivingCode = true;
    if (pushStack) {
      model.pushEditOperations([], results);
    } else {
      model.applyEdits(results);
    }
    this.receivingCode = false;
  };

  applyOperations = (operations: { [moduleShortid: string]: any }) => {
    const operationsJSON = operations.toJSON();

    Object.keys(operationsJSON).forEach(moduleShortid => {
      const operation = TextOperation.fromJSON(operationsJSON[moduleShortid]);

      const moduleId = this.sandbox.modules.find(
        m => m.shortid === moduleShortid
      ).id;

      const modulePath =
        '/sandbox' +
        getModulePath(this.sandbox.modules, this.sandbox.directories, moduleId);

      const modelEditor =
        this.editor &&
        this.editor.editorService.editors.find(
          editor => editor.resource && editor.resource.path === modulePath
        );

      // Apply the code to the current module code itself
      const module = this.sandbox.modules.find(
        m => m.shortid === moduleShortid
      );

      if (!modelEditor) {
        if (!module) {
          return;
        }

        try {
          const code = operation.apply(module.code || '');
          if (this.props.onChange) {
            this.props.onChange(code, module.shortid);
          }
        } catch (e) {
          // Something went wrong while applying
          this.props.onModuleStateMismatch();
        }
      } else {
        this.liveOperationCode = '';

        modelEditor.textModelReference.then(model => {
          this.applyOperationToModel(
            operation,
            false,
            model.object.textEditorModel
          );

          if (this.props.onChange) {
            this.props.onChange(
              model.object.textEditorModel.getValue(1),
              module.shortid
            );
          }
        });
      }
    });
  };

  changeDependencies = (dependencies: Props['dependencies'] | undefined) => {
    this.dependencies = dependencies;
  };

  changeSettings = (settings: Props['settings']) => {
    this.settings = settings;
    if (settings.lintEnabled && !this.lintWorker) {
      this.setupLintWorker();
    }

    this.editor.getActiveCodeEditor().updateOptions(this.getEditorOptions());
    this.forceUpdate();
  };

  setErrors = (errors: ModuleError[]) => {
    const activeEditor = this.editor.getActiveCodeEditor();

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
    const activeEditor = this.editor.getActiveCodeEditor();
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

  setupLintWorker = () => {
    if (!this.lintWorker) {
      this.lintWorker = new LinterWorker();

      this.lintWorker.addEventListener('message', event => {
        const { markers, version } = event.data;

        requestAnimationFrame(() => {
          const activeEditor = this.editor.getActiveCodeEditor();

          if (activeEditor && activeEditor.getModel()) {
            dispatch(
              actions.correction.clear(this.getCurrentModelPath(), 'eslint')
            );

            if (version === activeEditor.getModel().getVersionId()) {
              markers.forEach(marker => {
                dispatch(
                  actions.correction.show(marker.message, {
                    line: marker.startLineNumber,
                    column: marker.startColumn,
                    lineEnd: marker.endLineNumber,
                    columnEnd: marker.endColumn,
                    source: 'eslint',
                    severity: marker.severity === 2 ? 'warning' : 'notice',
                    path: this.getCurrentModelPath(),
                  })
                );
              });
            }
          }
        });
      });

      this.lint = debounce(this.lint, 400);

      const activeEditor = this.editor.getActiveCodeEditor();
      if (activeEditor && activeEditor.getModel()) {
        this.lint(
          this.getCode(),
          this.currentModule.title,
          activeEditor.getModel().getVersionId()
        );
      }
    }
  };

  setupWorkers = () => {
    const settings = this.settings;

    if (settings.lintEnabled) {
      // Delay this one, as initialization is very heavy
      setTimeout(() => {
        this.setupLintWorker();
      }, 5000);
    }
  };

  updateDecorations = async (
    classifications: Array<{
      type: string;
      kind: string;
      parentKind: string;
      startLine: number;
      start: number;
      endLine: number;
      end: number;
    }>
  ) => {
    const decorations = classifications.map(classification => ({
      range: new this.monaco.Range(
        classification.startLine,
        classification.start,
        classification.endLine,
        classification.end
      ),
      options: {
        inlineClassName: classification.type
          ? `${classification.kind} ${classification.type}-of-${
              classification.parentKind
            }`
          : classification.kind,
      },
    }));

    const currentModule = this.currentModule;
    const modelInfo = await this.getModelById(currentModule.id);

    modelInfo.decorations = this.editor
      .getActiveCodeEditor()
      .deltaDecorations(modelInfo.decorations || [], decorations);
  };

  getModelById = (id: string) => {
    const modulePath = getModulePath(
      this.sandbox.modules,
      this.sandbox.directories,
      id
    );

    const uri = this.monaco.Uri.file('/sandbox' + modulePath);
    return this.editor.textFileService.modelService.getModel(uri);
  };

  getFileModel = (modulePath: string) =>
    this.editor.textFileService.getFileModels(
      this.monaco.Uri.file(modulePath)
    )[0];

  getCurrentModelPath = () => {
    const activeEditor = this.editor.getActiveCodeEditor();

    if (!activeEditor) {
      return undefined;
    }
    const model = activeEditor.getModel();
    if (!model) {
      return undefined;
    }

    return model.uri.path.replace(/^\/sandbox/, '');
  };

  openModule = (module: Module) => {
    if (module.id) {
      const path = getModulePath(
        this.sandbox.modules,
        this.sandbox.directories,
        module.id
      );

      if (path && this.getCurrentModelPath() !== path) {
        this.editor.openFile(path);
      }
    }
  };

  swapDocuments = (nextModule: Module) => {
    this.openModule(nextModule);
  };

  updateCode(code: string = '') {
    const operation = getTextOperation(this.getCode(), code);

    if (!this.receivingCode) {
      // For the live operation we need to send the operation based on the old code,
      // that's why we set the 'liveOperationCode' to the last code so the operation
      // will be applied on that code instead of `currentModule.code`
      this.liveOperationCode = this.getCode();
    }

    this.applyOperationToModel(operation, true);
  }

  lint = async (code: string, title: string, version: number) => {
    if (!title) {
      return;
    }

    const mode = await getMode(title, this.monaco);
    if (this.settings.lintEnabled) {
      if (
        ['javascript', 'typescript', 'typescriptreact', 'vue'].includes(mode)
      ) {
        if (this.lintWorker) {
          this.lintWorker.postMessage({
            code,
            title,
            version,
            template: this.sandbox.template,
          });
        }
      }
    }
  };

  handleChange = (
    currentModuleShortid: string,
    currentModuleTitle: string,
    newCode: string
  ) => {
    if (this.props.onChange) {
      this.props.onChange(newCode, currentModuleShortid);
    }

    if (currentModuleShortid === this.currentModule.shortid) {
      this.lint(
        newCode,
        currentModuleTitle,
        this.editor
          .getActiveCodeEditor()
          .getModel()
          .getVersionId()
      );
    }
  };

  hasNativeTypescript = () => {
    const sandbox = this.sandbox;
    const template = getTemplate(sandbox.template);
    return template.isTypescript;
  };

  resizeEditorInstantly = () => {
    this.forceUpdate(() => {
      if (this.editor) {
        this.editor.editorPart.layout(this.props.width, this.props.height);
      }
    });
  };

  /**
   * We manually commit lib changes, because if do this for *every* change we will
   * reload the whole TS worker & AST for every change. This method is debounced
   * by 300ms.
   */
  commitLibChangesInstantly = () => {
    // eslint-disable-next-line no-underscore-dangle
    this.monaco.languages.typescript.javascriptDefaults._onDidChange.fire(
      this.monaco.languages.typescript.javascriptDefaults
    );

    this.monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: !this.hasNativeTypescript(),
    });
  };

  getCode = () => {
    const activeEditor = this.editor.getActiveCodeEditor();
    if (!activeEditor) return '';

    return activeEditor.getValue(1);
  };

  getEditorOptions = () => {
    const settings = this.settings;
    const currentModule = this.currentModule;

    return {
      ...getSettings(settings),
      ariaLabel: currentModule.title,
      readOnly: Boolean(this.props.readOnly),
    };
  };

  getCustomEditor = (modulePath: string) => {
    const template = getTemplate(this.sandbox.template);
    const config = template.configurationFiles[modulePath];

    const ui = config && getUI(config.type);
    return (
      ui &&
      ui.ConfigWizard &&
      ((container, extraProps) => {
        const currentModule = resolveModule(
          modulePath,
          this.sandbox.modules,
          this.sandbox.directories
        );
        return render(
          <ThemeProvider theme={theme}>
            <Configuration
              onChange={this.props.onChange}
              // Copy the object, we don't want mutations in the component
              // @ts-ignore
              currentModule={currentModule.toJSON()}
              config={config}
              sandbox={this.sandbox}
              {...extraProps}
            />
          </ThemeProvider>,
          container
        );
      })
    );
  };

  render() {
    const { width, height } = this.props;

    const options = this.getEditorOptions();

    return (
      <Container id="vscode-container">
        <GlobalStyles />
        <MonacoEditorComponent
          id={this.props.sandbox.id}
          width={width}
          height={height}
          theme="CodeSandbox"
          options={options}
          editorDidMount={this.configureEditor}
          editorWillMount={() => {}}
          getEditorOptions={this.getEditorOptions}
          customEditorAPI={{ getCustomEditor: this.getCustomEditor }}
        />
      </Container>
    );
  }
}

export default MonacoEditor;
