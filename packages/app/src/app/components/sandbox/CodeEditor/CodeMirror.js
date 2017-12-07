// @flow
import * as React from 'react';
import CodeMirror from 'codemirror';
import styled, { keyframes } from 'styled-components';
import type { Preferences, ModuleError } from 'common/types';

import { getCodeMirror } from 'app/utils/codemirror';
import theme from 'common/theme';

import 'codemirror/addon/dialog/dialog';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/tern/tern';

import FuzzySearch from './FuzzySearch';

const documentCache = {};

type Props = {
  code: ?string,
  errors: ?Array<ModuleError>,
  id: string,
  title: string,
  changeCode: (id: string, code: string) => Object,
  saveCode: () => void,
  preferences: Preferences,
  setCurrentModule: ?(sandboxId: string, moduleId: string) => void,
  sandboxId: string,
  modules: Array,
  directories: Array,
  hideNavigation: boolean,
  highlightedLines: ?Array<string>,
  onlyViewMode: ?boolean,
};

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

const handleError = (
  cm: typeof CodeMirror,
  currentErrors: ?Array<ModuleError>,
  nextErrors: ?Array<ModuleError>,
  nextCode: ?string,
  prevId: string,
  nextId: string
) => {
  if (currentErrors && currentErrors.length > 0) {
    cm
      .getValue()
      .split('\n')
      .forEach((_, i) => {
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

const highlightLines = (
  cm: typeof CodeMirror,
  highlightedLines: Array<string>
) => {
  highlightedLines.forEach(line => {
    cm.addLineClass(+line - 1, 'background', 'cm-line-highlight');
  });
};

type State = {
  fuzzySearchEnabled: boolean,
};

export default class CodeEditor extends React.Component<Props, State> {
  state = {
    fuzzySearchEnabled: false,
  };

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    if (nextState.fuzzySearchEnabled !== this.state.fuzzySearchEnabled) {
      return true;
    }

    return (
      nextProps.id !== this.props.id ||
      nextProps.errors !== this.props.errors ||
      nextProps.code !== this.getCode() ||
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
      if (!documentCache[nextId]) {
        const mode = await this.getMode(nextTitle);

        documentCache[nextId] = new CodeMirror.Doc(nextCode || '', mode);
      }
      documentCache[currentId] = this.codemirror.swapDoc(documentCache[nextId]);

      this.updateCodeMirrorCode(nextCode || '');
    }
  };

  componentWillUpdate(nextProps: Props) {
    const cm = this.codemirror;
    const { id: currentId, errors: currentErrors } = this.props;
    const {
      id: nextId,
      code: nextCode,
      errors: nextErrors,
      title: nextTitle,
    } = nextProps;

    if (cm) {
      this.swapDocuments({
        currentId,
        nextId,
        nextCode,
        nextTitle,
      }).then(() => {
        handleError(cm, currentErrors, nextErrors, nextCode, currentId, nextId);
      });
    }
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

  getCodeMirror = async (el: Element) => {
    const { code, id, title, highlightedLines } = this.props;
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

    if (highlightedLines) {
      highlightLines(this.codemirror, highlightedLines);
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

    if (preferences.autoCompleteEnabled) {
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

    if (preferences.vimMode) {
      await System.import(
        /* webpackChunkName: 'codemirror-vim' */ 'codemirror/keymap/vim'
      );
      this.codemirror.setOption('keyMap', 'vim');
    } else {
      this.codemirror.setOption('keyMap', 'sublime');
    }

    if (preferences.lintEnabled) {
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

  handleChange = (cm: any, change: any) => {
    if (change.origin !== 'setValue') {
      this.props.changeCode(this.props.id, cm.getValue());
    }
  };

  getCode = () => this.codemirror.getValue();

  handleSaveCode = async () => {
    const { saveCode } = this.props;
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

  closeFuzzySearch = () => {
    this.setState({ fuzzySearchEnabled: false });
  };

  setCurrentModule = moduleId => {
    this.closeFuzzySearch();
    this.codemirror.focus();
    if (this.props.setCurrentModule) {
      this.props.setCurrentModule(this.props.sandboxId, moduleId);
    }
  };

  codemirror: typeof CodeMirror;
  server: typeof CodeMirror.TernServer;

  render() {
    const {
      preferences,
      modules,
      directories,
      id,
      hideNavigation,
    } = this.props;

    return (
      <Container>
        <CodeContainer
          fontFamily={preferences.fontFamily}
          lineHeight={preferences.lineHeight}
          hideNavigation={hideNavigation}
        >
          {this.state.fuzzySearchEnabled && (
            <FuzzySearch
              closeFuzzySearch={this.closeFuzzySearch}
              setCurrentModule={this.setCurrentModule}
              modules={modules}
              directories={directories}
              currentModuleId={id}
            />
          )}
          <div
            style={{
              height: '100%',
              fontSize: preferences.fontSize || 14,
            }}
            ref={this.getCodeMirror}
          />
        </CodeContainer>
      </Container>
    );
  }
}
