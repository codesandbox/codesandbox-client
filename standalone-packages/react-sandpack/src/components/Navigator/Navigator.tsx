import * as React from 'react';
import { listen, dispatch } from 'codesandbox-api';
import classNames from 'classnames';

import RefreshIcon from './RefreshIcon';
import BackwardIcon from './BackwardIcon';
import ForwardIcon from './ForwardIcon';

import withSandpack from '../../utils/with-sandpack';
import { ISandpackContext } from '../../types';
import cn from '../../utils/cn';

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
      case 'urlchange': {
        console.log('urlchange');
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
    } else {
      return url;
    }
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
      <div
        className={classNames(className, cn('Navigator', 'container'))}
        {...props}
      >
        <button
          className={cn('Navigator', 'button')}
          onClick={this.onBackwardNavigation}
        >
          <BackwardIcon />
        </button>
        <button
          className={cn('Navigator', 'button')}
          onClick={this.onFowardNavigation}
        >
          <ForwardIcon />
        </button>
        <button className={cn('Navigator', 'button')} onClick={this.onRefresh}>
          <RefreshIcon />
        </button>
        <input
          className={cn('Navigator', 'input')}
          onChange={this.onInputChange}
          onKeyDown={this.onKeyDown}
          value={browserPath}
        />
      </div>
    );
  }
}

export default withSandpack(Navigator);
