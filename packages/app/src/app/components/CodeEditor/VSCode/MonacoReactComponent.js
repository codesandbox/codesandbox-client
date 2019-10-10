import './icon-theme.css';
import './workbench-theme.css';

import { manager } from 'app/overmind/effects/vscode/manager';
import FontFaceObserver from 'fontfaceobserver';
import React from 'react';

// import { setSocketURL } from 'node-services/lib/net';

function noop() {}

const fontPromise = new FontFaceObserver('dm').load().catch(() => {});

let editorPart;

class MonacoEditor extends React.PureComponent {
  constructor(props) {
    super(props);
    this.containerElement = undefined;
  }

  componentDidMount() {
    this.afterViewInit();
  }

  componentWillUnmount() {
    this.destroyMonaco();
  }

  editorWillMount = monaco => {
    const { editorWillMount } = this.props;
    editorWillMount(monaco);
  };

  editorDidMount = (editor, monaco) => {
    this.props.editorDidMount(editor, monaco);
  };

  afterViewInit = () => {
    this.initMonaco();
  };

  initMonaco = () => {
    const context = this.props.context || window;

    if (this.containerElement && typeof context.monaco !== 'undefined') {
      // Before initializing monaco editor
      this.editorWillMount(context.monaco);

      const container = document.createElement('div');
      const part = document.createElement('div');

      part.id = 'vscode-editor';
      part.className = 'part editor has-watermark';

      container.appendChild(part);

      const rootEl = document.getElementById('vscode-container');
      rootEl.appendChild(container);

      manager.initializeEditor(
        container,
        this.props.customEditorAPI,
        services => {
          const editorElement = document.getElementById(
            'workbench.main.container'
          );

          container.className = 'monaco-workbench';

          editorElement.className += ' monaco-workbench mac nopanel';

          const instantiationService = services.get(IInstantiationService);
          instantiationService.invokeFunction(accessor => {
            const EditorPart = accessor.get(IEditorGroupsService);

            if (editorPart) {
              editorPart.parent = part;
              editorPart = EditorPart;
            } else {
              EditorPart.create(part);
            }

            const statusBarPart = accessor.get(IStatusbarService);
            statusBarPart.create(
              document.getElementById('workbench.parts.statusbar')
            );

            EditorPart.layout(this.props.width, this.props.height);

            const codeEditorService = accessor.get(ICodeEditorService);
            const textFileService = accessor.get(ITextFileService);
            const editorService = accessor.get(IEditorService);
            this.lifecycleService = accessor.get(ILifecycleService);
            this.quickopenService = accessor.get(IQuickOpenService);

            if (this.lifecycleService.phase !== 3) {
              this.lifecycleService.phase = 2; // Restoring
              requestAnimationFrame(() => {
                this.lifecycleService.phase = 3; // Running
              });
            } else {
              // It seems like the VSCode instance has been started before
              const extensionService = accessor.get(IExtensionService);
              const contextViewService = accessor.get(IContextViewService);

              // It was killed in the last quit
              extensionService.startExtensionHost();
              contextViewService.setContainer(rootEl);

              // We force this to recreate, otherwise it's bound to an element that's disposed
              this.quickopenService.quickOpenWidget = undefined;
            }

            const editorApi = {
              openFile(path) {
                fontPromise.then(() => {
                  codeEditorService.openCodeEditor({
                    resource: context.monaco.Uri.file('/sandbox' + path),
                  });
                });
              },
              getActiveCodeEditor() {
                return codeEditorService.getActiveCodeEditor();
              },
              textFileService,
              editorPart: EditorPart,
              editorService,
              codeEditorService,
            };
            if (process.env.NODE_ENV === 'development') {
              // eslint-disable-next-line
              console.log(accessor);
            }

            this.editor = editorApi;

            // After initializing monaco editor
            this.editorDidMount(editorApi, context.monaco);
            document.getElementById('root').className += ` monaco-shell`;
          });
        }
      );
    }
  };

  destroyMonaco = () => {
    const groupsToClose = this.editor.editorService.editorGroupService.getGroups();

    document.getElementById('root').className = document
      .getElementById('root')
      .className.split(' ')
      .filter(x => !['monaco-shell', 'vs-dark'].includes(x))
      .join(' ');

    Promise.all(groupsToClose.map(g => g.closeAllEditors()))
      .then(() => {
        groupsToClose.forEach(group =>
          this.editor.editorService.editorGroupService.removeGroup(group)
        );
      })
      .then(() => {
        if (this.quickopenService) {
          // Make sure that the quickopenWidget is gone, it's attached to an old dom node
          if (this.quickopenService.quickOpenWidget) {
            this.quickopenService.quickOpenWidget.dispose();
          }
          this.quickopenService.quickOpenWidget = undefined;
        }
      });
  };

  assignRef = component => {
    this.containerElement = component;
  };

  render() {
    const { width, height } = this.props;
    const fixedWidth =
      width && width.toString().includes('%') ? width : `${width}px`;
    const fixedHeight =
      height && height.toString().includes('%') ? height : `${height}px`;
    const style = {};

    return (
      <div
        ref={this.assignRef}
        style={style}
        className="react-monaco-editor-container"
      />
    );
  }
}

MonacoEditor.defaultProps = {
  width: '100%',
  height: '100%',
  theme: null,
  options: {},
  editorDidMount: noop,
  editorWillMount: noop,
  onChange: noop,
  template: '',
  requireConfig: {},
};

export default MonacoEditor;
