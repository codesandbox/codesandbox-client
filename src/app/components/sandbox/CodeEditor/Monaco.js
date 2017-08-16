/* @flow */
import React from 'react';
import styled from 'styled-components';
import { debounce } from 'lodash';
import type { Preferences, ModuleError, Module, Directory } from 'common/types';
import { getModulePath } from 'app/store/entities/sandboxes/modules/selectors';

import theme from 'common/theme';

import SyntaxHighlightWorker from 'worker-loader!./monaco/workers/syntax-highlighter';
import LinterWorker from 'worker-loader!./monaco/workers/linter';
import TypingsFetcherWorker from 'worker-loader!./monaco/workers/fetch-dependency-typings';

import enableEmmet from './monaco/enable-emmet';
import Header from './Header';
import MonacoEditor from './monaco/MonacoReactComponent';

let modelCache = {};

type Props = {
  code: ?string,
  errors: ?Array<ModuleError>,
  id: string,
  sandboxId: string,
  title: string,
  modulePath: string,
  changeCode: (id: string, code: string) => Object,
  saveCode: () => void,
  canSave: boolean,
  preferences: Preferences,
  onlyViewMode: boolean,
  modules: Array<Module>,
  directories: Array<Directory>,
  dependencies: ?Object,
  setCurrentModule: ?(sandboxId: string, moduleId: string) => void,
};

const Container = styled.div`
  width: 100%;
  height: 100%;
  z-index: 30;
`;

const fontFamilies = (...families) =>
  families
    .filter(Boolean)
    .map(
      family => (family.indexOf(' ') !== -1 ? JSON.stringify(family) : family),
    )
    .join(', ');

const CodeContainer = styled.div`
  position: relative;
  width: 100%;
  height: calc(100% - 6rem);
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

const handleError = (
  monaco,
  editor,
  currentErrors: ?Array<ModuleError>,
  nextErrors: ?Array<ModuleError>,
  nextCode: ?string,
  prevId: string,
  nextId: string,
) => {
  if (!monaco) return;
  if (nextErrors && nextErrors.length > 0) {
    const markers = nextErrors
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

    monaco.editor.setModelMarkers(editor.getModel(), 'error', markers);
  } else {
    monaco.editor.setModelMarkers(editor.getModel(), 'error', []);
  }
};

export default class CodeEditor extends React.PureComponent {
  props: Props;

  syntaxWorker: ServiceWorker;
  lintWorker: ServiceWorker;
  typingsFetcherWorker: ServiceWorker;
  sizeProbeInterval: number;

  setupWorkers = () => {
    this.syntaxWorker = new SyntaxHighlightWorker();
    this.lintWorker = new LinterWorker();
    this.typingsFetcherWorker = new TypingsFetcherWorker();

    this.lint = debounce(this.lint, 400);

    this.syntaxWorker.addEventListener('message', event => {
      const { classifications, version } = event.data;

      requestAnimationFrame(() => {
        if (version === this.editor.getModel().getVersionId()) {
          this.updateDecorations(classifications);
        }
      });
    });

    this.lintWorker.addEventListener('message', event => {
      const { markers, version } = event.data;

      requestAnimationFrame(() => {
        if (version === this.editor.getModel().getVersionId()) {
          this.updateLintWarnings(markers);
        }
      });
    });

    this.typingsFetcherWorker.addEventListener('message', event => {
      const { path, typings } = event.data;

      if (
        !this.monaco.languages.typescript.typescriptDefaults.getExtraLibs()[
          `file:///${path}`
        ]
      ) {
        requestAnimationFrame(() => {
          this.monaco.languages.typescript.typescriptDefaults.addExtraLib(
            typings,
            `file:///${path}`,
          );
        });
      }
    });
  };

  updateDecorations = (classifications: Array<Object>) => {
    const decorations = classifications.map(classification => ({
      range: new this.monaco.Range(
        classification.startLine,
        classification.start,
        classification.endLine,
        classification.end,
      ),
      options: {
        inlineClassName: classification.kind,
      },
    }));

    const modelInfo = this.getModelById(this.props.id);

    modelInfo.decorations = this.editor.deltaDecorations(
      modelInfo.decorations || [],
      decorations,
    );
  };

  updateLintWarnings = (markers: Array<Object>) => {
    this.monaco.editor.setModelMarkers(
      this.editor.getModel(),
      'eslint',
      markers,
    );
  };

  shouldComponentUpdate(nextProps: Props) {
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

            modelCache[module.id].model.dispose();
            delete modelCache[module.id];

            const newModel = this.createModel(
              module,
              nextProps.modules,
              nextProps.directories,
            );

            if (isCurrentlyOpened) {
              // Open it again if it was open
              this.editor.setModel(newModel);
            }
          }
        }
      });

      // Also check for deleted modules
      Object.keys(modelCache).forEach(moduleId => {
        // This module got deleted, dispose it
        if (!nextProps.modules.find(m => m.id === moduleId)) {
          modelCache[moduleId].model.dispose();
          delete modelCache[moduleId];
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
      this.editor.updateOptions(this.getEditorOptions());
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

    return (
      nextProps.sandboxId !== this.props.sandboxId ||
      nextProps.id !== this.props.id ||
      nextProps.errors !== this.props.errors ||
      this.props.canSave !== nextProps.canSave ||
      this.props.preferences !== nextProps.preferences
    );
  }

  swapDocuments = async ({
    currentId,
    nextId,
    nextCode,
    nextTitle,
  }: {
    currentId: string,
    nextId: string,
    nextCode: ?string,
    nextTitle: string,
  }) => {
    if (nextId !== currentId) {
      const pos = this.editor.getPosition();
      if (modelCache[currentId]) {
        modelCache[currentId].cursorPos = pos;
      }
      this.openNewModel(nextId, nextTitle);
    }
  };

  componentWillUpdate(nextProps: Props) {
    const {
      id: currentId,
      sandboxId: currentSandboxId,
      errors: currentErrors,
    } = this.props;

    const {
      id: nextId,
      code: nextCode,
      errors: nextErrors,
      title: nextTitle,
      sandboxId: nextSandboxId,
    } = nextProps;

    if (nextSandboxId !== currentSandboxId) {
      // Reset models, dispose old ones
      this.disposeModules();

      // Do in setTimeout, since disposeModules is async
      setTimeout(() => {
        // Initialize new models
        this.initializeModules(nextProps.modules);
        this.openNewModel(nextId, nextTitle);
      });
    } else {
      this.swapDocuments({
        currentId,
        nextId,
        nextCode,
        nextTitle,
      }).then(() => {
        handleError(
          this.monaco,
          this.editor,
          currentErrors,
          nextErrors,
          nextCode,
          currentId,
          nextId,
        );
      });
    }
  }

  updateCode(code: string = '') {
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

  getMode = (title: string) => {
    if (title == null) return 'typescript';

    const kind = title.match(/\.([^.]*)$/);

    if (kind) {
      if (kind[1] === 'css') {
        return 'css';
      } else if (kind[1] === 'html') {
        return 'html';
      } else if (kind[1] === 'md') {
        return 'markdown';
      }
    }

    return 'typescript';
  };

  syntaxHighlight = (code: string, title: string, version: string) => {
    if (this.getMode(title) === 'typescript') {
      this.syntaxWorker.postMessage({
        code,
        title,
        version,
      });
    }
  };

  lint = (code: string, title: string, version: string) => {
    if (this.getMode(title) === 'typescript') {
      this.lintWorker.postMessage({
        code,
        title,
        version,
      });
    }
  };

  handleChange = (newCode: string) => {
    this.props.changeCode(this.props.id, newCode);

    this.syntaxHighlight(
      newCode,
      this.props.title,
      this.editor.getModel().getVersionId(),
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

  configureEditor = (editor, monaco) => {
    this.editor = editor;
    this.monaco = monaco;

    console.log(this.editor);
    console.log(this.monaco);

    this.setupWorkers();

    const compilerDefaults = {
      jsxFactory: 'React.createElement',
      reactNamespace: 'React',
      jsx: monaco.languages.typescript.JsxEmit.React,
      target: monaco.languages.typescript.ScriptTarget.ES2016,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.System,
      experimentalDecorators: true,
      noEmit: true,
      allowJs: true,
      typeRoots: ['node_modules/@types'],
    };

    monaco.languages.typescript.typescriptDefaults.setMaximunWorkerIdleTime(-1);
    monaco.languages.typescript.javascriptDefaults.setMaximunWorkerIdleTime(-1);
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions(
      compilerDefaults,
    );
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions(
      compilerDefaults,
    );

    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: true,
    });

    this.initializeModules();
    this.openNewModel(this.props.id, this.props.title);

    this.addKeyCommands();
    enableEmmet(editor, monaco, {});

    window.addEventListener('resize', this.resizeEditor);
    this.sizeProbeInterval = setInterval(this.resizeEditor.bind(this), 3000);

    if (this.props.dependencies) {
      this.fetchDependencyTypings(this.props.dependencies, monaco);
    }
  };

  fetchDependencyTypings = (dependencies: Object) => {
    this.typingsFetcherWorker.postMessage({ dependencies });
  };

  addKeyCommands = () => {
    this.editor.addCommand(
      this.monaco.KeyMod.CtrlCmd | this.monaco.KeyCode.KEY_S,
      () => {
        this.handleSaveCode();
      },
    );
  };

  disposeModules = () => {
    this.editor.setModel(null);

    this.monaco.editor.getModels().forEach(model => {
      model.dispose();
    });

    modelCache = {};
  };

  initializeModules = (modules = this.props.modules) => {
    modules.forEach(module => {
      this.createModel(module, modules);
    });
  };

  resizeEditor = () => {
    this.editor.layout();
  };

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeEditor);
    this.disposeModules();
    this.editor.dispose();
    this.syntaxWorker.terminate();
    this.lintWorker.terminate();
    this.typingsFetcherWorker.terminate();
    clearTimeout(this.sizeProbeInterval);
  }

  createModel = (
    module: Module,
    modules: Array<Module> = this.props.modules,
    directories: Array<Directory> = this.props.directories,
  ) => {
    // Remove the first slash, as this will otherwise create errors in monaco
    const path = getModulePath(modules, directories, module.id);

    const model = this.monaco.editor.createModel(
      module.code,
      this.getMode(module.title),
      new this.monaco.Uri().with({ path, scheme: 'file' }),
    );

    model.updateOptions({ tabSize: 2 });

    modelCache[module.id] = modelCache[module.id] || {
      model: null,
      decorations: [],
      cursorPos: null,
    };
    modelCache[module.id].model = model;

    return model;
  };

  getModelById = (id: string) => {
    const { modules } = this.props;
    if (!modelCache[id]) {
      const module = modules.find(m => m.id === id);

      this.createModel(module);
    }

    return modelCache[id];
  };

  openNewModel = (id: string, title: string) => {
    const modelInfo = this.getModelById(id);
    this.editor.setModel(modelInfo.model);

    if (modelInfo.cursorPos) {
      this.editor.setPosition(modelInfo.cursorPos);
    }

    requestAnimationFrame(() => {
      this.syntaxHighlight(
        modelInfo.model.getValue(),
        title,
        modelInfo.model.getVersionId(),
      );
      this.lint(
        modelInfo.model.getValue(),
        title,
        modelInfo.model.getVersionId(),
      );
    });
  };

  openReference = data => {
    const foundModuleId = Object.keys(modelCache).find(
      mId => modelCache[mId].model.uri.path === data.resource.path,
    );

    if (foundModuleId && this.props.setCurrentModule) {
      this.props.setCurrentModule(this.props.sandboxId, foundModuleId);
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

  prettify = async () => {
    const { id, title, preferences } = this.props;
    const code = this.getCode();
    const mode = this.getMode(title);

    if (mode === 'typescript' || mode === 'css') {
      try {
        const prettify = await import('app/utils/codemirror/prettify');
        const newCode = await prettify.default(
          code,
          mode === 'typescript' ? 'jsx' : mode,
          false, // Force false for eslint, since we would otherwise include 2 eslint bundles
          preferences.prettierConfig,
        );

        if (newCode !== code) {
          this.props.changeCode(id, newCode);
          this.updateCode(newCode);
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  handleSaveCode = async () => {
    const { saveCode, preferences } = this.props;
    if (preferences.prettifyOnSaveEnabled) {
      await this.prettify();
    }
    const { id } = this.props;
    this.props.changeCode(id, this.getCode());
    saveCode();
  };

  getEditorOptions = () => {
    const { preferences, title } = this.props;
    return {
      selectOnLineNumbers: true,
      fontSize: preferences.fontSize,
      // Disable this because of a current issue in Windows:
      // https://github.com/Microsoft/monaco-editor/issues/392
      // fontFamily: fontFamilies(
      //   preferences.fontFamily,
      //   'Source Code Pro',
      //   'monospace',
      // ),
      minimap: {
        enabled: false,
      },
      ariaLabel: title,
      formatOnPaste: true,
      lineHeight: (preferences.lineHeight || 1.15) * preferences.fontSize,
    };
  };

  render() {
    const { canSave, onlyViewMode, modulePath } = this.props;

    const options = this.getEditorOptions();

    const requireConfig = {
      url: '/public/vs/loader.js',
      paths: {
        vs: '/public/vs',
      },
    };
    return (
      <Container>
        <Header
          saveComponent={canSave && !onlyViewMode && this.handleSaveCode}
          prettify={!onlyViewMode && this.prettify}
          path={modulePath}
        />
        <CodeContainer>
          <MonacoEditor
            width="100%"
            height="100%"
            language="typescript"
            theme="CodeSandbox"
            options={options}
            requireConfig={requireConfig}
            editorDidMount={this.configureEditor}
            editorWillMount={this.editorWillMount}
            onChange={this.handleChange}
            openReference={this.openReference}
          />
        </CodeContainer>
      </Container>
    );
  }
}
