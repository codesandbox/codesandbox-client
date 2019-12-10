import { dirname, join } from 'path';

import { getModulePath } from '@codesandbox/common/lib/sandbox/modules';
import getTemplate from '@codesandbox/common/lib/templates';
import type {
  Directory,
  Module,
  ModuleCorrection,
  ModuleError,
  Sandbox,
} from '@codesandbox/common/lib/types';
import delay from '@codesandbox/common/lib/utils/delay';
import { getTextOperation } from '@codesandbox/common/lib/utils/diff';
import FuzzySearch from 'app/components/CodeEditor/FuzzySearch';
import type { Editor, Props } from 'app/components/CodeEditor/types';
import {
  indexToLineAndColumn,
  lineAndColumnToIndex,
} from 'app/utils/monaco-index-converter';
import { actions, dispatch, listen } from 'codesandbox-api';
import { debounce } from 'lodash-es';
import { TextOperation } from 'ot';
import * as React from 'react';
import { withTheme } from 'styled-components';
/* eslint-disable import/no-webpack-loader-syntax, import/default */
import LinterWorker from 'worker-loader?publicPath=/&name=monaco-linter.[hash:8].worker.js!app/overmind/effects/vscode/LinterWorker';
import TypingsFetcherWorker from 'worker-loader?publicPath=/&name=monaco-typings-ata.[hash:8].worker.js!./workers/fetch-dependency-typings';

import defineTheme from './define-theme';
import { CodeContainer, Container } from './elements';
import eventToTransform from './event-to-transform';
import { liftOff } from './grammars/configure-tokenizer';
import { updateUserSelections } from './live-decorations';
import getMode from './mode';
import MonacoEditorComponent from './MonacoReactComponent';
import getSettings from './settings';

/* eslint-enable import/no-webpack-loader-syntax, import/default */

type State = {
  fuzzySearchEnabled: boolean,
};

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

let modelCache = {};

/**
 * This editor is like a slim version of our VSCode editor. It's used in the embed.
 */
class MonacoEditor extends React.Component<Props, State> implements Editor {
  static defaultProps = {
    width: '100%',
    height: '100%',
  };

  sandbox: $PropertyType<Props, 'sandbox'>;
  currentModule: $PropertyType<Props, 'currentModule'>;
  settings: $PropertyType<Props, 'settings'>;
  dependencies: ?$PropertyType<Props, 'dependencies'>;
  tsconfig: ?$PropertyType<Props, 'tsconfig'>;
  disposeInitializer: ?() => void;
  syntaxWorker: ?Worker;
  lintWorker: ?Worker;
  typingsFetcherWorker: ?Worker;
  editor: any;
  monaco: any;
  receivingCode: ?boolean = false;
  transpilationListener: ?Function;
  sizeProbeInterval: ?number;

  constructor(props: Props) {
    super(props);
    this.state = {
      fuzzySearchEnabled: false,
    };
    this.sandbox = props.sandbox;
    this.currentModule = props.currentModule;
    this.settings = props.settings;
    this.dependencies = props.dependencies;

    this.tsconfig = props.tsconfig;

    this.lintWorker = null;
    this.typingsFetcherWorker = null;
    this.sizeProbeInterval = null;

    this.resizeEditor = debounce(this.resizeEditor, 150);
    this.commitLibChanges = debounce(this.commitLibChanges, 300);
    this.onSelectionChangedDebounced = debounce(
      this.onSelectionChangedDebounced,
      500
    );

    this.transpilationListener = this.setupTranspilationListener();
  }

  shouldComponentUpdate(nextProps: Props) {
    if (
      this.props.width !== nextProps.width ||
      this.props.height !== nextProps.height
    ) {
      this.resizeEditorInstantly();
    }

    if (
      this.props.absoluteWidth &&
      this.props.absoluteHeight &&
      (this.props.absoluteWidth !== nextProps.absoluteWidth ||
        this.props.absoluteHeight !== nextProps.absoluteHeight)
    ) {
      this.resizeEditor();
    }

    if (this.props.readOnly !== nextProps.readOnly && this.editor) {
      this.editor.updateOptions({ readOnly: !!nextProps.readOnly });
    }

    if (this.props.theme.vscodeTheme !== nextProps.theme.vscodeTheme) {
      defineTheme(this.monaco, nextProps.theme.vscodeTheme);
    }

    return false;
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeEditor);
    // Make sure that everything has run before disposing, to prevent any inconsistensies

    this.disposeModules(this.sandbox.modules);
    if (this.editor) {
      this.editor.dispose();
    }
    if (this.lintWorker) {
      this.lintWorker.terminate();
    }
    if (this.typingsFetcherWorker) {
      this.typingsFetcherWorker.terminate();
    }
    if (this.transpilationListener) {
      this.transpilationListener();
    }
    clearInterval(this.sizeProbeInterval);

    if (this.disposeInitializer) {
      this.disposeInitializer();
    }
  }

  setupTranspilationListener() {
    return listen(({ type, code, path }) => {
      if (type === 'add-extra-lib') {
        const dtsPath = `${path}.d.ts`;
        this.monaco.languages.typescript.typescriptDefaults._extraLibs[
          `file:///${dtsPath}`
        ] = code;
        this.commitLibChanges();
      }
    });
  }

  configureEditor = async (editor: any, monaco: any) => {
    this.editor = editor;
    this.monaco = monaco;

    // eslint-disable-next-line no-underscore-dangle
    window.CSEditor = {
      editor: this.editor,
      monaco: this.monaco,
    };

    requestAnimationFrame(() => {
      this.setupWorkers();
      editor.onDidChangeModelContent(e => {
        const { isLive, sendTransforms } = this.props;

        if (isLive && sendTransforms && !this.receivingCode) {
          this.sendChangeOperations(e);
        }

        this.handleChange();
      });
    });

    monaco.languages.typescript.typescriptDefaults.setMaximumWorkerIdleTime(-1);
    monaco.languages.typescript.javascriptDefaults.setMaximumWorkerIdleTime(-1);

    monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);
    monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);

    this.setCompilerOptions();

    const { sandbox } = this;
    const { currentModule } = this;

    liftOff(monaco);

    this.initializeModules(sandbox.modules);
    await this.openNewModel(currentModule);

    window.addEventListener('resize', this.resizeEditor);
    this.sizeProbeInterval = setInterval(() => {
      if (this.props.absoluteWidth && this.props.absoluteHeight) {
        return;
      }

      this.resizeEditorInstantly();
    }, 3000);

    const { dependencies } = this;
    if (dependencies != null) {
      if (Object.keys(dependencies)) {
        setTimeout(
          () => {
            this.fetchDependencyTypings(dependencies);
            this.getConfigSchemas();
          },
          this.hasNativeTypescript() ? 500 : 5000
        );
      }
    }

    editor.addAction({
      // An unique identifier of the contributed action.
      id: 'fuzzy-search',

      // A label of the action that will be presented to the user.
      label: 'Open Module',

      // An optional array of keybindings for the action.
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_P], // eslint-disable-line no-bitwise

      // A precondition for this action.
      precondition: null,

      // A rule to evaluate on top of the precondition in order to dispatch the keybindings.
      keybindingContext: null,

      contextMenuGroupId: 'navigation',

      contextMenuOrder: 1.5,

      // Method that will be executed when the action is triggered.
      // @param editor The editor instance is passed in as a convinience
      run: () => {
        this.setState(
          {
            fuzzySearchEnabled: true,
          },
          () => this.forceUpdate()
        );
      },
    });

    editor.onDidChangeCursorSelection(selectionChange => {
      // TODO: add another debounced action to send the current data. So we can
      // have the correct cursor pos no matter what
      const { onSelectionChanged, isLive } = this.props;
      // Reason 3 is update by mouse or arrow keys
      if (isLive && editor.getModel()) {
        const lines = editor.getModel().getLinesContent() || [];
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
            /* click inside a selection */ selectionChange.source === 'api') &&
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
    });

    if (this.props.onInitialized) {
      this.disposeInitializer = this.props.onInitialized(this);
    }

    // TODO remove this as soon as we solve the keybinding issues
    editor.addCommand(
      // eslint-disable-next-line
      this.monaco.KeyMod.CtrlCmd | this.monaco.KeyCode.KEY_S,
      () => {
        const { onSave } = this.props;
        if (onSave) {
          onSave(this.getCode());
        }
      }
    );

    this.registerAutoCompletions();
  };

  setCompilerOptions = () => {
    const hasNativeTypescript = this.hasNativeTypescript();
    const existingConfig = this.tsconfig ? this.tsconfig.compilerOptions : {};
    const jsxFactory = existingConfig.jsxFactory || 'React.createElement';
    const reactNamespace = existingConfig.reactNamespace || 'React';

    const compilerDefaults = {
      jsxFactory,
      reactNamespace,
      jsx: this.monaco.languages.typescript.JsxEmit.React,
      target: this.monaco.languages.typescript.ScriptTarget.ES2016,
      allowNonTsExtensions: !hasNativeTypescript,
      moduleResolution: this.monaco.languages.typescript.ModuleResolutionKind
        .NodeJs,
      module: hasNativeTypescript
        ? this.monaco.languages.typescript.ModuleKind.ES2015
        : this.monaco.languages.typescript.ModuleKind.System,
      experimentalDecorators: true,
      noEmit: true,
      allowJs: true,
      typeRoots: ['node_modules/@types'],

      forceConsistentCasingInFileNames:
        hasNativeTypescript && existingConfig.forceConsistentCasingInFileNames,
      noImplicitReturns:
        hasNativeTypescript && existingConfig.noImplicitReturns,
      noImplicitThis: hasNativeTypescript && existingConfig.noImplicitThis,
      noImplicitAny: hasNativeTypescript && existingConfig.noImplicitAny,
      strictNullChecks: hasNativeTypescript && existingConfig.strictNullChecks,
      suppressImplicitAnyIndexErrors:
        hasNativeTypescript && existingConfig.suppressImplicitAnyIndexErrors,
      noUnusedLocals: hasNativeTypescript && existingConfig.noUnusedLocals,

      newLine: this.monaco.languages.typescript.NewLineKind.LineFeed,
    };

    this.monaco.languages.typescript.typescriptDefaults.setCompilerOptions(
      compilerDefaults
    );
    this.monaco.languages.typescript.javascriptDefaults.setCompilerOptions(
      compilerDefaults
    );

    this.monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: !hasNativeTypescript,
    });
  };

  setReceivingCode = (receiving: boolean) => {
    this.receivingCode = receiving;
  };

  setTSConfig = (config: Object) => {
    this.tsconfig = config;

    this.setCompilerOptions();
  };

  changeModule = (
    newModule: Module,
    errors?: Array<ModuleError>,
    corrections?: Array<ModuleCorrection>
  ) => {
    const oldModule = this.currentModule;

    this.swapDocuments(oldModule, newModule).then(() => {
      this.currentModule = newModule;

      if (errors) {
        this.setErrors(errors);
      }

      if (corrections) {
        this.setCorrections(corrections);
      }

      if (this.props.onCodeReceived) {
        // Whenever the user changes a module we set up a state that defines
        // that the changes of code are not sent to live users. We need to reset
        // this state when we're doing changing modules
        this.props.onCodeReceived();
        this.liveOperationCode = '';
      }
    });
  };

  onSelectionChangedDebounced = data => {
    if (this.props.onSelectionChanged) {
      this.props.onSelectionChanged(data);
    }
  };

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

  updateUserSelections = (
    userSelections: Array<
      | {
          userId: string,
          selection: null,
        }
      | {
          userId: string,
          name: string,
          selection: any,
          color: Array<number>,
        }
    >
  ) => {
    updateUserSelections(
      this.monaco,
      this.editor,
      this.currentModule,
      userSelections
    );
  };

  changeSandbox = (
    newSandbox: Sandbox,
    newCurrentModule: Module,
    dependencies: $PropertyType<Props, 'dependencies'>
  ): Promise<null> =>
    new Promise(resolve => {
      const oldSandbox = this.sandbox;

      this.sandbox = newSandbox;
      this.currentModule = newCurrentModule;
      this.dependencies = dependencies;

      // Reset models, dispose old ones
      this.disposeModules(oldSandbox.modules);

      // Do in setTimeout, since disposeModules is async
      setTimeout(() => {
        this.getConfigSchemas();
        // Initialize new models
        this.initializeModules(newSandbox.modules)
          .then(() => this.openNewModel(newCurrentModule))
          .then(resolve);
      });
    });

  changeCode = (code: string, moduleId?: string) => {
    if (
      code !== this.getCode() &&
      (!moduleId || this.currentModule.id === moduleId)
    ) {
      this.updateCode(code);
      this.lint(
        code,
        this.currentModule.title,
        this.editor.getModel().getVersionId()
      );
    }
  };

  applyOperationToModel = (operation, pushStack) => {
    const model = this.editor.getModel();

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

    if (pushStack) {
      model.pushEditOperations([], results);
    } else {
      model.applyEdits(results);
    }
  };

  applyOperations = (operations: { [moduleShortid: string]: any }) => {
    const operationsJSON = operations.toJSON();

    Object.keys(operationsJSON).forEach(moduleShortid => {
      const operation = TextOperation.fromJSON(operationsJSON[moduleShortid]);

      if (moduleShortid !== this.currentModule.shortid) {
        // Apply the code to the current module code itself
        const module = this.sandbox.modules.find(
          m => m.shortid === moduleShortid
        );

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
        return;
      }

      this.liveOperationCode = '';
      this.applyOperationToModel(operation);
    });
  };

  changeDependencies = (
    dependencies: ?$PropertyType<Props, 'dependencies'>
  ) => {
    this.dependencies = dependencies;
    if (dependencies) {
      this.fetchDependencyTypings(dependencies);
    }
  };

  changeSettings = (settings: $PropertyType<Props, 'settings'>) => {
    this.settings = settings;
    if (settings.lintEnabled && !this.lintWorker) {
      this.setupLintWorker();
    }

    this.editor.updateOptions(this.getEditorOptions());
    this.forceUpdate();
  };

  updateModules = () => {
    const { sandbox } = this;

    sandbox.modules.forEach(module => {
      if (modelCache[module.id] && modelCache[module.id].model) {
        const path = getModulePath(
          sandbox.modules,
          sandbox.directories,
          module.id
        );

        if (path === '') {
          // Parent dir got deleted
          this.disposeModel(module.id);
          return;
        }

        // Check for changed path, if that's
        // the case create a new model with corresponding tag, ditch the other model
        if (path !== modelCache[module.id].model.uri.path) {
          const isCurrentlyOpened =
            this.editor.getModel() === modelCache[module.id].model;

          if (isCurrentlyOpened) {
            // Unload model, we're going to dispose it
            this.editor.setModel(null);
          }

          this.disposeModel(module.id);

          this.createModel(module, sandbox.modules, sandbox.directories).then(
            newModel => {
              if (isCurrentlyOpened) {
                // Open it again if it was open
                this.editor.setModel(newModel);
              }
            }
          );
        }
      }
    });

    // Also check for deleted modules
    Object.keys(modelCache).forEach(moduleId => {
      // This module got deleted, dispose it
      if (!sandbox.modules.find(m => m.id === moduleId)) {
        this.disposeModel(moduleId);
      }
    });
  };

  setErrors = (errors: Array<ModuleError>) => {
    if (errors.length > 0) {
      const currentPath = this.editor.getModel().uri.path;
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
              endColumn: error.columnEnd || error.column,
              endLineNumber: error.lineEnd || error.line + 1,
              message: error.message,
            };
          }

          return null;
        })
        .filter(x => x);

      this.monaco.editor.setModelMarkers(
        this.editor.getModel(),
        'error',
        errorMarkers
      );
    } else {
      this.monaco.editor.setModelMarkers(this.editor.getModel(), 'error', []);
    }
  };

  setCorrections = (corrections: Array<ModuleCorrection>) => {
    if (corrections.length > 0) {
      const currentPath = this.editor.getModel().uri.path;

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
        this.editor.getModel(),
        'correction',
        correctionMarkers
      );
    } else {
      this.monaco.editor.setModelMarkers(
        this.editor.getModel(),
        'correction',
        []
      );
    }
  };

  registerAutoCompletions = () => {
    this.monaco.languages.registerCompletionItemProvider('typescript', {
      triggerCharacters: ['"', "'", '.'],
      provideCompletionItems: (model, position) => {
        // Get editor content before the pointer
        const textUntilPosition = model.getValueInRange(
          {
            startLineNumber: 1,
            startColumn: 1,
            endLineNumber: position.lineNumber,
            endColumn: position.column,
          },
          1
        );

        if (
          /(([\s|\n]from\s)|(\brequire\b\())["|']\.*$/.test(textUntilPosition)
        ) {
          // It's probably a `import` statement or `require` call
          if (textUntilPosition.endsWith('.')) {
            // User is trying to import a file
            const prefix = textUntilPosition.match(/[./]+$/)[0];

            const modulesByPath = new WeakMap();
            this.sandbox.modules.forEach(module => {
              const path = getModulePath(
                this.sandbox.modules,
                this.sandbox.directories,
                module.id
              );

              modulesByPath.set(
                module,
                path.indexOf('/') === -1 ? '/' + path : path
              );
            });

            const currentModulePath = modulesByPath.get(this.currentModule);
            if (!currentModulePath) {
              return null;
            }

            const relativePath = join(dirname(currentModulePath), prefix);
            return this.sandbox.modules
              .filter(m => {
                const path = modulesByPath.get(m);

                return (
                  path &&
                  m.id !== this.currentModule.id &&
                  path.startsWith(relativePath)
                );
              })
              .map(module => {
                let path = modulesByPath.get(module);

                if (!path) return null;

                // Don't keep extension for JS files
                if (path.endsWith('.js')) {
                  path = path.replace(/\.js$/, '');
                }

                // Don't keep extension for TS files
                if (path.endsWith('.ts')) {
                  path = path.replace(/\.ts$/, '');
                }

                return {
                  label:
                    prefix +
                    path.replace(relativePath, relativePath === '/' ? '/' : ''),
                  insertText: path.slice(
                    relativePath === '/' ? 0 : relativePath.length
                  ),
                  kind: this.monaco.languages.CompletionItemKind.File,
                };
              })
              .filter(Boolean);
          }
          const deps = this.dependencies;
          if (deps) {
            // User is trying to import a dependency
            return Object.keys(deps).map(name => ({
              label: name,
              detail: deps[name],
              kind: this.monaco.languages.CompletionItemKind.Module,
            }));
          }

          return [];
        }
        return [];
      },
    });
  };

  setupTypeWorker = () => {
    this.typingsFetcherWorker = new TypingsFetcherWorker();
    const regex = /node_modules\/(@types\/.*?)\//;

    this.fetchDependencyTypings(this.dependencies || {});

    if (this.typingsFetcherWorker) {
      this.typingsFetcherWorker.addEventListener('message', event => {
        const { sandbox } = this;
        const dependencies = this.dependencies || sandbox.npmDependencies;

        Object.keys(event.data).forEach((path: string) => {
          const typings = event.data[path];
          if (
            path.startsWith('node_modules/@types') &&
            this.hasNativeTypescript()
          ) {
            const match = path.match(regex);
            if (match && match[1]) {
              const dependency = match[1];

              if (
                !Object.keys(dependencies).includes(dependency) &&
                this.props.onNpmDependencyAdded
              ) {
                this.props.onNpmDependencyAdded(dependency);
              }
            }
          }

          this.addLib(typings, '/' + path);
        });
      });
    }
  };

  setupLintWorker = () => {
    if (!this.lintWorker) {
      this.lintWorker = new LinterWorker();

      this.lintWorker.addEventListener('message', event => {
        const { markers, version } = event.data;
        requestAnimationFrame(() => {
          if (this.editor.getModel()) {
            const modelPath = this.editor.getModel().uri.path;
            dispatch(actions.correction.clear(modelPath, 'eslint'));

            if (version === this.editor.getModel().getVersionId()) {
              markers.forEach(marker => {
                dispatch(
                  actions.correction.show(marker.message, {
                    line: marker.startLineNumber,
                    column: marker.startColumn,
                    lineEnd: marker.endLineNumber,
                    columnEnd: marker.endColumn,
                    source: 'eslint',
                    severity: marker.severity === 2 ? 'warning' : 'notice',
                    path: modelPath,
                  })
                );
              });
            }
          }
        });
      });

      this.lint = debounce(this.lint, 400);

      requestAnimationFrame(() => {
        if (this.editor.getModel()) {
          this.lint(
            this.getCode(),
            this.currentModule.title,
            this.editor.getModel().getVersionId()
          );
        }
      });
    }
  };

  setupWorkers = () => {
    const { settings } = this;

    if (settings.lintEnabled) {
      // Delay this one, as initialization is very heavy
      setTimeout(() => {
        this.setupLintWorker();
      }, 5000);
    }

    if (settings.autoDownloadTypes) {
      this.setupTypeWorker();
    }
  };

  updateDecorations = async (classifications: Array<Object>) => {
    const decorations = classifications.map(classification => ({
      range: new this.monaco.Range(
        classification.startLine,
        classification.start,
        classification.endLine,
        classification.end
      ),
      options: {
        inlineClassName: classification.type
          ? `${classification.kind} ${classification.type}-of-${classification.parentKind}`
          : classification.kind,
      },
    }));

    const { currentModule } = this;
    const modelInfo = await this.getModelById(currentModule.id);

    modelInfo.decorations = this.editor.deltaDecorations(
      modelInfo.decorations || [],
      decorations
    );
  };

  disposeModel = (id: string) => {
    if (modelCache[id]) {
      try {
        if (modelCache[id].model && !modelCache[id].model.isDisposed()) {
          modelCache[id].model.dispose();
        }
        if (modelCache[id].lib && !modelCache[id].lib.isDisposed()) {
          modelCache[id].lib.dispose();
        }

        delete modelCache[id];
      } catch (e) {
        console.error(e);
      }
    }
  };

  swapDocuments = (currentModule: Module, nextModule: Module) => {
    // We get the id here because we don't want currentModule to mutate in the meantime.
    // If the module changes in the store, and we use it here it will otherwise
    // throw an error 'Cannot use detached model'. So that's why we get the desired values first.
    const { id } = currentModule;

    return new Promise(resolve => {
      // We load this in a later moment so the rest of the ui already updates before the editor
      // this will give a perceived speed boost. Inspiration from vscode team
      setTimeout(async () => {
        if (modelCache[id]) {
          const { sandbox } = this;
          const path = getModulePath(sandbox.modules, sandbox.directories, id);

          modelCache[id].viewState = this.editor.saveViewState();
          if (modelCache[id].lib) {
            // We let Monaco know what the latest code is of this file by removing
            // the old extraLib definition and defining a new one.
            modelCache[id].lib.dispose();
            modelCache[id].lib = this.addLib(currentModule.code || '', path);
          }
        }

        await this.openNewModel(nextModule);
        this.editor.focus();
        resolve();
      }, 50);
    });
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
    const mode = (await getMode(title, this.monaco)) || 'typescript';
    if (this.settings.lintEnabled) {
      if (mode === 'javascript' || mode === 'vue') {
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

  handleChange = () => {
    const newCode = this.editor.getModel().getValue(1) || '';
    const { currentModule } = this;
    const { title } = currentModule;

    const oldCode = this.currentModule.code || '';

    const codeEquals =
      oldCode.replace(/\r\n/g, '\n') === newCode.replace(/\r\n/g, '\n');

    if (!codeEquals) {
      if (this.props.onChange) {
        this.props.onChange(newCode, this.currentModule.shortid);
      }

      this.lint(newCode, title, this.editor.getModel().getVersionId());
    }
  };

  hasNativeTypescript = () => {
    const { sandbox } = this;

    // Add a quick hack for CRA+TS that will be removed when we fully made the switch to
    // VSCode
    const template = getTemplate(sandbox.template);
    if (template.name === 'create-react-app') {
      return sandbox.modules.some(m => m.title.endsWith('.tsx'));
    }
    return template.isTypescript;
  };

  fetchedSchemas = {};

  getConfigSchemas = async () => {
    const { sandbox } = this;
    const template = getTemplate(sandbox.template);

    const configurations = template.configurationFiles;
    // $FlowIssue
    const schemas: Array<{
      fileName: string,
      schema: Object,
      uri: string,
    }> = (
      await Promise.all(
        Object.keys(configurations).map(async p => {
          const config = configurations[p];

          if (this.fetchedSchemas[config.title]) {
            return null;
          }

          if (config.schema) {
            try {
              const schema = await fetch(config.schema).then(x => x.json());
              return { fileName: config.title, schema, uri: config.schema };
            } catch (e) {
              return null;
            }
          }
          return null;
        })
      )
    ).filter(x => x);

    const monacoSchemas = schemas.map(data => {
      this.fetchedSchemas[data.fileName] = true;

      return {
        uri: data.uri,
        fileMatch: [data.fileName],
        schema: data.schema,
      };
    });

    this.monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      schemas: [
        ...this.monaco.languages.json.jsonDefaults._diagnosticsOptions.schemas,
        ...monacoSchemas,
      ],
    });
  };

  closeFuzzySearch = () => {
    this.setState({ fuzzySearchEnabled: false }, () => this.forceUpdate());
    this.editor.focus();
  };

  fetchDependencyTypings = (dependencies: Object) => {
    if (this.typingsFetcherWorker) {
      this.monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions(
        {
          noSemanticValidation: true,
          noSyntaxValidation: !this.hasNativeTypescript(),
        }
      );
      this.typingsFetcherWorker.postMessage({ dependencies });
    }
  };

  disposeModules = (modules: Array<Module>) => {
    if (this.editor) {
      this.editor.setModel(null);
    }

    if (this.monaco) {
      modules.forEach(m => {
        this.disposeModel(m.id);
      });
    }

    modelCache = {};
  };

  initializeModules = (modules: Array<Module>) =>
    Promise.all(modules.map(module => this.createModel(module, modules)));

  resizeEditor = () => {
    this.resizeEditorInstantly();
  };

  resizeEditorInstantly = () => {
    this.forceUpdate(() => {
      if (this.editor) {
        this.editor.layout();
      }
    });
  };

  addLib = (code: string, path: string) => {
    const fullPath = `file://${path}`;

    const existingLib = this.monaco.languages.typescript.typescriptDefaults.getExtraLibs()[
      fullPath
    ];
    // Only add it if it has been added before, we don't care about the contents
    // of the libs, only if they've been added.

    if (!existingLib) {
      // We add it manually, and commit the changes manually
      // eslint-disable-next-line no-underscore-dangle
      this.monaco.languages.typescript.typescriptDefaults._extraLibs[
        fullPath
      ] = code;
      this.commitLibChanges();
    }
  };

  /**
   * We manually commit lib changes, because if do this for *every* change we will
   * reload the whole TS worker & AST for every change. This method is debounced
   * by 300ms.
   */
  commitLibChanges = () => {
    // eslint-disable-next-line no-underscore-dangle
    this.monaco.languages.typescript.typescriptDefaults._onDidChange.fire(
      this.monaco.languages.typescript.typescriptDefaults
    );

    this.monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: !this.hasNativeTypescript(),
    });
  };

  creatingModelMap = {};

  createModel = (
    module: Module,
    modules: Array<Module> = this.sandbox.modules,
    directories: Array<Directory> = this.sandbox.directories
  ) => {
    // Prevent race conditions
    this.creatingModelMap[module.id] =
      this.creatingModelMap[module.id] ||
      (async () => {
        // Remove the first slash, as this will otherwise create errors in monaco
        const path = getModulePath(modules, directories, module.id);
        if (path) {
          // We need to add this as a lib specifically to Monaco, because Monaco
          // tends to lose type definitions if you don't touch a file for a while.
          // Related issue: https://github.com/Microsoft/monaco-editor/issues/461
          const lib = this.addLib(module.code || '', path);

          const mode =
            (await getMode(module.title, this.monaco)) || 'typescript';

          if (
            mode !== 'javascript' &&
            mode !== 'typescript' &&
            this.monaco.languages.getEncodedLanguageId(mode) === null
          ) {
            // In this case the language still needs to load, if we load the model immediately it will get
            // the plaintext value. So when the language loads we set the new model
            // eslint-disable-next-line no-constant-condition

            while (this.monaco.languages.getEncodedLanguageId(mode) === null) {
              await delay(100); // eslint-disable-line
            }
          }

          const model = this.monaco.editor.createModel(
            module.code || '',
            mode === 'javascript' ? 'typescript' : mode,
            new this.monaco.Uri({ path, scheme: 'file' })
          );

          model.updateOptions({ tabSize: this.props.settings.tabWidth });

          modelCache[module.id] = modelCache[module.id] || {
            model: null,
            decorations: [],
            viewState: null,
          };
          modelCache[module.id].model = model;
          modelCache[module.id].lib = lib;

          delete this.creatingModelMap[module.id];
          return model;
        }

        delete this.creatingModelMap[module.id];
        return undefined;
      })();

    return this.creatingModelMap[module.id];
  };

  getModelById = async (id: string) => {
    const { modules } = this.sandbox;

    if (!modelCache[id] || !modelCache[id].model) {
      const module = modules.find(m => m.id === id);

      if (module) {
        await this.createModel(module);
      }
    }

    return modelCache[id];
  };

  getModelByShortid = async (shortid: string) => {
    const module = this.sandbox.modules.find(m => m.shortid === shortid);

    if (!module) {
      throw new Error('Cannot find module with shortid: ' + shortid);
    }
    return this.getModelById(module.id);
  };

  openNewModel = async (module: Module) => {
    const { id, code: newCode, title } = module;
    const modelInfo = await this.getModelById(id);

    // Mark receiving code so that the editor won't send all changed code to the
    // other clients.
    this.receivingCode = true;

    if (newCode !== modelInfo.model.getValue(1)) {
      modelInfo.model.setValue(newCode);
    }

    this.currentModule = module;
    this.editor.setModel(modelInfo.model);
    this.receivingCode = false;

    requestAnimationFrame(() => {
      if (modelInfo.viewState) {
        this.editor.restoreViewState(modelInfo.viewState);
      }

      this.lint(
        modelInfo.model.getValue(1),
        title,
        modelInfo.model.getVersionId()
      );
    });
  };

  setCurrentModule = (moduleId: string) => {
    this.closeFuzzySearch();

    const module = this.sandbox.modules.find(m => m.id === moduleId);
    if (module) {
      if (this.props.onModuleChange) {
        this.props.onModuleChange(moduleId);
      }
    }
  };

  openReference = model => {
    const foundModuleId = Object.keys(modelCache).find(
      mId => modelCache[mId].model === model
    );

    if (foundModuleId) {
      this.setCurrentModule(foundModuleId);
    }

    // const selection = data.options.selection;
    // if (selection) {
    //   if (
    //     typeof selection.endLineNumber === 'number' &&
    //     typeof selection.endColumn === 'number'
    //   ) {
    //     this.editor.setSelection(selection);
    //     this.editor.revealRangeInCenter(selection);
    //   } else {
    //     const pos = {
    //       lineNumber: selection.startLineNumber,
    //       column: selection.startColumn,
    //     };
    //     this.editor.setPosition(pos);
    //     this.editor.revealPositionInCenter(pos);
    //   }
    // }

    return Promise.resolve({
      getControl: () => this.editor,
    });
  };

  getCode = () =>
    this.editor.getValue({
      lineEnding: '\n',
    });

  handleSaveCode = async () => {
    const { onSave } = this.props;
    if (onSave) {
      onSave(this.getCode() || '');
    }
  };

  getEditorOptions = () => {
    const { settings } = this;
    const { currentModule } = this;

    return {
      ...getSettings(settings),
      ariaLabel: currentModule.title,
      readOnly: !!this.props.readOnly,
    };
  };

  render() {
    const { hideNavigation } = this.props;

    const { sandbox } = this;
    const { currentModule } = this;
    const options = this.getEditorOptions();

    return (
      <Container>
        <CodeContainer hideNavigation={hideNavigation}>
          {this.state.fuzzySearchEnabled && (
            <FuzzySearch
              closeFuzzySearch={this.closeFuzzySearch}
              setCurrentModule={this.setCurrentModule}
              modules={sandbox.modules}
              directories={sandbox.directories}
              currentModuleId={currentModule.id}
            />
          )}
          <MonacoEditorComponent
            width="100%"
            height="100%"
            theme="CodeSandbox"
            options={options}
            editorDidMount={this.configureEditor}
            editorWillMount={monaco =>
              defineTheme(monaco, this.props.theme.vscodeTheme)
            }
            getEditorOptions={this.getEditorOptions}
            openReference={this.openReference}
          />
        </CodeContainer>
      </Container>
    );
  }
}

export default withTheme(MonacoEditor);
