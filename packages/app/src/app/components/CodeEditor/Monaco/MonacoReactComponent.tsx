import * as React from 'react';

function noop() {
    return;
}

type Props = {
    editorWillMount: (monacoInstance: any) => void;
    editorDidMount: (editorInstance: any, monacoInstance: any) => void;
    openReference: (model: any) => void;
    context?: any;
    theme: string;
    options: any;
    width: string;
    height: string;
};

class MonacoEditor extends React.PureComponent<Props> {
    static defaultProps = {
        width: '100%',
        height: '100%',
        theme: null,
        options: {},
        editorDidMount: noop,
        editorWillMount: noop,
        onChange: noop,
        template: '',
        requireConfig: {}
    };
    containerElement: HTMLElement;
    editor: any;
    monaco: any;

    componentDidMount() {
        this.afterViewInit();
    }

    componentWillUnmount() {
        this.destroyMonaco();
    }

    editorWillMount = (monaco) => {
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
                vs: '/public/vs'
            }
        });

        // Load monaco
        context.require([ 'vs/editor/editor.main' ], () => {
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
                openEditor: (model) => this.props.openReference(model)
            };
            this.editor = context.monaco.editor.create(this.containerElement, options, { editorService });
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

    assignRef = (component) => {
        this.containerElement = component;
    };

    render() {
        const { width, height } = this.props;
        const fixedWidth = width.toString().indexOf('%') !== -1 ? width : `${width}px`;
        const fixedHeight = height.toString().indexOf('%') !== -1 ? height : `${height}px`;
        const style: React.CSSProperties = {
            width: fixedWidth,
            height: fixedHeight,
            overflow: 'hidden',
            position: 'absolute'
        };

        return <div ref={this.assignRef} style={style} className="react-monaco-editor-container" />;
    }
}

export default MonacoEditor;
