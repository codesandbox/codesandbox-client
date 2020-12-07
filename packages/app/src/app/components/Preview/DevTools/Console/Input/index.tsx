/* @flow */
import React from 'react';
import CodeMirror from 'codemirror';
import styled from 'styled-components';

import ChevronRight from 'react-icons/lib/md/chevron-right';
import theme from '@codesandbox/common/lib/theme';

import { getCodeMirror } from 'app/utils/codemirror';

import {
  ARROW_UP,
  ARROW_DOWN,
  ENTER,
} from '@codesandbox/common/lib/utils/keycodes';

import { IconContainer, CodeMirrorContainer } from './elements';

const Container = styled.div`
  flex-shrink: 0;
  position: relative;
  max-height: 100%;
  width: 100%;
  background-color: ${props =>
    props.theme['input.background'] || props.theme.background.darken(0.3)};
  display: flex;

  align-items: flex-start;
`;

type Props = {
  evaluateConsole: (command: string) => void;
};

type State = {
  commandHistory: Array<string>;
  commandCursor: number;
};

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  height: 100%;
  box-sizing: border-box;
  width: 100%;
`;

export class ConsoleInput extends React.PureComponent<Props, State> {
  sizeProbeInterval: number;

  state = {
    commandHistory: [],
    commandCursor: -1,
  };

  editor: any;

  codemirror: CodeMirror.Editor;

  mountCodeMirror = el => {
    this.codemirror = getCodeMirror(el, new CodeMirror.Doc('', 'javascript'), {
      lineNumbers: false,
      foldGutter: false,
      styleActiveLine: false,
    });

    this.codemirror.on(
      'keydown',
      (codemirror: CodeMirror.Editor, e: KeyboardEvent) => {
        const { evaluateConsole } = this.props;
        if (e.keyCode === ENTER) {
          if (e.shiftKey) {
            return;
          }
          e.preventDefault();
          e.stopPropagation();
          const command = this.codemirror.getDoc().getValue();
          evaluateConsole(command);
          this.codemirror.getDoc().setValue('');
          this.setState(state => ({
            commandCursor: -1,
            commandHistory: [command, ...state.commandHistory],
          }));
        } else if (e.keyCode === ARROW_UP) {
          const lineNumber = this.codemirror.getDoc().getCursor().line;
          if (lineNumber !== 0) {
            return;
          }

          this.setState(state => {
            const newCursor = Math.min(
              state.commandCursor + 1,
              state.commandHistory.length - 1
            );
            this.codemirror
              .getDoc()
              .setValue(state.commandHistory[newCursor] || '');

            return { commandCursor: newCursor };
          });
        } else if (e.keyCode === ARROW_DOWN) {
          const lineNumber = this.codemirror.getDoc().getCursor().line;
          const lineCount = this.codemirror.getValue().split('\n').length;
          if (lineNumber !== lineCount) {
            return;
          }

          this.setState(state => {
            const newCursor = Math.max(state.commandCursor - 1, -1);
            this.codemirror
              .getDoc()
              .setValue(state.commandHistory[newCursor] || '');
            return { commandCursor: newCursor };
          });
        }
      }
    );
  };

  render() {
    // TODO: Put the Monaco editor back here. It was removed because I wasn't able to use the Monaco editor separately yet
    // without interfering with VSCode instance. The solution will be to create a separate build for Monaco and
    // load that one, but the question is whether we can make it use different paths (vs/ -> monaco/) so it doesn't
    // collide with VSCode
    return (
      <Container>
        <IconContainer style={{ color: theme.secondary() }}>
          <ChevronRight />
        </IconContainer>
        <InputWrapper>
          <CodeMirrorContainer ref={this.mountCodeMirror} />
        </InputWrapper>
      </Container>
    );
  }
}
