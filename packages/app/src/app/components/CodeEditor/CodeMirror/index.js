// @flow

import 'codemirror/addon/dialog/dialog';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/tern/tern';
import 'codemirror/addon/lint/lint.css';
import 'codemirror/addon/lint/lint';

import { resolveModule } from '@codesandbox/common/lib/sandbox/modules';
import type { Module, ModuleError } from '@codesandbox/common/lib/types';
import { getCodeMirror } from 'app/utils/codemirror';
import CodeMirror from 'codemirror';
import { listen } from 'codesandbox-api';
import * as React from 'react';
import { debounce } from 'lodash-es';
import { withTheme } from 'styled-components';
// eslint-disable-next-line
import LinterWorker from 'worker-loader?publicPath=/&name=monaco-linter.[hash:8].worker.js!app/overmind/effects/vscode/LinterWorker/index';

import FuzzySearch from '../FuzzySearch';
import type { Editor, Props } from '../types';
import { CodeContainer, Container } from './elements';

type State = { fuzzySearchEnabled: boolean };

const documentCache = {};

const highlightLines = (
  cm: typeof CodeMirror,
  highlightedLines: Array<number>
) => {
  highlightedLines.forEach(line => {
    cm.addLineClass(+line - 1, 'background', 'cm-line-highlight');
  });
};

class CodemirrorEditor extends React.Component<Props, State> implements Editor {
  codemirror: typeof CodeMirror;

  codemirrorElement: ?HTMLDivElement;
  server: $PropertyType<CodeMirror, 'TernServer'>;
  sandbox: $PropertyType<Props, 'sandbox'>;
  currentModule: $PropertyType<Props, 'currentModule'>;
  settings: $PropertyType<Props, 'settings'>;
  dependencies: $PropertyType<Props, 'dependencies'>;
  disposeInitializer: ?() => void;

  constructor(props: Props) {
    super(props);
    this.state = {
      fuzzySearchEnabled: false,
    };
    this.sandbox = props.sandbox;
    this.currentModule = props.currentModule;
    this.settings = props.settings;

    this.codeSandboxListener = this.setupCodeSandboxListener();
    this.resizeEditor = debounce(this.resizeEditor, 30);
  }

  setupCodeSandboxListener = () => listen(this.handleMessage);

  handleMessage = action => {
    if (action.action === 'editor.open-module') {
      try {
        const module = resolveModule(
          action.path,
          this.sandbox.modules,
          this.sandbox.directories
        );

        this.setCurrentModule(module.id);
      } catch (e) {
        /* Ignore */
      }
    }
  };

  shouldComponentUpdate(nextProps: Props) {
    if (
      this.props.width !== nextProps.width ||
      this.props.height !== nextProps.height
    ) {
      this.resizeEditor();
      return true;
    }

    if (this.props.theme.vscodeTheme !== nextProps.theme.vscodeTheme) {
      return true;
    }

    return false;
  }

  componentWillUnmount() {
    if (this.disposeInitializer) {
      this.disposeInitializer();
    }
    if (this.codeSandboxListener) {
      this.codeSandboxListener();
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

  resizeEditor() {
    // eslint-disable-next-line no-unused-expressions
    this.codemirror?.refresh();
  }

  setErrors = (errors: Array<ModuleError>) => {
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

  linterWorker: ?Worker;

  validate = (code: string = '', updateLinting: Function) => {
    if (!this.currentModule || !/\.jsx?$/.test(this.currentModule.title)) {
      updateLinting([]);
      return;
    }

    if (code.trim() === '') {
      updateLinting([]);
      return;
    }

    const { linterWorker } = this;
    if (linterWorker) {
      linterWorker.postMessage({
        code,
        title: this.currentModule.title,
        version: code,
      });

      linterWorker.onmessage = (event: MessageEvent) => {
        // $FlowIssue
        const { markers, version } = event.data;

        if (version === code) {
          updateLinting(
            markers.map(error => ({
              message: `eslint: ${error.message}`,
              severity: error.severity === 2 ? 'warning' : 'error',
              from: new CodeMirror.Pos(
                error.startLineNumber - 1,
                error.startColumn - 1
              ),
              to: new CodeMirror.Pos(
                error.endLineNumber - 1,
                error.endColumn - 1
              ),
            }))
          );
        }
      };
    }
  };

  changeSettings = async (settings: $PropertyType<Props, 'settings'>) => {
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

        // TODO: look why one of these values is undefined
        if (
          cm &&
          cm.display &&
          cm.display.input &&
          cm.display.input.textarea &&
          cm.display.input.textarea.value &&
          cm.display.input.textarea.value.slice(-1).match(filter)
        ) {
          cm.showHint({
            hint: this.server.getHint,
            completeSingle: false,
            customKeys: {
              Up: (_cm, handle) => handle.moveFocus(-1),
              Down: (_cm, handle) => handle.moveFocus(1),
              PageUp: (_cm, handle) =>
                handle.moveFocus(-handle.menuSize() + 1, true),
              PageDown: (_cm, handle) =>
                handle.moveFocus(handle.menuSize() - 1, true),
              Home: (_cm, handle) => handle.setFocus(0),
              End: (_cm, handle) => handle.setFocus(handle.length - 1),
              Enter: (_cm, handle) => handle.pick(),
              Tab: (_cm, handle) => handle.pick(),
              // We disable this in vimMode, because we want vim to go from
              // insert mode to normal mode when you press enter. This does that
              ...(settings.vimMode
                ? {}
                : { Esc: (_cm, handle) => handle.close() }),
            },
          });
        }
      }
    };

    if (settings.autoCompleteEnabled) {
      const tern = await import(
        /* webpackChunkName: 'codemirror-tern' */ 'codesandbox-deps/dist/tern'
      );
      window.tern = tern.tern;
      this.server =
        this.server ||
        new CodeMirror.TernServer({
          defs: [tern.ecmascriptJson],
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
      await import(
        /* webpackChunkName: 'codemirror-vim' */ 'codemirror/keymap/vim'
      );
      this.codemirror.setOption('keyMap', 'vim');
    } else {
      this.codemirror.setOption('keyMap', 'sublime');
    }

    if (settings.lintEnabled) {
      if (!this.linterWorker) {
        this.linterWorker = new LinterWorker();

        this.codemirror.setOption('lint', {
          getAnnotations: this.validate,
          async: true,
        });
      }
    } else {
      this.codemirror.setOption('lint', false);
    }

    this.codemirror.setOption('tabSize', this.props.settings.tabWidth);

    this.forceUpdate();
  };

  changeModule = async (newModule: Module) => {
    this.currentModule = newModule;

    const { currentModule } = this;

    if (!documentCache[currentModule.id]) {
      const mode = (await this.getMode(currentModule.title)) || 'typescript';

      documentCache[currentModule.id] = new CodeMirror.Doc(
        currentModule.code || '',
        mode
      );
    }

    this.codemirror.swapDoc(documentCache[currentModule.id]);

    this.changeCode(currentModule.code || '');
    this.configureEmmet();
  };

  changeCode = (code: string = '', moduleId: string) => {
    const pos = this.codemirror.getCursor();
    this.codemirror.setCursor(pos);
    if (
      code !== this.getCode() &&
      (!moduleId || this.currentModule.id === moduleId)
    ) {
      this.codemirror.setValue(code);
    }
  };

  getMode = async (title: string) => {
    if (title == null) return 'jsx';

    const kind = title.match(/\.([^.]*)$/);

    if (kind) {
      if (kind[1] === 'css' || kind[1] === 'scss' || kind[1] === 'less') {
        await import(
          /* webpackChunkName: 'codemirror-css' */ 'codemirror/mode/css/css'
        );
        if (kind[1] === 'less') {
          return 'text/x-less';
        }
        if (kind[1] === 'scss') {
          return 'text/x-scss';
        }
        return 'css';
      }
      if (kind[1] === 'html' || kind[1] === 'vue') {
        await import(
          /* webpackChunkName: 'codemirror-html' */ 'codemirror/mode/htmlmixed/htmlmixed'
        );

        if (kind[1] === 'vue') {
          await Promise.all([
            import(
              /* webpackChunkName: 'codemirror-css' */ 'codemirror/mode/css/css'
            ),
            import(
              /* webpackChunkName: 'codemirror-sass' */ 'codemirror/mode/sass/sass'
            ),
            import(
              /* webpackChunkName: 'codemirror-stylus' */ 'codemirror/mode/stylus/stylus'
            ),
            import(
              /* webpackChunkName: 'codemirror-handlebars' */ 'codemirror/mode/handlebars/handlebars'
            ),
            import(
              /* webpackChunkName: 'codemirror-vue' */ 'codemirror/mode/vue/vue'
            ),
          ]);
          return { name: 'vue' };
        }

        return 'htmlmixed';
      }
      if (kind[1] === 'md') {
        await import(
          /* webpackChunkName: 'codemirror-markdown' */ 'codemirror/mode/markdown/markdown'
        );
        return 'markdown';
      }
      if (kind[1] === 'json') {
        return 'application/json';
      }
      if (kind[1] === 'sass') {
        await import(
          /* webpackChunkName: 'codemirror-sass' */ 'codemirror/mode/sass/sass'
        );
        return 'sass';
      }
      if (kind[1] === 'styl') {
        await import(
          /* webpackChunkName: 'codemirror-stylus' */ 'codemirror/mode/stylus/stylus'
        );
        return 'stylus';
      }
    }

    return 'jsx';
  };

  initializeCodemirror = async () => {
    const el = this.codemirrorElement;
    const { code, id, title } = this.currentModule;

    if (!this.props.onlyViewMode && this.props.settings.vimMode) {
      // We let codemirror handle save when vim mode is enabled, because this allows
      // us to have :w functionality
      CodeMirror.commands.save = this.handleSaveCode;
    }

    const mode = (await this.getMode(title)) || 'typescript';

    documentCache[id] = new CodeMirror.Doc(code || '', mode);

    this.codemirror = getCodeMirror(el, documentCache[id]);

    if (this.props.highlightedLines) {
      highlightLines(this.codemirror, this.props.highlightedLines);
    }

    this.codemirror.on('changes', this.handleChange);
    this.changeSettings(this.settings);
  };

  handleChange = (cm: typeof CodeMirror, change: { origin: string }) => {
    if (change.origin !== 'setValue' && this.props.onChange) {
      this.props.onChange(cm.getValue(), this.currentModule.shortid);
    }
  };

  getCode = () => this.codemirror.getValue();

  handleSaveCode = async () => {
    const { onSave } = this.props;
    if (onSave) {
      onSave(this.codemirror.getValue());
    }
  };

  configureEmmet = async () => {
    const { title } = this.currentModule;
    const mode = (await this.getMode(title)) || 'typescript';

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

  setCurrentModule = (moduleId: string) => {
    this.closeFuzzySearch();
    if (!window.__isTouch) {
      this.codemirror.focus();
    }
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

export default withTheme(CodemirrorEditor);
