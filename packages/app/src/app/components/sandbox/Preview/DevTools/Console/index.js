// @flow
import React from 'react';
import styled from 'styled-components';
import { listen, dispatch } from 'codesandbox-api';

import ClearIcon from 'react-icons/lib/md/clear-all';

import CircularJSON from 'circular-json';
import Message from './Message';
import Input from './Input';

const Container = styled.div`
  background-color: ${props => props.theme.background};
  font-family: Menlo, monospace;
  color: rgba(255, 255, 255, 0.8);
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Messages = styled.div`
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  white-space: pre-wrap;
`;

export type IMessage = {
  type: 'message' | 'command' | 'return',
  logType: 'log' | 'warn' | 'info' | 'error',
  arguments: any[],
};

type Props = {
  evaluateCommand: (c: string) => void,
  updateStatus: (s: 'info' | 'warning' | 'error') => void,
  hidden: boolean,
  sandboxId: string,
};

type State = {
  messages: Array<IMessage>,
};

class Console extends React.Component<Props, State> {
  state = {
    messages: [],
    scrollToBottom: true,
  };

  listener: Function;

  componentDidMount() {
    this.listener = listen(this.handleMessage);
  }

  componentWillUnmount() {
    if (this.listener) {
      this.listener();
    }
  }

  handleMessage = (data: Object) => {
    switch (data.type) {
      case 'console': {
        const { method, args: jsonArgs } = data;
        const args = CircularJSON.parse(jsonArgs);
        this.addMessage(method, args);
        break;
      }
      case 'clear-console': {
        this.clearConsole();
        break;
      }
      case 'eval-result': {
        const { result, error } = data;

        const parsedJson = result ? CircularJSON.parse(result) : result;

        if (!error) {
          if (parsedJson) {
            this.addMessage('log', [parsedJson], 'return');
          } else {
            this.addMessage('log', [undefined], 'return');
          }
        } else {
          this.addMessage('error', [parsedJson]);
        }
        break;
      }
      default: {
        break;
      }
    }
  };

  getType = (message: 'info' | 'log' | 'warn' | 'error') => {
    if (message === 'log' || message === 'info') {
      return 'info';
    }

    if (message === 'warn') {
      return 'warning';
    }

    return 'error';
  };

  addMessage(
    message: 'log' | 'warn' | 'error',
    args: Array<string | typeof undefined>,
    type: 'message' | 'command' | 'return' = 'message'
  ) {
    this.props.updateStatus(this.getType(message));

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

  list: ?HTMLElement;

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.sandboxId !== this.props.sandboxId) {
      this.clearConsole();
    }
  }

  clearConsole = () => {
    this.props.updateStatus('clear');
    this.setState({ messages: [] });
  };

  componentDidUpdate() {
    if (this.list) {
      this.list.scrollTop = this.list.scrollHeight;
    }
  }

  evaluateConsole = (command: string) => {
    this.addMessage('log', [command], 'command');

    this.props.evaluateCommand(command);
  };

  render() {
    if (this.props.hidden) {
      return null;
    }

    return (
      <Container>
        <Messages
          innerRef={el => {
            this.list = el;
          }}
        >
          {/* eslint-disable react/no-array-index-key */}
          {this.state.messages.map((mes, i) => (
            <Message key={i} message={mes} />
          ))}
        </Messages>
        <Input evaluateConsole={this.evaluateConsole} />
      </Container>
    );
  }
}

export default {
  title: 'Console',
  Content: Console,
  actions: [
    {
      title: 'Clear Console',
      onClick: () => {
        dispatch({ type: 'clear-console' });
      },
      Icon: ClearIcon,
    },
  ],
};
