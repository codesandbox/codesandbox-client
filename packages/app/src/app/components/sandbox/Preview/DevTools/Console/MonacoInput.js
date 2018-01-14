/* @flow */
import React from 'react';

import styled from 'styled-components';

import ChevronRight from 'react-icons/lib/md/chevron-right';
import theme from 'common/theme';

import MonacoEditor from 'app/components/sandbox/CodeEditor/monaco/MonacoReactComponent';

import { IconContainer } from './styles';

const CONSOLE_INPUT_TOP_PADDING = 6;
const CONSOLE_INPUT_BOTTOM_PADDING = 6;
const CONSOLE_INPUT_PADDING =
  CONSOLE_INPUT_TOP_PADDING + CONSOLE_INPUT_BOTTOM_PADDING;
const CONSOLE_INPUT_LINE_HEIGHT = 20;
const CONSOLE_INPUT_MAX_HEIGHT = 110;

const Container = styled.div`
  flex-shrink: 0;
  position: relative;
  height: ${props => props.height}px;
  min-height: 2rem;
  width: 100%;
  background-color: ${props => props.theme.background.darken(0.3)};
  display: flex;
  align-items: flex-start;

  .monaco-editor-background {
    background-color: ${props => props.theme.background.darken(0.3)};
  }
`;

type Props = {
  evaluateConsole: (command: string) => void,
};

const InputWrapper = styled.div`
  position: relative;
  height: 100%;
  padding-top: ${CONSOLE_INPUT_TOP_PADDING}px;
  padding-bottom: ${CONSOLE_INPUT_BOTTOM_PADDING}px;
  box-sizing: border-box;
  width: 100%;
`;

const monacoOptions = {
  // language: 'javascript',
  wordWrap: 'on',
  overviewRulerLanes: 0,
  glyphMargin: false,
  lineNumbers: 'off',
  folding: false,
  selectOnLineNumbers: false,
  selectionHighlight: false,
  cursorStyle: 'line-thin',
  scrollbar: {
    useShadows: false,
    horizontal: 'hidden',
    verticalScrollbarSize: 9,
  },
  lineDecorationsWidth: 0,
  scrollBeyondLastLine: false,
  renderLineHighlight: 'none',
  minimap: {
    enabled: false,
  },
  contextmenu: false,
  ariaLabel: 'ConsoleInput',
  fontFamily: 'Menlo, monospace',
  fontSize: 13,
};

function noop() {
  return Promise.resolve();
}

class ConsoleInput extends React.PureComponent<Props> {
  sizeProbeInterval: number;

  state = {
    command: '',
    commandHistory: [],
    commandCursor: -1,

    editorHeight: CONSOLE_INPUT_LINE_HEIGHT,
  };

  resizeEditor = () => {
    this.editor.layout();
  };

  editorDidMount = async (editor, monaco) => {
    this.editor = editor;

    editor.onDidChangeModelContent(() => {
      const lineCount = editor.getModel().getLineCount();
      this.setState({
        editorHeight: Math.min(
          CONSOLE_INPUT_MAX_HEIGHT,
          lineCount * CONSOLE_INPUT_LINE_HEIGHT
        ),
      });
      this.resizeEditor();
    });

    editor.onKeyDown(event => {
      const e = event.browserEvent;
      const { evaluateConsole } = this.props;

      if (e.keyCode === 13) {
        // Enter
        if (e.shiftKey) {
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        const command = editor.getModel().getValue();
        evaluateConsole(command);
        editor.setValue('');
        this.setState({
          commandCursor: -1,
          commandHistory: [command, ...this.state.commandHistory],
        });
      } else if (e.keyCode === 38) {
        // Up arrow
        const lineNumber = editor.getPosition().lineNumber;
        if (lineNumber !== 1) {
          return;
        }

        const newCursor = Math.min(
          this.state.commandCursor + 1,
          this.state.commandHistory.length - 1
        );
        editor.setValue(this.state.commandHistory[newCursor] || '');
        this.setState({
          commandCursor: newCursor,
        });
      } else if (e.keyCode === 40) {
        // Down arrow
        const lineNumber = editor.getPosition().lineNumber;
        const lineCount = editor.getModel().getLineCount();
        if (lineNumber !== lineCount) {
          return;
        }

        const newCursor = Math.max(this.state.commandCursor - 1, -1);
        editor.setValue(this.state.commandHistory[newCursor] || '');
        this.setState({
          commandCursor: newCursor,
        });
      }
    });

    window.addEventListener('resize', this.resizeEditor);
    this.sizeProbeInterval = setInterval(this.resizeEditor.bind(this), 3000);
  };

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeEditor);
    clearTimeout(this.sizeProbeInterval);
    if (this.editor) {
      this.editor.dispose();
    }
  }

  render() {
    return (
      <Container height={this.state.editorHeight + 12}>
        <IconContainer style={{ color: theme.secondary() }}>
          <ChevronRight />
        </IconContainer>
        <InputWrapper>
          <MonacoEditor
            width="100%"
            height={`calc(100% - ${CONSOLE_INPUT_PADDING}px)`}
            options={monacoOptions}
            editorDidMount={this.editorDidMount}
            openReference={noop}
          />
        </InputWrapper>
      </Container>
    );
  }
}

export default ConsoleInput;
