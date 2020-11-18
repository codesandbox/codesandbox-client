import * as React from 'react';
import { listen } from 'codesandbox-api';

import RefreshIcon from './RefreshIcon';
import BackwardIcon from './BackwardIcon';
import ForwardIcon from './ForwardIcon';

import withSandpack from '../../utils/with-sandpack';
import { ISandpackContext } from '../../types';
import { styled } from '../../stitches.config';

interface Props {
  sandpack: ISandpackContext;
  className?: string;
}

interface State {
  browserPath: string;
  baseUrl: string;
  lastCommittedUrl: string;
  backwardNavigationStack: Array<string>;
  forwardNavigationStack: Array<string>;
}

const NavigatorContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  backgroundColor: 'rgb(245, 245, 245)',
  width: '100%',
  padding: '0.5rem',
  borderRadius: '2px',
  borderBottom: '1px solid #ddd',
  '&:first-child': { marginLeft: '0' },
  '&:last-child': { marginLeft: '0' },
});

const NavigatorInput = styled('input', {
  backgroundColor: 'white',
  width: '100%',
  padding: '0.25rem 0.5rem',
  borderRadius: '4px',
  border: '1px solid #ddd',
  fontSize: '0.875rem',
  margin: '0 0.25rem',
  flex: 1,
});

const NavigatorButton = styled('button', {
  transition: '0.3s ease background-color',
  padding: '2px',
  margin: '0 0.25rem',
  fontSize: '1.25rem',
  backgroundColor: 'transparent',
  border: '0',
  outline: '0',
  display: 'flex',
  alignItems: 'center',
  color: 'rgb(114, 114, 114)',
  verticalAlign: 'middle',
  cursor: 'pointer',

  ':hover': { backgroundColor: 'rgba(0, 0, 0, 0.1)' },
});

class Navigator extends React.Component<Props, State> {
  listener: Function;

  constructor(props: Props) {
    super(props);
    this.listener = listen(this.handleMessage);

    this.state = {
      browserPath: '/',
      baseUrl: '',
      lastCommittedUrl: '/',
      backwardNavigationStack: [],
      forwardNavigationStack: [],
    };
  }

  componentWillUnmount() {
    this.listener();
  }

  handleMessage = (message: any) => {
    switch (message.type) {
      case 'initialized': {
        this.setState(this.getUrlState(message.url));
        break;
      }

      case 'urlchange': {
        this.setState(this.getUrlState(message.url));
        break;
      }

      default: {
        // nothing
        break;
      }
    }
  };

  getBaseUrl(url: string) {
    const match = url.match(/(https?:\/\/.*?)\//);

    if (match && match[1]) {
      return match[1];
    }

    return url;
  }

  getUrlState = (url: string) => {
    const baseUrl = this.getBaseUrl(url);
    const browserPath = url.replace(baseUrl, '') || '/';

    return {
      baseUrl,
      browserPath,
      lastCommittedUrl: url,
    };
  };

  commitUrl = () => {
    const { sandpack } = this.props;
    const { baseUrl, browserPath } = this.state;

    if (sandpack.browserFrame) {
      const prevUrl = sandpack.browserFrame.src;
      sandpack.browserFrame.src = baseUrl + browserPath;

      // update lastCommittedUrl url
      this.setState({
        lastCommittedUrl: baseUrl + browserPath,
      });

      // update the navigation stacks
      // when you enter a new URL the forwardNavigationStack is cleared
      if (prevUrl != null) {
        this.setState(prevState => ({
          backwardNavigationStack: [
            ...prevState.backwardNavigationStack,
            prevUrl,
          ],
          forwardNavigationStack: [],
        }));
      }
    }
  };

  onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const browserPath = e.target.value.startsWith('/')
      ? e.target.value
      : `/${e.target.value}`;

    this.setState({ browserPath });
  };

  onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13) {
      //  Enter
      e.preventDefault();
      e.stopPropagation();

      this.commitUrl();
    }
  };

  onRefresh = () => {
    if (this.props.sandpack.browserFrame) {
      this.props.sandpack.browserFrame.src = this.state.lastCommittedUrl;
    }
  };

  onBackwardNavigation = () => {
    const { backwardNavigationStack } = this.state;
    const { sandpack } = this.props;

    if (backwardNavigationStack.length > 0) {
      const newCurrUrl =
        backwardNavigationStack[backwardNavigationStack.length - 1];
      if (sandpack.browserFrame) {
        const currUrl = sandpack.browserFrame.src;
        sandpack.browserFrame.src = newCurrUrl;

        const baseUrl = this.getBaseUrl(newCurrUrl);
        const browserPath = newCurrUrl.replace(baseUrl, '') || '/';

        this.setState(prevState => ({
          backwardNavigationStack: prevState.backwardNavigationStack.slice(
            0,
            -1
          ),
          forwardNavigationStack: [
            ...prevState.forwardNavigationStack,
            currUrl,
          ],
          lastCommittedUrl: newCurrUrl,
          browserPath,
        }));
      }
    }
  };

  onFowardNavigation = () => {
    const { forwardNavigationStack } = this.state;
    const { sandpack } = this.props;

    if (forwardNavigationStack.length > 0) {
      const newCurrUrl =
        forwardNavigationStack[forwardNavigationStack.length - 1];
      if (sandpack.browserFrame) {
        const currUrl = sandpack.browserFrame.src;
        sandpack.browserFrame.src = newCurrUrl;

        const baseUrl = this.getBaseUrl(newCurrUrl);
        const browserPath = newCurrUrl.replace(baseUrl, '') || '/';

        this.setState(prevState => ({
          backwardNavigationStack: [
            ...prevState.backwardNavigationStack,
            currUrl,
          ],
          forwardNavigationStack: prevState.forwardNavigationStack.slice(0, -1),
          lastCommittedUrl: newCurrUrl,
          browserPath,
        }));
      }
    }
  };

  render() {
    const { browserPath } = this.state;
    const { sandpack, className, ...props } = this.props;

    return (
      <NavigatorContainer className={className} {...props}>
        <NavigatorButton onClick={this.onBackwardNavigation}>
          <BackwardIcon />
        </NavigatorButton>
        <NavigatorButton onClick={this.onFowardNavigation}>
          <ForwardIcon />
        </NavigatorButton>
        <NavigatorButton onClick={this.onRefresh}>
          <RefreshIcon />
        </NavigatorButton>
        <NavigatorInput
          onChange={this.onInputChange}
          onKeyDown={this.onKeyDown}
          value={browserPath}
        />
      </NavigatorContainer>
    );
  }
}

export default withSandpack(Navigator);
