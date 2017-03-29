// @flow
import React from 'react';
import CodeMirror from 'codemirror';
import styled from 'styled-components';

import { getCodeMirror } from 'app/utils/codemirror';

import 'codemirror/addon/dialog/dialog';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/tern/tern';

import type { Preferences } from 'app/store/preferences/reducer';

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
  height: calc(100% - 3rem);
  overflow: auto;
`;

const CodeContainer = styled.div`
  flex: 1 1 auto;
  position: relative;
  overflow: auto;
  height: calc(100% - 6rem);
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
      cm.addLineClass(nextError.line - 1, 'background', 'cm-line-error');
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

  swapDocuments = async (
    {
      currentId,
      nextId,
      nextCode,
      nextTitle,
    }: {
      currentId: string,
      nextId: string,
      nextCode: ?string,
      nextTitle: string,
    }
  ) => {
    if (nextId !== currentId) {
      if (!documentCache[nextId]) {
        const mode = await this.getMode(nextTitle);

        documentCache[nextId] = new CodeMirror.Doc(nextCode || '', mode);
      }
      documentCache[currentId] = this.codemirror.swapDoc(documentCache[nextId]);
    }
  };

  componentWillReceiveProps(nextProps: Props) {
    const cm = this.codemirror;
    const { id: currentId, error: currentError } = this.props;
    const {
      id: nextId,
      code: nextCode,
      error: nextError,
      title: nextTitle,
    } = nextProps;

    if (cm) {
      this.swapDocuments({ currentId, nextId, nextCode, nextTitle });
      handleError(cm, currentError, nextError, nextCode, nextId);
    }
  }

  updateCodeMirrorCode(code: string) {
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

  getMode = async (title: string) => {
    if (title == null) return 'jsx';

    const kind = title.match(/\.([^.]*)$/);

    if (kind) {
      if (kind[1] === 'css') {
        await System.import('codemirror/mode/css/css');
        return 'css';
      }
    }

    return 'jsx';
  };

  getCodeMirror = async (el: Element) => {
    const { code, id } = this.props;
    CodeMirror.commands.save = this.handleSaveCode;
    const mode = await this.getMode();
    documentCache[id] = new CodeMirror.Doc(code || '', mode);

    this.codemirror = getCodeMirror(el, documentCache[id]);

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
    try {
      const prettier = await System.import('prettier');
      const newCode = prettier.format(code);
      this.props.changeCode(id, newCode);
      this.updateCodeMirrorCode(newCode);
    } catch (e) {}
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
