import Select from '@codesandbox/common/lib/components/Select';
import theme from '@codesandbox/common/lib/theme';
import { listen, dispatch } from 'codesandbox-api';
import { Decode, Console as ConsoleFeed } from 'console-feed';
import { debounce } from 'lodash-es';
import React from 'react';
import ClearIcon from 'react-icons/lib/md/block';
import styled, { withTheme } from 'styled-components';

import { DevToolProps } from '..';

import { Container, Messages, inspectorTheme, FilterInput } from './elements';
import { ConsoleInput } from './Input';

type StyledProps = DevToolProps & {
  theme: typeof theme & { light: boolean };
};

const StyledClearIcon = styled(ClearIcon)`
  font-size: 0.8em;
`;

type State = {
  messages: any[];
  filter: Array<'info' | 'log' | 'warn'>;
  searchKeywords: string;
};

/**
 * Max amount of messages that we show in the console
 */
const MAX_MESSAGE_COUNT = 500;

class ConsoleComponent extends React.PureComponent<StyledProps, State> {
  state = {
    messages: [],
    filter: [],
    searchKeywords: '',
  };

  listener;

  constructor(props: StyledProps) {
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
        this.clearConsole();

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

        const aggregatedResults = Decode(result) as any;
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
    if (this.props.updateStatus && this.props.hidden) {
      this.props.updateStatus(this.getType(method));
    }

    this.setState(state => {
      const message = { method, data };
      const messages = [...state.messages];
      messages.push(message);
      messages.slice(Math.max(0, messages.length - MAX_MESSAGE_COUNT));
      return { messages };
    });
  }

  list: HTMLDivElement | undefined;

  UNSAFE_componentWillReceiveProps(nextProps: StyledProps) {
    if (nextProps.sandboxId !== this.props.sandboxId) {
      this.clearConsole(true);
    }
  }

  clearConsole = (nothing?: boolean) => {
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
              `font-style: italic; color: ${
                this.props.theme.vscodeTheme.type === 'light'
                  ? 'rgba(0, 0, 0, 0.3)'
                  : 'rgba(255, 255, 255, 0.3)'
              }`,
            ],
          },
        ];

    this.setState({
      messages,
    });
  };

  componentDidUpdate(prevProps: StyledProps) {
    if (prevProps.hidden && !this.props.hidden) {
      this.props.updateStatus('clear');
    }
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

    let searchKeywordsHasError = false;

    try {
      new RegExp(searchKeywords); // eslint-disable-line
    } catch (e) {
      searchKeywordsHasError = true;
    }

    return (
      <Container>
        {this.props.disableLogging ? (
          <span
            style={{
              fontFamily: 'Inter',
              fontWeight: 600,
              fontSize: '0.875rem',
              height: 22,
              textAlign: 'center',
              paddingTop: 60,
            }}
          >
            In browser logging is disabled, you can enable it in
            sandbox.config.json.
          </span>
        ) : (
          <>
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
                searchKeywords={searchKeywordsHasError ? '' : searchKeywords}
              />
            </Messages>
            <ConsoleInput evaluateConsole={this.evaluateConsole} />
          </>
        )}
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
      style={{
        fontFamily: 'Inter',
        fontWeight: 600,
        fontSize: '0.875rem',
        height: 22,
        ...props.style,
      }}
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

export const console = {
  id: 'codesandbox.console',
  title: 'Console',
  // @ts-ignore  TODO: fix this
  Content: withTheme<StyledProps>(ConsoleComponent),
  actions: [
    {
      title: 'Clear Console',
      onClick: () => {
        dispatch({ type: 'clear-console' });
      },
      Icon: StyledClearIcon,
    },
    {
      title: 'Search',
      onClick: () => {
        dispatch({ type: 'Search Click' });
      },
      // @ts-ignore  TODO: fix this
      Icon: withTheme<StyledProps>(ConsoleFilterInput),
    },
    {
      title: 'Log Filter',
      onClick: () => {},
      Icon: withTheme(ConsoleFilterSelect),
    },
  ],
};
