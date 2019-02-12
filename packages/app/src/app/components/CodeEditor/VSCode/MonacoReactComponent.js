import React from 'react';
import FontFaceObserver from 'fontfaceobserver';
import vscode from 'app/vscode';

import './icon-theme.css';
import './workbench-theme.css';

// import { setSocketURL } from 'node-services/lib/net';

function noop() {}

export type EditorAPI = {
  openFile(path: string): any,
  getActiveCodeEditor(): any,
  editorPart: any,
  textFileService: any,
  editorService: any,
};

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
    // setSocketURL(`wss://${this.props.id}.sse.codesandbox.stream/cs-sse-ext`);
    // setSocketURL(`ws://localhost:7070`);

    // eslint-disable-next-line global-require

    this.initMonaco();
  };

  initMonaco = () => {
    const context = this.props.context || window;
    if (this.containerElement && typeof context.monaco !== 'undefined') {
      // Before initializing monaco editor
      this.editorWillMount(context.monaco);

      const r = context.require;

      const [
        { IEditorService },
        { ICodeEditorService },
        { ITextFileService },
        { ILifecycleService },
        { IEditorGroupsService },
        { IStatusbarService },
        { IExtensionService },
        { IContextViewService },
      ] = [
        r('vs/workbench/services/editor/common/editorService'),
        r('vs/editor/browser/services/codeEditorService'),
        r('vs/workbench/services/textfile/common/textfiles'),
        r('vs/platform/lifecycle/common/lifecycle'),
        r('vs/workbench/services/group/common/editorGroupsService'),
        r('vs/platform/statusbar/common/statusbar'),
        r('vs/workbench/services/extensions/common/extensions'),
        r('vs/platform/contextview/browser/contextView'),
      ];

      document.getElementById('root').className += ' monaco-shell vs-dark';

      const container = document.createElement('div');
      const part = document.createElement('div');
      container.appendChild(part);

      const rootEl = document.getElementById('vscode-container');
      rootEl.appendChild(container);

      vscode.initializeEditor(
        container,
        this.props.customEditorAPI,
        services => {
          const editorElement = document.getElementById(
            'workbench.main.container'
          );

          container.className = 'monaco-workbench';
          part.className = 'part editor has-watermark';
          editorElement.className += ' monaco-workbench mac nopanel';

          const EditorPart = services.get(IEditorGroupsService);

          if (editorPart) {
            editorPart.parent = part;
            editorPart = EditorPart;
          } else {
            EditorPart.create(part);
          }

          const statusBarPart = services.get(IStatusbarService);
          statusBarPart.create(
            document.getElementById('workbench.parts.statusbar')
          );

          EditorPart.layout({
            width: this.props.width,
            height: this.props.height,
          });

          const codeEditorService = services.get(ICodeEditorService);
          const textFileService = services.get(ITextFileService);
          const editorService = services.get(IEditorService);
          this.lifecycleService = services.get(ILifecycleService);

          if (this.lifecycleService.phase !== 3) {
            this.lifecycleService.phase = 2; // Restoring
            requestAnimationFrame(() => {
              this.lifecycleService.phase = 3; // Running
            });
          } else {
            // It seems like the VSCode instance has been started before
            const extensionService = services.get(IExtensionService);
            const contextViewService = services.get(IContextViewService);

            // It was killed in the last quit
            extensionService.startExtensionHost();
            contextViewService.setContainer(rootEl);
          }

          const editorApi = {
            openFile(path: string) {
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
            console.log(services);
          }

          this.editor = editorApi;

          // After initializing monaco editor
          this.editorDidMount(editorApi, context.monaco);
        }
      );
    }
  };

  destroyMonaco = () => {
    const groupsToClose = this.editor.editorService.editorGroupService.getGroups();

    Promise.all(groupsToClose.map(g => g.closeAllEditors()))
      .then(() => {
        groupsToClose.forEach(group =>
          this.editor.editorService.editorGroupService.removeGroup(group)
        );
      })
      .then(() => {
        if (this.lifecycleService) {
          console.log('Calling shutdown');
          this.lifecycleService.shutdown();
        }
        // this.editor.editorPart.shutdown();
      });
  };

  assignRef = component => {
    this.containerElement = component;
  };

  render() {
    const { width, height } = this.props;
    const fixedWidth =
      width && width.toString().indexOf('%') !== -1 ? width : `${width}px`;
    const fixedHeight =
      height && height.toString().indexOf('%') !== -1 ? height : `${height}px`;
    const style = {
      width: fixedWidth,
      height: fixedHeight,
      overflow: 'hidden',
      position: 'absolute',
    };

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
