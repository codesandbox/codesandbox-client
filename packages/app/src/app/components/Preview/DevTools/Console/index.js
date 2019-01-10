import React from 'react';
import { listen, dispatch } from 'codesandbox-api';
import { withTheme } from 'styled-components';
import { debounce } from 'lodash-es';
import update from 'immutability-helper';

import ClearIcon from 'react-icons/lib/md/clear-all';
import { Decode, Console as ConsoleFeed } from 'console-feed';

import Select from 'common/components/Select';
import Input from './Input';

import { Container, Messages, inspectorTheme, FilterInput } from './elements';

export type IMessage = {
  type: 'message' | 'command' | 'return',
  logType: 'log' | 'warn' | 'info' | 'error',
  arguments: any[],
};

class Console extends React.Component {
  state = {
    messages: [],
    scrollToBottom: true,
    initialClear: true,
    filter: [],
    searchKeywords: '',
  };

  listener;

  constructor(props) {
    super(props);

    this.scrollToBottom = debounce(this.scrollToBottom, 1 / 60);
  }

  componentDidMount() {
    this.listener = listen(this.handleMessage);
  }

  componentWillUnmount() {
    if (this.listener) {
      this.listener();
    }
  }

  handleMessage = data => {
    switch (data.type) {
      case 'console': {
        const message = Decode(data.log);
        const { method, data: args } = message;

        switch (method) {
          case 'clear': {
            // If the event was done by the packager
            const hideMessage = args && args[0] === '__internal__';

            this.clearConsole(hideMessage);
            break;
          }
          default: {
            this.addMessage(method, args);
            break;
          }
        }
        break;
      }
      case 'clear-console': {
        if (this.state.initialClear) {
          this.setState({
            initialClear: false,
          });
        } else {
          this.clearConsole();
        }
        break;
      }
      case 'eval-result': {
        const { result, error } = data;

        const decoded = Decode(result);

        if (!error) {
          this.addMessage('result', [decoded]);
        } else {
          this.addMessage('error', [decoded]);
        }
        break;
      }
      case 'test-result': {
        const { result, error } = data;

        const aggregatedResults = Decode(result);
        if (!error) {
          if (aggregatedResults) {
            const { summaryMessage, failedMessages } = aggregatedResults;
            this.addMessage('log', [summaryMessage]);
            failedMessages.forEach(t => {
              this.addMessage('warn', [t]);
            });
          } else {
            this.addMessage('warn', [undefined]);
          }
        } else {
          this.addMessage('error', [error]);
        }
        break;
      }
      case 'search-log': {
        this.setState({ searchKeywords: data.value });
        break;
      }
      case 'filter-log': {
        this.setState({ filter: data.filters });
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

  addMessage(method, data) {
    if (this.props.updateStatus) {
      this.props.updateStatus(this.getType(method));
    }

    this.setState(state =>
      update(state, {
        messages: {
          $push: [
            {
              method,
              data,
            },
          ],
        },
      })
    );
  }

  list;

  componentWillReceiveProps(nextProps) {
    if (nextProps.sandboxId !== this.props.sandboxId) {
      this.clearConsole(true);
    }
  }

  clearConsole = (nothing: boolean) => {
    if (this.props.updateStatus) {
      this.props.updateStatus('clear');
    }

    const messages = nothing
      ? []
      : [
          {
            method: 'log',
            data: [
              '%cConsole was cleared',
              'font-style: italic; color: rgba(255, 255, 255, 0.3)',
            ],
          },
        ];

    this.setState({
      messages,
    });
  };

  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom = () => {
    if (this.list) {
      this.list.scrollTop = this.list.scrollHeight;
    }
  };

  evaluateConsole = (command: string) => {
    this.addMessage('command', [command]);

    // TODO move everything of frames to store and this command too
    dispatch({ type: 'evaluate', command });
  };

  render() {
    if (this.props.hidden) {
      return null;
    }

    const { messages, filter, searchKeywords } = this.state;
    return (
      <Container>
        <Messages
          ref={el => {
            this.list = el;
          }}
        >
          <ConsoleFeed
            logs={messages}
            variant={this.props.theme.light ? 'light' : 'dark'}
            styles={inspectorTheme(this.props.theme)}
            filter={filter}
            searchKeywords={searchKeywords}
          />
        </Messages>
        <Input evaluateConsole={this.evaluateConsole} />
      </Container>
    );
  }
}

const ConsoleFilterInput = ({ style }) => (
  <FilterInput
    placeholder="Filter"
    style={style}
    onChange={({ target: { value } }) =>
      dispatch({ type: 'search-log', value })
    }
  />
);

const ConsoleFilterSelect = props => {
  const handleOnChange = ({ target: { value } }) => {
    if (value === 'all') {
      dispatch({ type: 'filter-log', filters: [] });
    } else {
      const filters = value === 'info' ? ['info', 'log'] : [value];
      dispatch({ type: 'filter-log', filters });
    }
  };

  return (
    <Select
      style={{ ...props.style, borderColor: '#2c2e30' }}
      onChange={handleOnChange}
    >
      <option value="all">All</option>
      <option value="info">Info</option>
      <option value="warn">Warning</option>
      <option value="error">Error</option>
      <option value="debug">Debug</option>
    </Select>
  );
};

export default {
  title: 'Console',
  Content: withTheme(Console),
  actions: [
    {
      title: 'Clear Console',
      onClick: () => {
        dispatch({ type: 'clear-console' });
      },
      Icon: ClearIcon,
    },
    {
      title: 'Search',
      onClick: () => {
        dispatch({ type: 'Search Click' });
      },
      Icon: withTheme(ConsoleFilterInput),
    },
    {
      title: 'Log Filter',
      onClick: () => {},
      Icon: withTheme(ConsoleFilterSelect),
    },
  ],
};
