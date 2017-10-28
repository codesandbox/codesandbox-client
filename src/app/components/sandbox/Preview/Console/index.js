// @flow
import React from 'react';
import styled from 'styled-components';

import Message from './Message';
import Input from './Input';

const Container = styled.div`
  background-color: ${props => props.theme.background};
  font-family: Menlo, monospace;
  color: rgba(255, 255, 255, 0.8);
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Messages = styled.div`
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
`;

export type IMessage = {
  type: 'message' | 'command' | 'return',
  logType: 'log' | 'warn' | 'info' | 'error',
  arguments: any[],
};

type Props = {
  bindConsole: (c: any) => void,
  evaluateCommand: (c: string) => void,
};

type State = {
  messages: Array<IMessage>,
};

export default class Console extends React.Component<Props, State> {
  state = {
    messages: [],
    scrollToBottom: true,
  };

  componentDidMount() {
    this.props.bindConsole(this);
  }

  addMessage(
    message: 'log' | 'warn' | 'error',
    args: string[],
    type: 'message' | 'command' | 'return' = 'message'
  ) {
    this.setState({
      messages: [
        ...this.state.messages,
        {
          type,
          logType: message,
          arguments: args,
        },
      ],
    });
  }

  componentDidUpdate() {
    this.list.scrollTop = this.list.scrollHeight;
  }

  evaluateConsole = (command: string) => {
    this.addMessage('log', [command], 'command');

    this.props.evaluateCommand(command);
  };

  render() {
    return (
      <Container>
        <Messages
          innerRef={el => {
            this.list = el;
          }}
        >
          {this.state.messages.map(mes => <Message message={mes} />)}
        </Messages>
        <Input evaluateConsole={this.evaluateConsole} />
      </Container>
    );
  }
}
