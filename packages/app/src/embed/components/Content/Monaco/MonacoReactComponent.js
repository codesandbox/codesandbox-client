import React from 'react';
import FontFaceObserver from 'fontfaceobserver';

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

    // eslint-disable-next-line global-require
    require('app/overmind/effects/vscode/vscode-script-loader').default(false, [
      'vs/editor/editor.main',
    ])(() => {
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

      if (firstFont === 'MonoLisa') {
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
      }

      this.editor = context.monaco.editor[
        diffEditor ? 'createDiffEditor' : 'create'
      ](this.containerElement, appliedOptions);
      if (theme) {
        context.monaco.editor.setTheme(theme);
      }

      // After initializing monaco editor
      this.editorDidMount(this.editor, context.monaco);
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
    const fixedWidth = width.toString().includes('%') ? width : `${width}px`;
    const fixedHeight = height.toString().includes('%')
      ? height
      : `${height}px`;
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
