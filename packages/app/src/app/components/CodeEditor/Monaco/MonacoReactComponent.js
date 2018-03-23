import React from 'react';

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
    if (this.containerElement) {
      this.containerElement.removeEventListener(
        'keydown',
        this.iPadFixListener
      );
    }
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
      url: '/public/vs/loader.js',
      paths: {
        vs: '/public/vs',
      },
    });

    // Load monaco
    context.require(['vs/editor/editor.main'], () => {
      this.initMonaco();
    });
  };

  initMonaco = () => {
    const { theme, options } = this.props;
    const context = this.props.context || window;
    if (this.containerElement && typeof context.monaco !== 'undefined') {
      // Before initializing monaco editor
      this.editorWillMount(context.monaco);
      const editorService = {
        openEditor: model => this.props.openReference(model),
      };
      this.editor = context.monaco.editor.create(
        this.containerElement,
        options,
        { editorService }
      );
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

  /**
   * iPad sends strange key codes instead of key events. We will catch these
   * and send the correct ones to the editor
   */
  iPadFixListener = e => {
    if (this.containerElement && e && e.keyCode === 0 && e.key) {
      switch (e.key) {
        case 'UIKeyInputUpArrow':
          this.containerElement.dispatchEvent(
            new KeyboardEvent('keydown', { key: 'ArrowUp', keyCode: 38 })
          );
          break;
        case 'UIKeyInputDownArrow':
          this.containerElement.dispatchEvent(
            new KeyboardEvent('keydown', { key: 'ArrowDown', keyCode: 40 })
          );
          break;
        case 'UIKeyInputLeftArrow':
          this.containerElement.dispatchEvent(
            new KeyboardEvent('keydown', { key: 'ArrowLeft', keyCode: 37 })
          );
          break;
        case 'UIKeyInputRightArrow':
          this.containerElement.dispatchEvent(
            new KeyboardEvent('keydown', { key: 'ArrowRight', keyCode: 39 })
          );
          break;
        default: {
          break;
        }
      }
    }
  };

  assignRef = component => {
    this.containerElement = component;

    if (this.containerElement) {
      this.containerElement.addEventListener('keydown', this.iPadFixListener);
    }
  };

  render() {
    const { width, height } = this.props;
    const fixedWidth =
      width.toString().indexOf('%') !== -1 ? width : `${width}px`;
    const fixedHeight =
      height.toString().indexOf('%') !== -1 ? height : `${height}px`;
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
