import React from 'react';
import FontFaceObserver from 'fontfaceobserver';

import controller from 'app/controller';
import './icon-theme.css';
import './workbench-theme.css';

function noop() {}

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
    const context = this.props.context || window;

    if (context.monaco !== undefined) {
      this.initMonaco();
      return;
    }

    context.require.config({
      url: '/public/13/vs/loader.js',
      paths: {
        vs: '/public/13/vs',
      },
    });

    // Load monaco
    context.require(['vs/editor/editor.main'], () => {
      this.initMonaco();
    });
  };

  initMonaco = () => {
    const { theme, options, diffEditor = false } = this.props;
    const context = this.props.context || window;
    if (this.containerElement && typeof context.monaco !== 'undefined') {
      // Before initializing monaco editor
      this.editorWillMount(context.monaco);

      window.monacoCodeSandbox = {
        openModel: model => this.props.openReference(model),
      };

      const appliedOptions = { ...options };

      const fonts = appliedOptions.fontFamily.split(',').map(x => x.trim());
      // We first just set the default fonts for the editor. When the custom font has loaded
      // we set that one so that Monaco doesn't get confused.
      // https://github.com/Microsoft/monaco-editor/issues/392
      let firstFont = fonts[0];
      if (firstFont.startsWith('"')) {
        // Font is eg. '"aaaa"'
        firstFont = JSON.parse(firstFont);
      }
      const font = new FontFaceObserver(firstFont);

      font.load().then(
        () => {
          if (this.editor && this.props.getEditorOptions) {
            this.editor.updateOptions(this.props.getEditorOptions());
          }
        },
        () => {
          // Font was not loaded in 3s, do nothing
        }
      );

      appliedOptions.fontFamily = fonts.slice(1).join(', ');
      const r = context.require;

      const [
        { CodeSandboxCommandService },
        { CodeSandboxHashService },
        { CodeSandboxKeybindingService },
        { CodeSandboxWindowsService },
        { QuickOpenController },
        { EditorPart },
        { CodeSandboxWorkbench },
        { CodeSandboxEnvironmentService },
        { EditorService },
        { UntitledEditorService },
        { CodeSandboxFileService },
        { StorageService },
        { HistoryService },
        { NullLifecycleService },
        { TextFileService },
        { WindowService },
        { CodeSandboxBackupService },
        { ExtensionService },
        { ExtensionEnablementService },
        { ExtensionManagementService },
        { CodeSandboxExtensionGalleryService },
        { FileDecorationsService },
        { PreferencesService },
        { JSONEditingService },
        { CodeSandboxWorkspacesService },
        { CodeSandboxSearchService },
        { ViewletService },
        { TextModelResolverService },
        { CodeSandboxService },
        { CodeSandboxBroadcastService },
        { CodeSandboxCrashReporterService },
        { BreadcrumbsService },
        { ProgressService2 },
        { CodeSandboxActivityService },
        { CodeSandboxOutputService },
        { CodeSandboxPanelService },
        { QuickInputService },
        { HeapService },
      ] = [
        r('vs/codesandbox/commandService'),
        r('vs/codesandbox/hashService'),
        r('vs/codesandbox/keybindingService'),
        r('vs/codesandbox/windowsService'),
        r('vs/workbench/browser/parts/quickopen/quickOpenController'),
        r('vs/codesandbox/editorGroupsService'),
        r('vs/codesandbox/workbench'),
        r('vs/codesandbox/environmentService'),
        // r('vs/codesandbox/editorService'),
        r('vs/workbench/services/editor/browser/editorService'),
        r('vs/workbench/services/untitled/common/untitledEditorService'),
        r('vs/codesandbox/fileService'),
        r('vs/platform/storage/common/storageService'),
        r('vs/workbench/services/history/electron-browser/history'),
        r('vs/platform/lifecycle/common/lifecycle'),
        r('vs/workbench/services/textfile/electron-browser/textFileService'),
        r('vs/platform/windows/electron-browser/windowService'),
        r('vs/codesandbox/backupFileService'),
        r('vs/workbench/services/extensions/electron-browser/extensionService'),
        r('vs/platform/extensionManagement/common/extensionEnablementService'),
        r('vs/platform/extensionManagement/node/extensionManagementService'),
        r('vs/codesandbox/extensionGalleryService'),
        r('vs/workbench/services/decorations/browser/decorationsService'),
        r('vs/workbench/services/preferences/browser/preferencesService'),
        r('vs/workbench/services/configuration/node/jsonEditingService'),
        r('vs/codesandbox/workspacesService'),
        r('vs/codesandbox/searchService'),
        r('vs/workbench/services/viewlet/browser/viewletService'),
        r(
          'vs/workbench/services/textmodelResolver/common/textModelResolverService'
        ),
        r('vs/codesandbox/services/codesandbox/browser/codesandboxService'),
        r('vs/codesandbox/broadcastService'),
        r('vs/codesandbox/crashReporterService'),
        r('vs/workbench/browser/parts/editor/breadcrumbs'),
        r('vs/workbench/services/progress/browser/progressService2'),
        r('vs/codesandbox/activityService'),
        r('vs/codesandbox/outputService'),
        r('vs/codesandbox/panelService'),
        r('vs/workbench/browser/parts/quickinput/quickInput'),
        r('vs/workbench/api/electron-browser/mainThreadHeapService'),
      ];

      this.editor = context.monaco.editor[
        diffEditor ? 'createDiffEditor' : 'create'
      ](this.containerElement, appliedOptions, {
        backupFileService: i => i.createInstance(CodeSandboxBackupService),
        hashService: i => i.createInstance(CodeSandboxHashService),
        extensionService: i => i.createInstance(ExtensionService),
        extensionEnablementService: i =>
          i.createInstance(ExtensionEnablementService),
        lifecycleService: NullLifecycleService,
        windowsService: i => i.createInstance(CodeSandboxWindowsService),
        quickOpenService: i => i.createInstance(QuickOpenController),
        commandService: i => i.createInstance(CodeSandboxCommandService),
        IFileDecorationsService: i => i.createInstance(FileDecorationsService),
        textFileService: i => i.createInstance(TextFileService),
        fileService: i => i.createInstance(CodeSandboxFileService),
        keybindingService: i =>
          i.createInstance(CodeSandboxKeybindingService, window),
        editorGroupsService: i =>
          i.createInstance(EditorPart, 'codesandbox', false),
        untitledEditorService: i => i.createInstance(UntitledEditorService),
        partService: i => i.createInstance(CodeSandboxWorkbench),
        environmentService: i =>
          i.createInstance(CodeSandboxEnvironmentService),
        storageService: new StorageService(localStorage, localStorage),
        historyService: i => i.createInstance(HistoryService),
        editorService: i => i.createInstance(EditorService),
        windowService: i => i.createInstance(WindowService),
        preferencesService: i => i.createInstance(PreferencesService),
        jsonEditingService: i => i.createInstance(JSONEditingService),
        workspacesService: i => i.createInstance(CodeSandboxWorkspacesService),
        searchService: i => i.createInstance(CodeSandboxSearchService),
        viewletService: i =>
          i.createInstance(ViewletService, {
            onDidViewletOpen: () => true,
            onDidViewletClose: () => true,
          }),
        textModelService: i => i.createInstance(TextModelResolverService),
        codesandboxService: i =>
          i.createInstance(CodeSandboxService, controller),
        extensionGalleryService: i =>
          i.createInstance(CodeSandboxExtensionGalleryService),
        extensionManagementService: i =>
          i.createInstance(ExtensionManagementService),
        broadcastService: new CodeSandboxBroadcastService(1),
        crashReporterService: i =>
          i.createInstance(CodeSandboxCrashReporterService),
        IEditorBreadcrumbsService: i => i.createInstance(BreadcrumbsService),
        progressService2: i => i.createInstance(ProgressService2),
        activityService: i => i.createInstance(CodeSandboxActivityService),
        outputService: i => i.createInstance(CodeSandboxOutputService),
        panelService: i => i.createInstance(CodeSandboxPanelService),
        quickInputService: i => i.createInstance(QuickInputService),
        heapService: i => i.createInstance(HeapService),
      });

      if (theme) {
        context.monaco.editor.setTheme(theme);
      }

      // After initializing monaco editor
      this.editorDidMount(this.editor, context.monaco);

      setTimeout(() => {
        const container = document.createElement('div');
        const part = document.createElement('div');

        container.className = 'vs-dark monaco-workbench mac';
        container.id = 'workbench.main.container';
        part.className = 'part editor';

        container.appendChild(part);

        const editor = document.getElementsByClassName(
          'react-monaco-editor-container'
        )[0];
        editor.parentNode.removeChild(editor);

        const rootEl = document.getElementsByClassName(
          'elements__CodeContainer-ghvvch'
        )[0];
        rootEl.appendChild(container);
        window.EditorPart.create(part);

        setTimeout(() => {
          window.EditorPart.layout({
            width: this.props.width,
            height: this.props.height,
          });
        }, 500);
      }, 500);
    }
  };

  destroyMonaco = () => {
    if (typeof this.editor !== 'undefined') {
      this.editor.dispose();
    }
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
