// @flow
import React from 'react';
import CodeMirror from 'codemirror';
import styled, { injectGlobal, keyframes } from 'styled-components';

import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/dialog/dialog.css';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/tern/tern.css';
import 'codemirror/mode/jsx/jsx';
import 'codemirror/keymap/sublime';
import 'codemirror/addon/fold/xml-fold'; // Needed to match JSX
import 'codemirror/addon/edit/matchtags';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/comment/comment';
import 'codemirror/addon/selection/active-line';
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/dialog/dialog';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/tern/tern';

import type { Preferences } from 'app/store/preferences/reducer';

import theme from '../../../../../../../../common/theme';
import Header from './Header';

const documentCache = {};

type Props = {
  code: ?string,
  error: ?Object,
  id: string,
  title: string,
  modulePath: string,
  changeCode: (id: string, code: string) => Object,
  saveCode: () => void,
  canSave: boolean,
  preferences: Preferences,
};

const Container = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: auto;
`;

const CodeContainer = styled.div`
  flex: 1 1 auto;
  position: relative;
  overflow: auto;
  height: 100%;
`;

const handleError = (cm, currentError, nextError, nextCode, nextId) => {
  if (currentError || nextError) {
    if (currentError && nextError && currentError.line === nextError.line) {
      return;
    }

    if (currentError) {
      cm.getValue().split('\n').forEach((_, i) => {
        cm.removeLineClass(i, 'background', 'cm-line-error');
      });
    }

    const code = nextCode || '';
    if (
      nextError &&
      (nextError.moduleId == null || nextError.moduleId === nextId) &&
      nextError.line !== 0 &&
      nextError.line <= code.split('\n').length
    ) {
      cm.addLineClass(nextError.line, 'background', 'cm-line-error');
    }
  }
};

export default class CodeEditor extends React.PureComponent {
  props: Props;

  componentDidMount() {
    window.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        if (event.key === 's' || event.keyCode === 83) {
          this.handleSaveCode();
          event.preventDefault();
          return false;
        }
      }
      return true;
    });
  }

  shouldComponentUpdate(nextProps: Props) {
    return nextProps.id !== this.props.id ||
      nextProps.error !== this.props.error ||
      this.props.canSave !== nextProps.canSave ||
      this.props.preferences !== nextProps.preferences;
  }

  componentWillReceiveProps(nextProps: Props) {
    const cm = this.codemirror;
    const { id: currentId, error: currentError } = this.props;
    const { id: nextId, code: nextCode, error: nextError } = nextProps;
    if (cm) {
      if (nextId !== currentId) {
        if (!documentCache[nextId]) {
          documentCache[nextId] = new CodeMirror.Doc(nextCode || '', 'jsx');
        }
        documentCache[currentId] = cm.swapDoc(documentCache[nextId]);
      }

      handleError(cm, currentError, nextError, nextCode, nextId);
    }
  }

  updateCodeMirrorCode(code) {
    const pos = this.codemirror.getCursor();
    this.codemirror.setValue(code);
    this.codemirror.setCursor(pos);
  }

  componentDidUpdate(prevProps) {
    if (this.codemirror) {
      if (this.props.preferences !== prevProps.preferences) {
        this.setCodeMirrorPreferences();
      }
    }
  }

  getCodeMirror = (el: Element) => {
    const { code, id } = this.props;
    CodeMirror.commands.save = this.handleSaveCode;

    documentCache[id] = new CodeMirror.Doc(code || '', 'jsx');

    this.codemirror = new CodeMirror(el, {
      mode: 'jsx',
      theme: 'oceanic',
      keyMap: 'sublime',
      indentUnit: 2,
      autoCloseBrackets: true,
      matchTags: { bothTags: true },
      foldGutter: true,
      gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
      value: documentCache[id],
      lineNumbers: true,
      lineWrapping: true,
      styleActiveLine: true,
    });

    this.codemirror.on('change', this.handleChange);

    this.setCodeMirrorPreferences();
  };

  setCodeMirrorPreferences = async () => {
    const { preferences } = this.props;

    const defaultKeys = {
      Tab: cm => {
        const spaces = Array(cm.getOption('indentUnit') + 1).join(' ');
        cm.replaceSelection(spaces);
      },
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
        const filter = new RegExp('[\.a-z_$]', 'i');
        if (cm.display.input.textarea.value.slice(-1).match(filter)) {
          cm.showHint({ hint: this.server.getHint, completeSingle: false });
        }
      }
    };

    if (preferences.autoCompleteEnabled) {
      const tern = await System.import('tern');
      const defs = await System.import('tern/defs/ecmascript.json');
      window.tern = tern;
      this.server = this.server ||
        new CodeMirror.TernServer({
          defs: [defs],
        });
      this.codemirror.on('cursorActivity', updateArgHints);
      this.codemirror.on('inputRead', showAutoComplete);
      this.codemirror.setOption('extraKeys', {
        ...defaultKeys,
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
  };

  handleChange = (cm: any, change: any) => {
    if (change.origin !== 'setValue') {
      this.props.changeCode(this.props.id, cm.getValue());
    }
  };

  prettify = async () => {
    const { id, code } = this.props;
    const prettier = await System.import('prettier');
    const newCode = prettier.format(code);
    this.props.changeCode(id, newCode);
    this.updateCodeMirrorCode(newCode);
  };

  handleSaveCode = async () => {
    const { saveCode, preferences } = this.props;
    if (preferences.prettifyOnSaveEnabled) {
      await this.prettify();
    }

    saveCode();
  };

  codemirror: typeof CodeMirror;
  server: typeof CodeMirror.TernServer;

  render() {
    const { error, title, canSave, modulePath } = this.props;

    return (
      <Container>
        <Header
          saveComponent={canSave && this.handleSaveCode}
          prettify={this.prettify}
          title={title}
          path={modulePath}
        />
        <CodeContainer>
          <div style={{ height: '100%' }} ref={this.getCodeMirror} />
        </CodeContainer>
      </Container>
    );
  }
}

const fadeInAnimation = keyframes`
  0%   { background-color: #374140; }
  100% { background-color: #561011; }
`;

injectGlobal`
  .cm-s-oceanic.CodeMirror {
    font-family: 'Source Code Pro', monospace;
    background: ${theme.background2()};
    color: #e0e0e0;
    height: 100%;
    font-size: 14px;
    font-weight: 500;
  }
  .cm-s-oceanic div.CodeMirror-selected { background: #343D46; }
  .cm-s-oceanic .CodeMirror-line::selection, .cm-s-oceanic .CodeMirror-line > span::selection, .cm-s-oceanic .CodeMirror-line > span > span::selection { background: #65737E; }
  .cm-s-oceanic .CodeMirror-line::-moz-selection, .cm-s-oceanic .CodeMirror-line > span::-moz-selection, .cm-s-oceanic .CodeMirror-line > span > span::-moz-selection { background: #65737E; }
  .cm-s-oceanic .CodeMirror-gutters {
    background: ${theme.background2()};
    border-right: 0px;
  }
  .cm-s-oceanic .CodeMirror-guttermarker { color: #ac4142; }
  .cm-s-oceanic .CodeMirror-guttermarker-subtle { color: #505050; }
  .cm-s-oceanic .CodeMirror-linenumber { color: #505050; }
  .cm-s-oceanic .CodeMirror-cursor { border-left: 1px solid #b0b0b0; }

  .cm-s-oceanic span.cm-comment { color: #8f5536; }
  .cm-s-oceanic span.cm-atom { color: #aa759f; }
  .cm-s-oceanic span.cm-number { color: #aa759f; }

  .cm-s-oceanic span.cm-property, .cm-s-oceanic span.cm-attribute { color: #D8DEE9; }
  .cm-s-oceanic span.cm-keyword { color: #C594C5; }
  .cm-s-oceanic span.cm-string { color: #99C794; }

  .cm-s-oceanic span.cm-variable { color: #FAC863; }
  .cm-s-oceanic span.cm-variable-2 { color: #6a9fb5; }
  .cm-s-oceanic span.cm-def { color: #FAC863; }
  .cm-s-oceanic span.cm-bracket { color: #e0e0e0; }
  .cm-s-oceanic span.cm-tag { color: #EC5f67; }
  .cm-s-oceanic span.cm-link { color: #aa759f; }
  .cm-s-oceanic span.cm-error { background: #ac4142; color: #b0b0b0; }

  .cm-s-oceanic .CodeMirror-activeline-background { background: #374140; }
  .cm-s-oceanic .CodeMirror-matchingbracket { text-decoration: underline; color: white !important; }
  .cm-s-oceanic span.CodeMirror-matchingtag { background-color: inherit; }
  .cm-s-oceanic span.cm-tag.CodeMirror-matchingtag { text-decoration: underline; }
  .cm-s-oceanic span.cm-tag.cm-bracket.CodeMirror-matchingtag { text-decoration: none; }

  .cm-s-oceanic div.cm-line-error.CodeMirror-linebackground { animation: ${fadeInAnimation} 0.3s; background-color: #561011; }
`;
