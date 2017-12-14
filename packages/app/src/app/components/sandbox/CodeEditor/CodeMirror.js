// @flow
import { autorun, observe } from 'mobx';
import * as React from 'react';
import { inject, observer } from 'mobx-react';
import CodeMirror from 'codemirror';
import styled, { keyframes } from 'styled-components';

import { getCodeMirror } from 'app/utils/codemirror';
import theme from 'common/theme';

import 'codemirror/addon/dialog/dialog';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/tern/tern';

import FuzzySearch from './FuzzySearch';

const documentCache = {};

const Container = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
`;

const fadeInAnimation = keyframes`
  0%   { background-color: #374140; }
  100% { background-color: #561011; }
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
  overflow: auto;
  width: 100%;
  height: 100%;
  flex: 1 1 auto;
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
    background: rgba(0, 0, 0, 0.2);
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

  div.cm-line-highlight.CodeMirror-linebackground {
    background-color: rgba(0, 0, 0, 0.3);
  }
`;

class CodeEditor extends React.Component {
  state = {
    fuzzySearchEnabled: false,
  };

  componentWillUnmount() {
    this.disposeErrorsHandler();
    this.disposeModuleHandler();
    this.disposeSettingsHandler();
  }

  componentDidMount() {
    this.initializeCodemirror().then(() => {
      this.disposeErrorsHandler = autorun(this.handleErrors);
      this.disposeModuleHandler = observe(
        this.props.store.editor,
        'currentModule',
        this.swapDocuments
      );
      this.disposeSettingsHandler = autorun(this.handleSettings);

      this.handleSettings();
      this.configureEmmet();
    });
  }

  handleErrors = () => {
    const errors = this.props.store.editor.errors;
    const codeLines = this.codemirror.getValue().split('\n');

    codeLines.forEach((_, i) => {
      this.codemirror.removeLineClass(i, 'background', 'cm-line-error');
    });

    errors.forEach(error => {
      if (error.line !== 0 && error.line <= codeLines.length) {
        this.codemirror.addLineClass(
          error.line - 1,
          'background',
          'cm-line-error'
        );
      }
    });
  };

  handleSettings = async () => {
    const settings = this.props.store.editor.preferences.settings;

    const defaultKeys = {
      'Cmd-/': cm => {
        cm.listSelections().forEach(() => {
          cm.toggleComment({ lineComment: '//' });
        });
      },
      'Cmd-P': () => {
        this.setState({ fuzzySearchEnabled: true });
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

    if (settings.autoCompleteEnabled) {
      const tern = await System.import(
        /* webpackChunkName: 'codemirror-tern' */ 'tern'
      );
      const defs = await System.import(
        /* webpackChunkName: 'codemirror-tern-definitions' */ 'tern/defs/ecmascript.json'
      );
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

    if (settings.vimMode) {
      await System.import(
        /* webpackChunkName: 'codemirror-vim' */ 'codemirror/keymap/vim'
      );
      this.codemirror.setOption('keyMap', 'vim');
    } else {
      this.codemirror.setOption('keyMap', 'sublime');
    }

    if (settings.lintEnabled) {
      const initialized = 'eslint' in window;
      System.import(
        /* webpackChunkName: 'codemirror-eslint' */ 'app/utils/codemirror/eslint-lint'
      )
        .then(initializer => !initialized && initializer.default())
        .then(() => {
          this.codemirror.setOption('lint', true);
        });
    } else {
      this.codemirror.setOption('lint', false);
    }
  };

  swapDocuments = async () => {
    const currentModule = this.props.store.editor.currentModule;

    if (!documentCache[currentModule.id]) {
      const mode = await this.getMode(currentModule.title);

      documentCache[currentModule.id] = new CodeMirror.Doc(
        currentModule.code || '',
        mode
      );
    }

    this.codemirror.swapDoc(documentCache[currentModule.id]);

    this.updateCodeMirrorCode(currentModule.code || '');
    this.configureEmmet();
  };

  updateCodeMirrorCode(code: string = '') {
    const pos = this.codemirror.getCursor();
    this.codemirror.setValue(code);
    this.codemirror.setCursor(pos);
  }

  getMode = async (title: string) => {
    if (title == null) return 'jsx';

    const kind = title.match(/\.([^.]*)$/);

    if (kind) {
      if (kind[1] === 'css' || kind[1] === 'scss' || kind[1] === 'less') {
        await System.import(
          /* webpackChunkName: 'codemirror-css' */ 'codemirror/mode/css/css'
        );
        if (kind[1] === 'less') {
          return 'text/x-less';
        }
        if (kind[1] === 'scss') {
          return 'text/x-scss';
        }
        return 'css';
      } else if (kind[1] === 'html' || kind[1] === 'vue') {
        await System.import(
          /* webpackChunkName: 'codemirror-html' */ 'codemirror/mode/htmlmixed/htmlmixed'
        );

        if (kind[1] === 'vue') {
          return 'text/x-vue';
        }

        return 'htmlmixed';
      } else if (kind[1] === 'md') {
        await System.import(
          /* webpackChunkName: 'codemirror-markdown' */ 'codemirror/mode/markdown/markdown'
        );
        return 'markdown';
      } else if (kind[1] === 'json') {
        return 'application/json';
      } else if (kind[1] === 'sass') {
        await System.import(
          /* webpackChunkName: 'codemirror-sass' */ 'codemirror/mode/sass/sass'
        );
        return 'sass';
      } else if (kind[1] === 'styl') {
        await System.import(
          /* webpackChunkName: 'codemirror-sass' */ 'codemirror/mode/stylus/stylus'
        );
        return 'stylus';
      }
    }

    return 'jsx';
  };

  initializeCodemirror = async () => {
    const el = this.codemirrorElement;
    const { code, id, title } = this.props.store.editor.currentModule;

    if (!this.props.onlyViewMode) {
      CodeMirror.commands.save = this.handleSaveCode;
    }

    const mode = await this.getMode(title);

    documentCache[id] = new CodeMirror.Doc(code || '', mode);

    this.codemirror = getCodeMirror(el, documentCache[id]);

    this.codemirror.on('change', this.handleChange);
    this.handleSettings();
  };

  handleChange = (cm, change) => {
    if (change.origin !== 'setValue') {
      this.props.signals.editor.codeChanged({ code: cm.getValue() });
    }
  };

  getCode = () => this.codemirror.getValue();

  handleSaveCode = async () => {
    this.props.signals.editor.codeChanged({ code: this.codemirror.getValue() });
    this.props.signals.editor.codeSaved();
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

  closeFuzzySearch = () => {
    this.setState({ fuzzySearchEnabled: false });
  };

  setCurrentModule = moduleId => {
    this.closeFuzzySearch();
    this.codemirror.focus();
    this.props.signals.editor.moduleSelected({ id: moduleId });
  };

  render() {
    const settings = this.props.store.editor.preferences.settings;
    const sandbox = this.props.store.editor.currentSandbox;
    const currentModule = this.props.store.editor.currentModule;
    const { hideNavigation } = this.props;

    return (
      <Container>
        <CodeContainer
          fontFamily={settings.fontFamily}
          lineHeight={settings.lineHeight}
          hideNavigation={hideNavigation}
        >
          {this.state.fuzzySearchEnabled && (
            <FuzzySearch
              closeFuzzySearch={this.closeFuzzySearch}
              setCurrentModule={this.setCurrentModule}
              modules={sandbox.modules}
              directories={sandbox.directories}
              currentModuleId={currentModule.id}
            />
          )}
          <div
            style={{
              height: '100%',
              fontSize: settings.fontSize || 14,
            }}
            ref={node => {
              this.codemirrorElement = node;
            }}
          />
        </CodeContainer>
      </Container>
    );
  }
}

export default inject('signals', 'store')(observer(CodeEditor));
