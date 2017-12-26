import * as React from 'react';
import CodeMirror from 'codemirror';
import { getCodeMirror } from 'app/utils/codemirror';

import 'codemirror/addon/dialog/dialog';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/tern/tern';

import FuzzySearch from '../FuzzySearch';
import { Container, CodeContainer } from './elements';

const documentCache = {};

class CodemirrorEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fuzzySearchEnabled: false,
    };
    this.sandbox = props.sandbox;
    this.currentModule = props.currentModule;
    this.settings = props.settings;
    this.dependencies = props.dependencies;
  }
  shouldComponentUpdate() {
    return false;
  }
  componentWillUnmount() {
    if (this.props.disposeInitializer) {
      this.props.disposeInitializer();
    }
  }

  componentDidMount() {
    this.initializeCodemirror().then(() => {
      this.changeSettings(this.settings);
      this.configureEmmet();

      if (this.props.onInitialized) {
        this.disposeInitializer = this.props.onInitialized(this);
      }
    });
  }

  setErrors = errors => {
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

  setCorrections = () => {};

  changeSandbox = () => {};

  updateModules = () => {};

  changeDependencies = () => {};

  changeSettings = async settings => {
    const defaultKeys = {
      'Cmd-/': cm => {
        cm.listSelections().forEach(() => {
          cm.toggleComment({ lineComment: '//' });
        });
      },
      'Cmd-P': () => {
        this.setState({ fuzzySearchEnabled: true }, () => this.forceUpdate());
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

    this.forceUpdate();
  };

  changeModule = async newModule => {
    this.currentModule = newModule;

    const currentModule = this.currentModule;

    if (!documentCache[currentModule.id]) {
      const mode = await this.getMode(currentModule.title);
      documentCache[currentModule.id] = new CodeMirror.Doc(
        currentModule.code || '',
        mode
      );
    }

    this.codemirror.swapDoc(documentCache[currentModule.id]);

    this.changeCode(currentModule.code || '');
    this.configureEmmet();
  };

  changeCode(code: string = '') {
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
    const { code, id, title } = this.currentModule;

    if (!this.props.onlyViewMode) {
      CodeMirror.commands.save = this.handleSaveCode;
    }

    const mode = await this.getMode(title);

    documentCache[id] = new CodeMirror.Doc(code || '', mode);

    this.codemirror = getCodeMirror(el, documentCache[id]);

    this.codemirror.on('change', this.handleChange);
    this.changeSettings(this.settings);
  };

  handleChange = (cm, change) => {
    if (change.origin !== 'setValue' && this.props.onChange) {
      this.props.onChange(cm.getValue());
    }
  };

  getCode = () => this.codemirror.getValue();

  handleSaveCode = async () => {
    if (this.props.onSave) {
      this.props.onSave(this.codemirror.getValue());
    }
  };

  configureEmmet = async () => {
    const { title } = this.currentModule;
    const mode = await this.getMode(title);

    const newMode = mode === 'htmlmixed' ? 'html' : mode;
    const addon = newMode === 'jsx' ? { jsx: true } : null;

    this.codemirror.setOption('emmet', {
      addons: addon,
      syntax: newMode,
    });
  };

  closeFuzzySearch = () => {
    this.setState({ fuzzySearchEnabled: false }, () => this.forceUpdate());
  };

  setCurrentModule = moduleId => {
    this.closeFuzzySearch();
    this.codemirror.focus();
    if (this.props.onModuleChange) {
      this.props.onModuleChange(moduleId);
    }
  };

  render() {
    const { hideNavigation } = this.props;
    const { settings, sandbox, currentModule } = this;

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

export default CodemirrorEditor;
