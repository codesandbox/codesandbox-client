/* @flow */
import * as React from 'react';
import styled from 'styled-components';
import { debounce } from 'lodash';
import type {
  Preferences,
  ModuleError,
  ModuleCorrection,
  Module,
  Directory,
} from 'common/types';
import { getModulePath } from 'app/store/entities/sandboxes/modules/selectors';

import theme from 'common/theme';
import getTemplate from 'common/templates';

/* eslint-disable import/no-webpack-loader-syntax */
import SyntaxHighlightWorker from 'worker-loader?name=monaco-syntax-highlighter.[hash].worker.js!./monaco/workers/syntax-highlighter';
import LinterWorker from 'worker-loader?name=monaco-linter.[hash].worker.js!./monaco/workers/linter';
import TypingsFetcherWorker from 'worker-loader?name=monaco-typings-ata.[hash].worker.js!./monaco/workers/fetch-dependency-typings';
/* eslint-enable import/no-webpack-loader-syntax */

import MonacoEditor from './monaco/MonacoReactComponent';
import FuzzySearch from './FuzzySearch/index';

let modelCache = {};

type State = {
  fuzzySearchEnabled: boolean,
};

type Props = {
  code: ?string,
  errors: ?Array<ModuleError>,
  corrections: Array<ModuleCorrection>,
  id: string,
  sandboxId: string,
  title: string,
  changeCode: (id: string, code: string) => Object,
  saveCode: ?() => void,
  preferences: Preferences,
  modules: Array<Module>,
  directories: Array<Directory>,
  dependencies: ?Object,
  setCurrentModule: ?(sandboxId: string, moduleId: string) => void,
  template: string,
  addDependency: ?(sandboxId: string, dependency: string) => void,
  hideNavigation: boolean,
};

const Container = styled.div`
  width: 100%;
  height: 100vh;
  z-index: 30;
`;

const fontFamilies = (...families) =>
  families
    .filter(Boolean)
    .map(
      family => (family.indexOf(' ') !== -1 ? JSON.stringify(family) : family)
    )
    .join(', ');

const CodeContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 30;

  .margin-view-overlays {
    background: ${theme.background2()};
  }

  .monaco-editor.vs-dark .monaco-editor-background {
    background: ${theme.background2()};
  }

  .mtk5 {
    color: #99c794 !important;
  }
  .mtk12.PropertyAssignment {
    color: #99c794;
  }
  .mtk12.PropertyAssignment.PropertyAccessExpression {
    color: #fac863;
  }
  .mtk12.Identifier.JsxOpeningElement {
    color: #ec5f67;
  }
  .mtk12.Identifier.JsxExpression.JsxClosingElement {
    color: #ec5f67;
  }
  .mtk12.Identifier.JsxClosingElement {
    color: #ec5f67 !important;
  }
  .mtk12.Identifier.JsxSelfClosingElement {
    color: #ec5f67;
  }
  .mtk12.Identifier.VariableStatement.JsxClosingElement {
    color: #ec5f67 !important;
  }
  .mtk12.VariableStatement.JsxSelfClosingElement.Identifier {
    color: #ec5f67;
  }
  .mtk12.Identifier.JsxAttribute.VariableDeclaration {
    color: #aa759f;
  }
  .mtk12.JsxExpression.VariableStatement {
    color: #fac863;
  }
  .mtk12.VariableStatement.JsxSelfClosingElement {
    color: #e0e0e0;
  }
  .mtk12.VariableStatement.JsxClosingElement {
    color: #e0e0e0;
  }
  .mtk12.JsxElement.JsxText {
    color: #e0e0e0;
  }
  .JsxText {
    color: #e0e0e0;
  }

  .Identifier.CallExpression
    + .OpenParenToken.CallExpression
    + .Identifier.CallExpression {
    color: #fac863 !important;
  }
`;

const requireAMDModule = paths =>
  new Promise(resolve => window.require(paths, () => resolve()));

const handleError = (
  monaco,
  editor,
  nextErrors: ?Array<ModuleError>,
  nextCorrections: Array<ModuleCorrection>
) => {
  if (!monaco) return;
  if (nextErrors && nextErrors.length > 0) {
    const errorMarkers = nextErrors
      .map(error => {
        if (error) {
          return {
            severity: monaco.Severity.Error,
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

    monaco.editor.setModelMarkers(editor.getModel(), 'error', errorMarkers);
  } else {
    monaco.editor.setModelMarkers(editor.getModel(), 'error', []);
  }

  if (nextCorrections.length > 0) {
    const correctionMarkers = nextCorrections
      .map(correction => {
        if (correction) {
          return {
            severity:
              correction.severity === 'warning'
                ? monaco.Severity.Warning
                : monaco.Severity.Notice,
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

    monaco.editor.setModelMarkers(
      editor.getModel(),
      'correction',
      correctionMarkers
    );
  } else {
    monaco.editor.setModelMarkers(editor.getModel(), 'correction', []);
  }
};

export default class CodeEditor extends React.Component<Props, State> {
  state = {
    fuzzySearchEnabled: false,
  };

  syntaxWorker: ?Worker;
  lintWorker: ?Worker;
  typingsFetcherWorker: ?Worker;
  sizeProbeInterval: number;

  setupTypeWorker = () => {
    this.typingsFetcherWorker = new TypingsFetcherWorker();

    this.typingsFetcherWorker.addEventListener('message', event => {
      const { path, typings } = event.data;

      if (
        path.startsWith('node_modules/@types') &&
        this.hasNativeTypescript() &&
        this.props.addDependency != null
      ) {
        const dependency = path.match(/node_modules\/(@types\/.*)\//)[1];

        if (!Object.keys(this.props.dependencies).includes(dependency)) {
          this.props.addDependency(this.props.sandboxId, dependency);
        }
      }

      if (
        !this.monaco.languages.typescript.typescriptDefaults.getExtraLibs()[
          `file:///${path}`
        ]
      ) {
        requestAnimationFrame(() => {
          this.monaco.languages.typescript.typescriptDefaults.addExtraLib(
            typings,
            `file:///${path}`
          );
        });
      }
    });
  };

  setupLintWorker = () => {
    this.lintWorker = new LinterWorker();

    this.lintWorker.addEventListener('message', event => {
      const { markers, version } = event.data;

      requestAnimationFrame(() => {
        if (version === this.editor.getModel().getVersionId()) {
          this.updateLintWarnings(markers);
        }
      });
    });

    this.lint = debounce(this.lint, 400);
  };

  setupSyntaxWorker = () => {
    this.syntaxWorker = new SyntaxHighlightWorker();

    this.syntaxWorker.addEventListener('message', event => {
      const { classifications, version } = event.data;

      requestAnimationFrame(() => {
        if (version === this.editor.getModel().getVersionId()) {
          this.updateDecorations(classifications);
        }
      });
    });
  };

  setupWorkers = () => {
    this.setupSyntaxWorker();

    if (this.props.preferences.lintEnabled) {
      // Delay this one, as initialization is very heavy
      setTimeout(() => {
        this.setupLintWorker();
      }, 5000);
    }

    if (this.props.preferences.autoDownloadTypes) {
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
        inlineClassName: classification.kind,
      },
    }));

    const modelInfo = await this.getModelById(this.props.id);

    modelInfo.decorations = this.editor.deltaDecorations(
      modelInfo.decorations || [],
      decorations
    );
  };

  updateLintWarnings = async (markers: Array<Object>) => {
    const mode = await this.getMode(this.props.title);
    if (mode === 'javascript') {
      this.monaco.editor.setModelMarkers(
        this.editor.getModel(),
        'eslint',
        markers
      );
    }
  };

  disposeModel = (id: string) => {
    if (modelCache[id]) {
      try {
        if (modelCache[id].model) {
          modelCache[id].model.dispose();
        }
        if (modelCache[id].lib) {
          modelCache[id].lib.dispose();
        }

        delete modelCache[id];
      } catch (e) {
        console.error(e);
      }
    }
  };

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    if (nextState.fuzzySearchEnabled !== this.state.fuzzySearchEnabled) {
      return true;
    }

    // Don't update with sandbox id, this will duplicate all modules otherwise
    if (
      nextProps.sandboxId === this.props.sandboxId &&
      nextProps.modules !== this.props.modules
    ) {
      // First check for path updates;
      nextProps.modules.forEach(module => {
        if (modelCache[module.id] && modelCache[module.id].model) {
          const { modules, directories } = nextProps;
          const path = getModulePath(modules, directories, module.id);

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

            this.createModel(
              module,
              nextProps.modules,
              nextProps.directories
            ).then(newModel => {
              if (isCurrentlyOpened) {
                // Open it again if it was open
                this.editor.setModel(newModel);
              }
            });
          }
        }
      });

      // Also check for deleted modules
      Object.keys(modelCache).forEach(moduleId => {
        // This module got deleted, dispose it
        if (!nextProps.modules.find(m => m.id === moduleId)) {
          this.disposeModel(moduleId);
        }
      });
    }

    const { preferences } = this.props;
    const { preferences: nextPref } = nextProps;

    if (
      preferences.fontFamily !== nextPref.fontFamily ||
      preferences.fontSize !== nextPref.fontSize ||
      preferences.lineHeight !== nextPref.lineHeight
    ) {
      this.editor.updateOptions(this.getEditorOptions(nextProps));
    }

    const { dependencies } = this.props;
    const { dependencies: nextDependencies } = nextProps;

    // Fetch new dependencies if added
    if (
      nextDependencies != null &&
      dependencies != null &&
      Object.keys(dependencies).join('') !==
        Object.keys(nextDependencies).join('')
    ) {
      this.fetchDependencyTypings(nextDependencies);
    }

    if (
      this.editor &&
      this.getCode() !== nextProps.code &&
      this.props.code !== nextProps.code &&
      this.props.id === nextProps.id
    ) {
      this.updateCode(nextProps.code);
    }

    return (
      nextProps.sandboxId !== this.props.sandboxId ||
      nextProps.id !== this.props.id ||
      nextProps.errors !== this.props.errors ||
      nextProps.corrections !== this.props.corrections ||
      this.props.preferences !== nextProps.preferences
    );
  }

  swapDocuments = async ({
    currentId,
    nextId,
    nextTitle,
  }: {
    currentId: string,
    nextId: string,
    nextCode: ?string,
    nextTitle: string,
  }) => {
    if (nextId !== currentId && this.editor) {
      const pos = this.editor.getPosition();
      if (modelCache[currentId]) {
        const currentModule = this.props.modules.find(m => m.id === currentId);
        const path = getModulePath(
          this.props.modules,
          this.props.directories,
          currentId
        );

        modelCache[currentId].cursorPos = pos;
        if (modelCache[currentId].lib) {
          // We let Monaco know what the latest code is of this file by removing
          // the old extraLib definition and defining a new one.
          modelCache[currentId].lib.dispose();
          modelCache[
            currentId
          ].lib = this.monaco.languages.typescript.typescriptDefaults.addExtraLib(
            currentModule.code,
            `file://${path}`
          );
        }
      }

      await this.openNewModel(nextId, nextTitle);
      this.editor.focus();
    }
  };

  componentWillUpdate(nextProps: Props) {
    const { id: currentId, sandboxId: currentSandboxId } = this.props;

    const {
      id: nextId,
      code: nextCode,
      errors: nextErrors,
      corrections: nextCorrections,
      title: nextTitle,
      sandboxId: nextSandboxId,
    } = nextProps;

    if (nextSandboxId !== currentSandboxId) {
      // Reset models, dispose old ones
      this.disposeModules(this.props.modules);

      // Do in setTimeout, since disposeModules is async
      setTimeout(() => {
        // Initialize new models
        this.initializeModules(nextProps.modules).then(() => {
          this.openNewModel(nextId, nextTitle);
        });
      });
    } else {
      this.swapDocuments({
        currentId,
        nextId,
        nextCode,
        nextTitle,
      }).then(() => {
        handleError(this.monaco, this.editor, nextErrors, nextCorrections);
      });
    }
  }

  updateCode(code: string = '') {
    if (!this.editor || !this.editor.getModel()) {
      return;
    }

    const pos = this.editor.getPosition();
    const lines = this.editor.getModel().getLinesContent();
    const lastLine = lines.length;
    const lastLineColumn = lines[lines.length - 1].length;
    const editOperation = {
      identifier: {
        major: 1,
        minor: 1,
      },
      text: code,
      range: new this.monaco.Range(0, 0, lastLine + 1, lastLineColumn),
      forceMoveMarkers: false,
    };

    this.editor.getModel().pushEditOperations([], [editOperation], null);
    this.editor.setPosition(pos);
  }

  getMode = async (title: string) => {
    if (title == null) return 'javascript';

    const kind = title.match(/\.([^.]*)$/);

    if (kind) {
      if (kind[1] === 'css') return 'css';
      if (kind[1] === 'scss') return 'scss';
      if (kind[1] === 'json') return 'json';
      if (kind[1] === 'html') return 'html';
      if (kind[1] === 'vue') {
        if (!this.monaco.languages.getLanguages().find(l => l.id === 'vue')) {
          await requireAMDModule(['vs/language/vue/monaco.contribution']);
        }
        return 'vue';
      }
      if (kind[1] === 'less') return 'less';
      if (kind[1] === 'md') return 'markdown';
      if (/jsx?$/.test(kind[1])) return 'javascript';
      if (/tsx?$/.test(kind[1])) return 'typescript';
    }

    return 'typescript';
  };

  syntaxHighlight = async (code: string, title: string, version: string) => {
    const mode = await this.getMode(title);
    if (mode === 'typescript' || mode === 'javascript') {
      this.syntaxWorker.postMessage({
        code,
        title,
        version,
      });
    }
  };

  lint = async (code: string, title: string, version: string) => {
    const mode = await this.getMode(title);
    if (mode === 'javascript') {
      if (this.lintWorker) {
        this.lintWorker.postMessage({
          code,
          title,
          version,
        });
      }
    }
  };

  handleChange = () => {
    const newCode = this.editor.getModel().getValue();
    this.props.changeCode(this.props.id, newCode);

    this.syntaxHighlight(
      newCode,
      this.props.title,
      this.editor.getModel().getVersionId()
    );
    this.lint(newCode, this.props.title, this.editor.getModel().getVersionId());
  };

  editorWillMount = monaco => {
    monaco.editor.defineTheme('CodeSandbox', {
      base: 'vs-dark', // can also be vs-dark or hc-black
      inherit: true, // can also be false to completely replace the builtin rules
      rules: [
        { token: 'comment', foreground: '626466' },
        { token: 'keyword', foreground: '6CAEDD' },
        { token: 'identifier', foreground: 'fac863' },
      ],
    });
  };

  hasNativeTypescript = () => {
    const template = getTemplate(this.props.template);
    return template.sourceConfig && template.sourceConfig.typescript;
  };

  configureEditor = async (editor, monaco) => {
    this.editor = editor;
    this.monaco = monaco;

    // eslint-disable-next-line no-underscore-dangle
    window._cs = {
      editor: this.editor,
      monaco: this.monaco,
    };

    requestAnimationFrame(() => {
      this.setupWorkers();
    });

    const hasNativeTypescript = this.hasNativeTypescript();

    const compilerDefaults = {
      jsxFactory: 'React.createElement',
      reactNamespace: 'React',
      jsx: monaco.languages.typescript.JsxEmit.React,
      target: monaco.languages.typescript.ScriptTarget.ES2016,
      allowNonTsExtensions: !hasNativeTypescript,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: hasNativeTypescript
        ? monaco.languages.typescript.ModuleKind.ES2015
        : monaco.languages.typescript.ModuleKind.System,
      experimentalDecorators: true,
      noEmit: true,
      allowJs: true,
      typeRoots: ['node_modules/@types'],

      forceConsistentCasingInFileNames: hasNativeTypescript,
      noImplicitReturns: hasNativeTypescript,
      noImplicitThis: hasNativeTypescript,
      noImplicitAny: hasNativeTypescript,
      strictNullChecks: hasNativeTypescript,
      suppressImplicitAnyIndexErrors: hasNativeTypescript,
      noUnusedLocals: hasNativeTypescript,
    };

    monaco.languages.typescript.typescriptDefaults.setMaximunWorkerIdleTime(-1);
    monaco.languages.typescript.javascriptDefaults.setMaximunWorkerIdleTime(-1);
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions(
      compilerDefaults
    );
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions(
      compilerDefaults
    );

    monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);
    monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);

    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: !hasNativeTypescript,
    });

    await this.initializeModules();
    await this.openNewModel(this.props.id, this.props.title);

    this.addKeyCommands();
    import(/* webpackChunkName: 'monaco-emmet' */ './monaco/enable-emmet').then(
      enableEmmet => {
        enableEmmet.default(editor, monaco, {});
      }
    );

    window.addEventListener('resize', this.resizeEditor);
    this.sizeProbeInterval = setInterval(this.resizeEditor.bind(this), 3000);

    if (this.props.dependencies) {
      setTimeout(() => {
        this.fetchDependencyTypings(this.props.dependencies, monaco);
      }, 5000);
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
        this.setState({
          fuzzySearchEnabled: true,
        });
      },
    });

    editor.onDidChangeModelContent(() => {
      this.handleChange();
    });
  };

  closeFuzzySearch = () => {
    this.setState({ fuzzySearchEnabled: false });
    this.editor.focus();
  };

  fetchDependencyTypings = (dependencies: Object) => {
    if (this.typingsFetcherWorker) {
      this.typingsFetcherWorker.postMessage({ dependencies });
    }
  };

  addKeyCommands = () => {
    this.editor.addCommand(
      this.monaco.KeyMod.CtrlCmd | this.monaco.KeyCode.KEY_S, // eslint-disable-line no-bitwise
      () => {
        this.handleSaveCode();
      }
    );
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

  initializeModules = (modules: Array<Module> = this.props.modules) =>
    Promise.all(modules.map(module => this.createModel(module, modules)));

  resizeEditor = () => {
    this.editor.layout();
  };

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeEditor);
    this.disposeModules(this.props.modules);
    if (this.editor) {
      this.editor.dispose();
    }
    if (this.syntaxWorker) {
      this.syntaxWorker.terminate();
    }
    if (this.lintWorker) {
      this.lintWorker.terminate();
    }
    if (this.typingsFetcherWorker) {
      this.typingsFetcherWorker.terminate();
    }
    clearTimeout(this.sizeProbeInterval);
  }

  createModel = async (
    module: Module,
    modules: Array<Module> = this.props.modules,
    directories: Array<Directory> = this.props.directories
  ) => {
    // Remove the first slash, as this will otherwise create errors in monaco
    const path = getModulePath(modules, directories, module.id);

    // We need to add this as a lib specifically to Monaco, because Monaco
    // tends to lose type definitions if you don't touch a file for a while.
    // Related issue: https://github.com/Microsoft/monaco-editor/issues/461
    const lib = this.monaco.languages.typescript.typescriptDefaults.addExtraLib(
      module.code,
      `file://${path}`
    );

    const mode = await this.getMode(module.title);
    const model = this.monaco.editor.createModel(
      module.code,
      mode === 'javascript' ? 'typescript' : mode,
      new this.monaco.Uri().with({ path, scheme: 'file' })
    );

    model.updateOptions({ tabSize: this.props.preferences.tabSize });

    modelCache[module.id] = modelCache[module.id] || {
      model: null,
      decorations: [],
      cursorPos: null,
    };
    modelCache[module.id].model = model;
    modelCache[module.id].lib = lib;

    return model;
  };

  getModelById = async (id: string) => {
    const { modules } = this.props;
    if (!modelCache[id]) {
      const module = modules.find(m => m.id === id);

      await this.createModel(module);
    }

    return modelCache[id];
  };

  openNewModel = async (id: string, title: string) => {
    const modelInfo = await this.getModelById(id);
    this.editor.setModel(modelInfo.model);

    if (modelInfo.cursorPos) {
      this.editor.setPosition(modelInfo.cursorPos);
    }

    requestAnimationFrame(() => {
      this.syntaxHighlight(
        modelInfo.model.getValue(),
        title,
        modelInfo.model.getVersionId()
      );
      this.lint(
        modelInfo.model.getValue(),
        title,
        modelInfo.model.getVersionId()
      );
    });
  };

  setCurrentModule = moduleId => {
    this.closeFuzzySearch();
    if (this.props.setCurrentModule) {
      this.props.setCurrentModule(this.props.sandboxId, moduleId);
    }
  };

  openReference = data => {
    const foundModuleId = Object.keys(modelCache).find(
      mId => modelCache[mId].model.uri.path === data.resource.path
    );

    if (foundModuleId) {
      this.setCurrentModule(foundModuleId);
    }

    const selection = data.options.selection;
    if (selection) {
      if (
        typeof selection.endLineNumber === 'number' &&
        typeof selection.endColumn === 'number'
      ) {
        this.editor.setSelection(selection);
        this.editor.revealRangeInCenter(selection);
      } else {
        const pos = {
          lineNumber: selection.startLineNumber,
          column: selection.startColumn,
        };
        this.editor.setPosition(pos);
        this.editor.revealPositionInCenter(pos);
      }
    }

    return Promise.resolve(this.editor);
  };

  getCode = () => this.editor.getValue();

  handleSaveCode = async () => {
    const { saveCode } = this.props;

    const { id } = this.props;
    this.props.changeCode(id, this.getCode());
    saveCode();
  };

  getEditorOptions = (props: Props) => {
    const { preferences, title } = props;
    return {
      selectOnLineNumbers: true,
      fontSize: preferences.fontSize,
      fontFamily: fontFamilies(
        preferences.fontFamily,
        'Source Code Pro',
        'monospace'
      ),
      fontLigatures: true,
      minimap: {
        enabled: false,
      },
      ariaLabel: title,
      formatOnPaste: true,
      lineHeight: (preferences.lineHeight || 1.15) * preferences.fontSize,
    };
  };

  render() {
    const { modules, directories, hideNavigation } = this.props;

    const options = this.getEditorOptions(this.props);

    return (
      <Container>
        <CodeContainer hideNavigation={hideNavigation}>
          {this.state.fuzzySearchEnabled && (
            <FuzzySearch
              closeFuzzySearch={this.closeFuzzySearch}
              setCurrentModule={this.setCurrentModule}
              modules={modules}
              directories={directories}
              currentModuleId={this.props.id}
            />
          )}
          <MonacoEditor
            width="100%"
            height="100%"
            theme="CodeSandbox"
            options={options}
            editorDidMount={this.configureEditor}
            editorWillMount={this.editorWillMount}
            openReference={this.openReference}
          />
        </CodeContainer>
      </Container>
    );
  }
}
