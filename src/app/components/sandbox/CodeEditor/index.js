// @flow
import React from 'react';
import CodeMirror from 'codemirror';
import MonacoEditor from 'react-monaco-editor';
import styled, { keyframes } from 'styled-components';
import type { Preferences, ModuleError, Module, Directory } from 'common/types';

import { getCodeMirror } from 'app/utils/codemirror';
import prettify from 'app/utils/codemirror/prettify';
import theme from 'common/theme';

import 'codemirror/addon/dialog/dialog';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/tern/tern';

import Header from './Header';
import { getModulePath } from '../../../store/entities/sandboxes/modules/selectors';

const documentCache = {};

type Props = {
  code: ?string,
  errors: ?Array<ModuleError>,
  id: string,
  title: string,
  modulePath: string,
  changeCode: (id: string, code: string) => Object,
  saveCode: () => void,
  canSave: boolean,
  preferences: Preferences,
  onlyViewMode: boolean,
  modules: Array<Module>,
  directories: Array<Directory>,
};

const Container = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 30;
`;

const fadeInAnimation = keyframes`
  0%   { background-color: #374140; }
  100% { background-color: #561011; }
`;

const fontFamilies = (...families) =>
  families
    .filter(Boolean)
    .map(
      family => (family.indexOf(' ') !== -1 ? JSON.stringify(family) : family),
    )
    .join(', ');

const CodeContainer = styled.div`
  overflow: auto;
  width: 100%;
  height: calc(100% - 6rem);
  .CodeMirror {
    font-family: ${props =>
      fontFamilies(props.fontFamily, 'Source Code Pro', 'monospace')};
    line-height: ${props => props.lineHeight};
    background: ${theme.background2()};
    color: #e0e0e0;
    height: 100%;
    font-weight: 500;
  }
  div.CodeMirror-selected {
    background: #374140;
  }
  .CodeMirror-line::selection,
  .CodeMirror-line > span::selection,
  .CodeMirror-line > span > span::selection {
    background: #65737e;
  }
  .CodeMirror-line::-moz-selection,
  .CodeMirror-line > span::-moz-selection,
  .CodeMirror-line > span > span::-moz-selection {
    background: #65737e;
  }
  .CodeMirror-gutters {
    background: ${theme.background2()};
    border-right: 0px;
  }
  .CodeMirror-guttermarker {
    color: #ac4142;
  }
  .CodeMirror-guttermarker-subtle {
    color: #505050;
  }
  .CodeMirror-linenumber {
    color: #505050;
  }
  .CodeMirror-cursor {
    border-left: 1px solid #b0b0b0;
  }

  span.cm-comment {
    color: #626466;
  }
  span.cm-atom {
    color: #aa759f;
  }
  span.cm-number {
    color: #aa759f;
  }

  span.cm-property,
  span.cm-attribute {
    color: #aa759f;
  }
  span.cm-keyword {
    color: ${theme.secondary()};
  }
  span.cm-string {
    color: #99c794;
  }

  span.cm-variable {
    color: ${theme.primary.darken(0.1)()};
  }
  span.cm-variable-2 {
    color: ${theme.secondary()};
  }
  span.cm-def {
    color: #fac863;
  }
  span.cm-bracket {
    color: #e0e0e0;
  }
  span.cm-tag {
    color: #ec5f67;
  }
  span.cm-link {
    color: #aa759f;
  }
  span.cm-error {
    background: #ac4142;
    color: #b0b0b0;
  }

  .CodeMirror-activeline-background {
    background: #374140;
  }
  .CodeMirror-matchingbracket {
    text-decoration: underline;
    color: white !important;
  }
  span.CodeMirror-matchingtag {
    background-color: inherit;
  }
  span.cm-tag.CodeMirror-matchingtag {
    text-decoration: underline;
  }
  span.cm-tag.cm-bracket.CodeMirror-matchingtag {
    text-decoration: none;
  }

  div.cm-line-error.CodeMirror-linebackground {
    animation: ${fadeInAnimation} 0.3s;
    background-color: #561011;
  }
  .monaco-editor.vs-dark .monaco-editor-background {
    background: ${theme.background2()};
  }

  .mtk5 {
    color: #99c794 !important;
  }
  .mtk12.Identifier.JsxOpeningElement {
    color: #ec5f67;
  }
  .mtk12.Identifier.JsxExpression.JsxClosingElement {
    color: #ec5f67;
  }
  .mtk12.Identifier.JsxClosingElement {
    color: #ec5f67;
  }
  .mtk12.Identifier.JsxSelfClosingElement {
    color: #ec5f67;
  }
  .mtk12.Identifier.VariableStatement.JsxClosingElement {
    color: #ec5f67;
  }
  .mtk12.Identifier.JsxAttribute.VariableDeclaration {
    color: #aa759f;
  }
  .mtk12.JsxExpression.VariableStatement {
    color: #fac863;
  }
  .mtk12.VariableStatement.JsxClosingElement {
    color: white;
  }
  .mtk12.JsxElement.JsxText {
    color: white;
  }
`;

const handleError = (
  cm: typeof CodeMirror,
  currentErrors: ?Array<ModuleError>,
  nextErrors: ?Array<ModuleError>,
  nextCode: ?string,
  prevId: string,
  nextId: string,
) => {
  if (currentErrors && currentErrors.length > 0) {
    cm.getValue().split('\n').forEach((_, i) => {
      cm.removeLineClass(i, 'background', 'cm-line-error');
    });
  }

  if (nextErrors) {
    nextErrors.forEach(error => {
      const code = nextCode || '';
      if (
        error &&
        (error.moduleId == null || error.moduleId === nextId) &&
        error.line !== 0 &&
        error.line <= code.split('\n').length
      ) {
        cm.addLineClass(error.line - 1, 'background', 'cm-line-error');
      }
    });
  }
};

export default class CodeEditor extends React.PureComponent {
  props: Props;

  shouldComponentUpdate(nextProps: Props) {
    return (
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
    if (nextId !== currentId || nextCode !== this.getCode()) {
      this.openNewModel(nextId);
    }
  };

  componentWillUpdate(nextProps: Props) {
    const { id: currentId, errors: currentErrors } = this.props;
    const {
      id: nextId,
      code: nextCode,
      errors: nextErrors,
      title: nextTitle,
    } = nextProps;

    this.swapDocuments({
      currentId,
      nextId,
      nextCode,
      nextTitle,
    });
  }

  updateCode(code: string = '') {
    const pos = this.editor.getPosition();
    const lines = this.editor.getModel().getLinesContent();
    const lastLine = lines.length;
    const lastLineColumn = lines[lines.length - 1].length;
    const editOperation = {
      identifier: {
        major: 0,
        minor: 0,
      },
      text: code,
      range: new this.monaco.Range(0, 0, lastLine, lastLineColumn),
      forceMoveMarkers: false,
    };

    this.editor.getModel().pushEditOperations([], [editOperation], null);
    this.editor.setPosition(pos);
  }

  updateCodeMirrorCode(code: string = '') {
    const pos = this.codemirror.getCursor();
    this.codemirror.setValue(code);
    this.codemirror.setCursor(pos);
  }

  componentDidUpdate(prevProps: Props) {
    if (this.codemirror) {
      if (this.props.preferences !== prevProps.preferences) {
        this.setCodeMirrorPreferences();
      }

      this.configureEmmet();
    }
  }

  getMode = async (title: string) => {
    if (title == null) return 'jsx';

    const kind = title.match(/\.([^.]*)$/);

    if (kind) {
      if (kind[1] === 'css') {
        await System.import('codemirror/mode/css/css');
        return 'css';
      } else if (kind[1] === 'html') {
        await System.import('codemirror/mode/htmlmixed/htmlmixed');
        return 'htmlmixed';
      } else if (kind[1] === 'md') {
        await System.import('codemirror/mode/markdown/markdown');
        return 'markdown';
      }
    }

    return 'jsx';
  };

  getCodeMirror = async (el: Element) => {
    const { code, id, title, preferences } = this.props;
    if (!this.props.onlyViewMode) {
      CodeMirror.commands.save = this.handleSaveCode;
    }
    const mode = await this.getMode(title);
    documentCache[id] = new CodeMirror.Doc(code || '', mode);

    this.codemirror = getCodeMirror(el, documentCache[id]);

    if (!this.props.onlyViewMode) {
      this.codemirror.on('change', this.handleChange);
      this.setCodeMirrorPreferences();
    } else {
      this.codemirror.setOption('readOnly', true);
    }
  };

  setCodeMirrorPreferences = async () => {
    const { preferences } = this.props;

    const defaultKeys = {
      'Cmd-/': cm => {
        cm.listSelections().forEach(() => {
          cm.toggleComment({ lineComment: '//' });
        });
      },
    };

    const updateArgHints = cm => {
      if (this.server) {
        this.server.updateArgHints(cm);
      }
    };

    const showAutoComplete = cm => {
      if (this.server) {
        const filter = new RegExp('[.a-z_$]', 'i');
        if (
          cm.display.input.textarea.value &&
          cm.display.input.textarea.value.slice(-1).match(filter)
        ) {
          cm.showHint({ hint: this.server.getHint, completeSingle: false });
        }
      }
    };

    if (preferences.autoCompleteEnabled) {
      const tern = await System.import('tern');
      const defs = await System.import('tern/defs/ecmascript.json');
      window.tern = tern;
      this.server =
        this.server ||
        new CodeMirror.TernServer({
          defs: [defs],
        });
      this.codemirror.on('cursorActivity', updateArgHints);
      this.codemirror.on('inputRead', showAutoComplete);
      this.codemirror.setOption('extraKeys', {
        'Ctrl-Space': cm => {
          if (this.server) this.server.complete(cm);
        },
        'Ctrl-I': cm => {
          if (this.server) this.server.showType(cm);
        },
        'Ctrl-O': cm => {
          if (this.server) this.server.showDocs(cm);
        },
        'Alt-.': cm => {
          if (this.server) this.server.jumpToDef(cm);
        },
        'Alt-,': cm => {
          if (this.server) this.server.jumpBack(cm);
        },
        'Ctrl-Q': cm => {
          if (this.server) this.server.rename(cm);
        },
        'Ctrl-.': cm => {
          if (this.server) this.server.selectName(cm);
        },
        Tab: cm => {
          // Indent, or place 2 spaces
          if (cm.somethingSelected()) {
            cm.indentSelection('add');
          } else {
            const spaces = Array(cm.getOption('indentUnit') + 1).join(' ');
            cm.replaceSelection(spaces, 'end', '+input');

            try {
              cm.execCommand('emmetExpandAbbreviation');
            } catch (e) {
              console.error(e);
            }
          }
        },
        Enter: 'emmetInsertLineBreak',
        ...defaultKeys,
      });
    } else {
      this.server = null;
      this.codemirror.off('cursorActivity', updateArgHints);
      this.codemirror.off('inputRead', showAutoComplete);
    }

    if (preferences.vimMode) {
      await System.import('codemirror/keymap/vim');
      this.codemirror.setOption('keyMap', 'vim');
    } else {
      this.codemirror.setOption('keyMap', 'sublime');
    }

    if (preferences.lintEnabled) {
      System.import('app/utils/codemirror/eslint-lint')
        .then(initializer => initializer.default())
        .then(() => {
          this.codemirror.setOption('lint', true);
        });
    } else {
      this.codemirror.setOption('lint', false);
    }
  };

  // handleChange = (cm: any, change: any) => {
  //   if (change.origin !== 'setValue') {
  //     this.props.changeCode(this.props.id, cm.getValue());
  //   }
  // };

  // NEW

  handleChange = (newCode: string) => {
    this.props.changeCode(this.props.id, newCode);
  };

  editorWillMount = monaco => {
    monaco.editor.defineTheme('CodeSandbox', {
      base: 'vs-dark', // can also be vs-dark or hc-black
      inherit: true, // can also be false to completely replace the builtin rules
      rules: [
        { token: 'comment', foreground: '99c794' },
        { token: 'keyword', foreground: '6CAEDD' },
        { token: 'identifier', foreground: 'fac863' },
      ],
    });
  };

  configureEditor = (editor, monaco) => {
    this.editor = editor;
    this.monaco = monaco;

    console.log(editor);
    console.log(monaco);

    const compilerDefaults = {
      jsxFactory: 'React.createElement',
      reactNamespace: 'React',
      jsx: monaco.languages.typescript.JsxEmit.React,
      target: monaco.languages.typescript.ScriptTarget.ES2015,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.System,
      experimentalDecorators: true,
      allowJs: true,
      noEmit: true,
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
      noSemanticValidation: true,
      noSyntaxValidation: true,
    });

    const { modules } = this.props;
    modules.forEach(module => {
      this.createModel(module);
    });

    // extra libraries
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      `export declare function next() : string`,
      'node_modules/@types/external/index.d.ts',
    );

    this.openNewModel(this.props.id);

    setTimeout(() => {
      const classifications = [];
      const source = editor.getModel().getValue();
      const sourceFile = ts.createSourceFile(
        this.props.title,
        source,
        ts.ScriptTarget.ES6,
        true,
      );
      const lines = source.split('\n').map(line => line.length);

      function getLineNumberAndOffset(start) {
        let line = 0;
        let offset = 0;
        while (offset + lines[line] <= start) {
          offset += lines[line] + 1;
          line += 1;
        }

        console.log(line, offset, start, lines[line]);
        return { line: line + 1, offset };
      }

      function addChildNodes(node) {
        ts.forEachChild(node, id => {
          const { offset, line: startLine } = getLineNumberAndOffset(
            id.getStart(),
          );
          const { line: endLine } = getLineNumberAndOffset(id.getEnd());
          classifications.push({
            start: id.getStart() + 1 - offset,
            end: id.getEnd() + 1 - offset,
            kind: ts.SyntaxKind[id.kind],
            node: id,
            startLine,
            endLine,
          });

          addChildNodes(id);
        });
      }

      addChildNodes(sourceFile);

      console.log(classifications);

      const decorations = classifications.map(classification => ({
        range: new monaco.Range(
          classification.startLine,
          classification.start,
          classification.endLine,
          classification.end,
        ),
        options: {
          inlineClassName: classification.kind,
        },
      }));

      console.log(decorations);
      console.log(editor.deltaDecorations([], decorations));
    }, 2000);
  };

  createModel = (module: Module) => {
    const { modules, directories } = this.props;
    const path = '.' + getModulePath(modules, directories, module.id);
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      module.code,
      path,
    );
    const model = monaco.editor.createModel(
      module.code,
      'typescript',
      new monaco.Uri().with({ path }),
    );
    documentCache[module.id] = model;
  };

  openNewModel = (id: string) => {
    const { modules } = this.props;
    if (!documentCache[id]) {
      const module = modules.find(m => m.id === id);

      this.createModel(module);
    }

    this.editor.setModel(documentCache[id]);
  };

  getCode = () => this.editor.getValue();

  // OLD

  prettify = async () => {
    const { id, title, preferences } = this.props;
    const code = this.getCode();
    const mode = await this.getMode(title);
    if (mode === 'jsx' || mode === 'css') {
      try {
        const newCode = await prettify(
          code,
          mode,
          preferences.lintEnabled,
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

  configureEmmet = async () => {
    const { title } = this.props;
    const mode = await this.getMode(title);

    const newMode = mode === 'htmlmixed' ? 'html' : mode;
    const addon = newMode === 'jsx' ? { jsx: true } : null;

    this.codemirror.setOption('emmet', {
      addons: addon,
      syntax: newMode,
    });
  };

  codemirror: typeof CodeMirror;
  server: typeof CodeMirror.TernServer;

  render() {
    const { canSave, code, onlyViewMode, modulePath, preferences } = this.props;

    const options = {
      selectOnLineNumbers: true,
    };

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
        <CodeContainer
          fontFamily={preferences.fontFamily}
          lineHeight={preferences.lineHeight}
        >
          <MonacoEditor
            width="100%"
            height="100%"
            language="javascript"
            theme="CodeSandbox"
            options={{}}
            requireConfig={requireConfig}
            editorDidMount={this.configureEditor}
            editorWillMount={this.editorWillMount}
            onChange={this.handleChange}
          />
        </CodeContainer>
      </Container>
    );
  }
}
