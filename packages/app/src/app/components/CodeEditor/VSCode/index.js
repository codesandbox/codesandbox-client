// @flow
import * as React from 'react';
import { TextOperation } from 'ot';
import { debounce } from 'lodash-es';
import { join, dirname } from 'path';
import { withTheme } from 'styled-components';
import { getModulePath } from 'common/sandbox/modules';
import { css } from 'glamor';
import { listen } from 'codesandbox-api';

import getTemplate from 'common/templates';
import type {
  Module,
  Sandbox,
  ModuleError,
  ModuleCorrection,
  Directory,
} from 'common/types';
import { getTextOperation } from 'common/utils/diff';

import delay from 'common/utils/delay';

/* eslint-disable import/no-webpack-loader-syntax */
import LinterWorker from 'worker-loader?publicPath=/&name=monaco-linter.[hash:8].worker.js!./workers/linter';
import TypingsFetcherWorker from 'worker-loader?publicPath=/&name=monaco-typings-ata.[hash:8].worker.js!./workers/fetch-dependency-typings';
/* eslint-enable import/no-webpack-loader-syntax */

import MonacoEditorComponent from './MonacoReactComponent';
import type { EditorAPI } from './MonacoReactComponent';
import { Container, CodeContainer } from './elements';
import defineTheme from './define-theme';
import getSettings from './settings';

import type { Props, Editor } from '../types';
import getMode from './mode';
import { liftOff } from './grammars/configure-tokenizer';
import {
  lineAndColumnToIndex,
  indexToLineAndColumn,
} from './monaco-index-converter';

type State = {
  fuzzySearchEnabled: boolean,
};

const fadeIn = css.keyframes('fadeIn', {
  // optional name
  '0%': { opacity: 0 },
  '100%': { opacity: 1 },
});

const fadeOut = css.keyframes('fadeOut', {
  // optional name
  '0%': { opacity: 1 },
  '100%': { opacity: 0 },
});

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
      this.props.width &&
      this.props.height &&
      (this.props.width !== nextProps.width ||
        this.props.height !== nextProps.height)
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

  configureEditor = async (editor: EditorAPI, monaco: any) => {
    this.editor = editor;
    this.monaco = monaco;

    // eslint-disable-next-line no-underscore-dangle
    window.CSEditor = {
      editor: this.editor,
      monaco: this.monaco,
    };

    let modelContentChangedListener;
    editor.editorService.onDidActiveEditorChange(() => {
      if (modelContentChangedListener) {
        modelContentChangedListener.dispose();
      }

      const activeEditor = editor.getActiveCodeEditor();

      if (activeEditor) {
        modelContentChangedListener = activeEditor.onDidChangeModelContent(
          e => {
            const { isLive, sendTransforms } = this.props;

            if (isLive && sendTransforms && !this.receivingCode) {
              this.sendChangeOperations(e);
            }

            this.handleChange();
          }
        );
      }
    });

    requestAnimationFrame(() => {
      this.openModule(this.currentModule);
      this.setupWorkers();
    });

    monaco.languages.typescript.typescriptDefaults.setMaximumWorkerIdleTime(-1);
    monaco.languages.typescript.javascriptDefaults.setMaximumWorkerIdleTime(-1);

    monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);
    monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);

    this.setCompilerOptions();

    liftOff(monaco);

    window.addEventListener('resize', this.resizeEditor);
    this.sizeProbeInterval = setInterval(() => {
      if (this.props.width && this.props.height) {
        return;
      }

      this.resizeEditorInstantly();
    }, 3000);

    const { dependencies } = this;
    if (dependencies != null) {
      if (Object.keys(dependencies)) {
        setTimeout(() => {
          this.fetchDependencyTypings(dependencies);
          this.getConfigSchemas();
        }, this.hasNativeTypescript() ? 500 : 5000);
      }
    }

    // editor.onDidChangeCursorSelection(selectionChange => {
    //   // TODO: add another debounced action to send the current data. So we can
    //   // have the correct cursor pos no matter what
    //   const { onSelectionChanged, isLive } = this.props;
    //   // Reason 3 is update by mouse or arrow keys
    //   if (isLive) {
    //     const lines = editor.getModel().getLinesContent() || [];
    //     const data = {
    //       primary: getSelection(lines, selectionChange.selection),
    //       secondary: selectionChange.secondarySelections.map(s =>
    //         getSelection(lines, s)
    //       ),
    //     };
    //     if (
    //       (selectionChange.reason === 3 ||
    //         /* alt + shift + arrow keys */ selectionChange.source ===
    //           'moveWordCommand' ||
    //         /* click inside a selection */ selectionChange.source === 'api') &&
    //       onSelectionChanged
    //     ) {
    //       this.onSelectionChangedDebounced.cancel();
    //       onSelectionChanged({
    //         selection: data,
    //         moduleShortid: this.currentModule.shortid,
    //       });
    //     } else {
    //       // This is just on typing, we send a debounced selection update as a
    //       // safeguard to make sure we are in sync
    //       this.onSelectionChangedDebounced({
    //         selection: data,
    //         moduleShortid: this.currentModule.shortid,
    //       });
    //     }
    //   }
    // });

    if (this.props.onInitialized) {
      this.disposeInitializer = this.props.onInitialized(this);
    }

    this.registerAutoCompletions();
  };

  setCompilerOptions = () => {
    const hasNativeTypescript = this.hasNativeTypescript();
    const existingConfig = this.tsconfig ? this.tsconfig.compilerOptions : {};

    const compilerDefaults = {
      jsxFactory: 'React.createElement',
      reactNamespace: 'React',
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
      const otOperation = new TextOperation();
      // TODO: add a comment explaining what "delta" is
      let delta = 0;

      this.liveOperationCode =
        this.liveOperationCode || this.currentModule.code || '';
      // eslint-disable-next-line no-restricted-syntax
      for (const change of [...changeEvent.changes].reverse()) {
        const cursorStartOffset =
          lineAndColumnToIndex(
            this.liveOperationCode.split(/\r?\n/),
            change.range.startLineNumber,
            change.range.startColumn
          ) + delta;

        const retain = cursorStartOffset - otOperation.targetLength;
        if (retain > 0) {
          otOperation.retain(retain);
        }

        if (change.rangeLength > 0) {
          otOperation.delete(change.rangeLength);
          delta -= change.rangeLength;
        }

        if (change.text) {
          const normalizedChangeText = change.text.split(/\r?\n/).join('\n');
          otOperation.insert(normalizedChangeText);
          delta += normalizedChangeText.length;
        }
      }

      const remaining = this.liveOperationCode.length - otOperation.baseLength;
      if (remaining > 0) {
        otOperation.retain(remaining);
      }
      this.liveOperationCode = otOperation.apply(this.liveOperationCode);

      sendTransforms(otOperation);

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
    const lines =
      this.editor
        .getActiveCodeEditor()
        .getModel()
        .getLinesContent() || [];

    userSelections.forEach(data => {
      const { userId } = data;

      const decorationId = this.currentModule.shortid + userId;
      if (data.selection === null) {
        this.userSelectionDecorations[
          decorationId
        ] = this.editor
          .getActiveCodeEditor()
          .deltaDecorations(
            this.userSelectionDecorations[decorationId] || [],
            [],
            data.userId
          );

        return;
      }

      const decorations = [];
      const { selection, color, name } = data;

      if (selection) {
        const addCursor = (position, className) => {
          const cursorPos = indexToLineAndColumn(lines, position);

          decorations.push({
            range: new this.monaco.Range(
              cursorPos.lineNumber,
              cursorPos.column,
              cursorPos.lineNumber,
              cursorPos.column
            ),
            options: {
              className: this.userClassesGenerated[className],
            },
          });
        };

        const addSelection = (start, end, className) => {
          const from = indexToLineAndColumn(lines, start);
          const to = indexToLineAndColumn(lines, end);

          decorations.push({
            range: new this.monaco.Range(
              from.lineNumber,
              from.column,
              to.lineNumber,
              to.column
            ),
            options: {
              className: this.userClassesGenerated[className],
            },
          });
        };

        const prefix = color.join('-') + userId;
        const cursorClassName = prefix + '-cursor';
        const secondaryCursorClassName = prefix + '-secondary-cursor';
        const selectionClassName = prefix + '-selection';
        const secondarySelectionClassName = prefix + '-secondary-selection';

        if (!this.userClassesGenerated[cursorClassName]) {
          const nameStyles = {
            content: name,
            position: 'absolute',
            top: -17,
            backgroundColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
            zIndex: 20,
            color:
              color[0] + color[1] + color[2] > 500
                ? 'rgba(0, 0, 0, 0.8)'
                : 'white',
            padding: '2px 4px',
            borderRadius: 2,
            borderBottomLeftRadius: 0,
            fontSize: '.75rem',
            fontWeight: 600,
            userSelect: 'none',
            pointerEvents: 'none',
            width: 'max-content',
          };
          this.userClassesGenerated[cursorClassName] = `${css({
            backgroundColor: `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.8)`,
            width: '2px !important',
            cursor: 'text',
            zIndex: 30,
            ':before': {
              animation: `${fadeOut} 0.3s`,
              animationDelay: '1s',
              animationFillMode: 'forwards',
              opacity: 1,
              ...nameStyles,
            },
            ':hover': {
              ':before': {
                animation: `${fadeIn} 0.3s`,
                animationFillMode: 'forwards',
                opacity: 0,
                ...nameStyles,
              },
            },
          })}`;
        }

        if (!this.userClassesGenerated[secondaryCursorClassName]) {
          this.userClassesGenerated[secondaryCursorClassName] = `${css({
            backgroundColor: `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.6)`,
            width: '2px !important',
          })}`;
        }

        if (!this.userClassesGenerated[selectionClassName]) {
          this.userClassesGenerated[selectionClassName] = `${css({
            backgroundColor: `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.3)`,
            borderRadius: '3px',
            minWidth: 7.6,
          })}`;
        }

        if (!this.userClassesGenerated[secondarySelectionClassName]) {
          this.userClassesGenerated[secondarySelectionClassName] = `${css({
            backgroundColor: `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.2)`,
            borderRadius: '3px',
            minWidth: 7.6,
          })}`;
        }

        addCursor(selection.primary.cursorPosition, cursorClassName);
        if (selection.primary.selection.length) {
          addSelection(
            selection.primary.selection[0],
            selection.primary.selection[1],
            selectionClassName
          );
        }

        if (selection.secondary.length) {
          selection.secondary.forEach(s => {
            addCursor(s.cursorPosition, secondaryCursorClassName);

            if (s.selection.length) {
              addSelection(
                s.selection[0],
                s.selection[1],
                secondarySelectionClassName
              );
            }
          });
        }
      }

      // Allow new model to attach in case it's attaching
      requestAnimationFrame(() => {
        this.userSelectionDecorations[
          decorationId
        ] = this.editor
          .getActiveCodeEditor()
          .deltaDecorations(
            this.userSelectionDecorations[decorationId] || [],
            decorations,
            userId
          );
      });
    });
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
        this.editor
          .getActiveCodeEditor()
          .getModel()
          .getVersionId()
      );
    }
  };

  applyOperationToModel = (operation, pushStack) => {
    const model = this.editor.getActiveCodeEditor().getModel();

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

        const code = operation.apply(module.code || '');
        if (this.props.onChange) {
          this.props.onChange(code, module.shortid);
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

    this.editor.getActiveCodeEditor().updateOptions(this.getEditorOptions());
    this.forceUpdate();
  };

  updateModules = () => {
    console.log('updateModules called');
  };

  setErrors = (errors: Array<ModuleError>) => {
    if (errors.length > 0) {
      const thisModuleErrors = errors.filter(
        error => error.moduleId === this.currentModule.id
      );
      const errorMarkers = thisModuleErrors
        .map(error => {
          if (error) {
            return {
              severity: this.monaco.Severity.Error,
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
        this.editor.getActiveCodeEditor().getModel(),
        'error',
        errorMarkers
      );
    } else {
      this.monaco.editor.setModelMarkers(
        this.editor.getActiveCodeEditor().getModel(),
        'error',
        []
      );
    }
  };

  setCorrections = (corrections: Array<ModuleCorrection>) => {
    if (corrections.length > 0) {
      const correctionMarkers = corrections
        .filter(correction => correction.moduleId === this.currentModule.id)
        .map(correction => {
          if (correction) {
            return {
              severity:
                correction.severity === 'warning'
                  ? this.monaco.Severity.Warning
                  : this.monaco.Severity.Notice,
              startColumn: correction.column,
              startLineNumber: correction.line,
              endColumn: 1,
              endLineNumber: correction.line + 1,
              message: correction.message,
              source: correction.source,
            };
          }

          return null;
        })
        .filter(x => x);

      this.monaco.editor.setModelMarkers(
        this.editor.getActiveCodeEditor().getModel(),
        'correction',
        correctionMarkers
      );
    } else {
      this.monaco.editor.setModelMarkers(
        this.editor.getActiveCodeEditor().getModel(),
        'correction',
        []
      );
    }
  };

  setGlyphs = (glyphs: Array<{ line: number, className: string }>) => {
    if (glyphs.length > 0) {
      const glyphMarkers = glyphs
        .map(glyph => {
          if (glyph) {
            return {
              range: new this.monaco.Range(glyph.line, 1, glyph.line, 1),
              options: {
                isWholeLine: true,
                glyphMarginClassName: glyph.className,
              },
            };
          }

          return null;
        })
        .filter(x => x);

      this.editor.getActiveCodeEditor().deltaDecorations([], glyphMarkers);
    } else {
      this.editor.getActiveCodeEditor().deltaDecorations([], []);
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
        const sandbox = this.sandbox;
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
    this.lintWorker = new LinterWorker();

    this.lintWorker.addEventListener('message', event => {
      const { markers, version } = event.data;

      requestAnimationFrame(() => {
        if (this.editor.getActiveCodeEditor().getModel()) {
          if (
            version ===
            this.editor
              .getActiveCodeEditor()
              .getModel()
              .getVersionId()
          ) {
            this.updateLintWarnings(markers);
          } else {
            this.updateLintWarnings([]);
          }
        }
      });
    });

    this.lint = debounce(this.lint, 400);
  };

  setupWorkers = () => {
    const settings = this.settings;

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

  updateLintWarnings = async (markers: Array<Object>) => {
    const currentModule = this.currentModule;

    const mode = await getMode(currentModule.title, this.monaco);
    if (mode === 'javascript' || mode === 'vue') {
      this.monaco.editor.setModelMarkers(
        this.editor.getActiveCodeEditor().getModel(),
        'eslint',
        markers
      );
    }
  };

  openModule = (module: Module) => {
    const path = getModulePath(
      this.sandbox.modules,
      this.sandbox.directories,
      module.id
    );

    this.editor.openFile(path);
  };

  swapDocuments = (currentModule: Module, nextModule: Module) => {
    return new Promise(resolve => {
      this.openModule(nextModule);

      // Reset changes
      this.changes = { code: '', changes: [] };
      resolve();
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
    const mode = await getMode(title, this.monaco);
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
    const newCode =
      this.editor
        .getActiveCodeEditor()
        .getModel()
        .getValue(1) || '';
    const currentModule = this.currentModule;
    const title = currentModule.title;

    const oldCode = this.currentModule.code || '';

    const codeEquals =
      oldCode.replace(/\r\n/g, '\n') === newCode.replace(/\r\n/g, '\n');

    if (!codeEquals) {
      if (this.props.onChange) {
        this.props.onChange(newCode, this.currentModule.shortid);
      }

      this.lint(
        newCode,
        title,
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

  fetchedSchemas = {};
  getConfigSchemas = async () => {
    const sandbox = this.sandbox;
    const template = getTemplate(sandbox.template);

    const configurations = template.configurationFiles;
    // $FlowIssue
    const schemas: Array<{
      fileName: string,
      schema: Object,
      uri: string,
    }> = (await Promise.all(
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
    )).filter(x => x);

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
        ...this.monaco.languages.json.jsonDefaults._diagnosticsOptions,
        ...monacoSchemas,
      ],
    });
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

  initializeModules = (modules: Array<Module>) =>
    Promise.all(modules.map(module => this.createModel(module, modules)));

  resizeEditor = () => {
    this.resizeEditorInstantly();
  };

  resizeEditorInstantly = () => {
    this.forceUpdate(() => {
      if (this.editor) {
        this.editor.editorPart.layout({
          width: this.props.width,
          height: this.props.height,
        });
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

          const mode = await getMode(module.title, this.monaco);

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
    const modules = this.sandbox.modules;

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

  getCode = () => {
    const activeEditor = this.editor.getActiveCodeEditor();
    if (!activeEditor) return '';

    return activeEditor.getValue({
      lineEnding: '\n',
    });
  };

  handleSaveCode = async () => {
    const onSave = this.props.onSave;
    if (onSave) {
      onSave(this.getCode() || '');
    }
  };

  getEditorOptions = () => {
    const settings = this.settings;
    const currentModule = this.currentModule;

    return {
      ...getSettings(settings),
      ariaLabel: currentModule.title,
      readOnly: !!this.props.readOnly,
    };
  };

  render() {
    const { hideNavigation, width, height } = this.props;

    const options = this.getEditorOptions();

    return (
      <Container>
        <CodeContainer hideNavigation={hideNavigation}>
          <MonacoEditorComponent
            width={width}
            height={height}
            theme="CodeSandbox"
            options={options}
            editorDidMount={this.configureEditor}
            editorWillMount={monaco =>
              defineTheme(monaco, this.props.theme.vscodeTheme)
            }
            getEditorOptions={this.getEditorOptions}
          />
        </CodeContainer>
      </Container>
    );
  }
}

export default withTheme(MonacoEditor);
