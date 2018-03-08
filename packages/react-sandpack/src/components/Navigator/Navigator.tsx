import * as React from 'react';
import { listen, dispatch } from 'codesandbox-api';
import classNames from 'classnames';

import RefreshIcon from './RefreshIcon';
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
    };
  }

  componentWillUnmount() {
    this.listener();
  }

  handleMessage = (message: any) => {
    switch (message.type) {
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
    } else {
      return url;
    }
  }

  getUrlState = (url: string) => {
    const baseUrl = this.getBaseUrl(url);
    const browserPath = url.replace(baseUrl, '') || '/';

    return { baseUrl, browserPath, lastCommittedUrl: url };
  };

  commitUrl = () => {
    if (this.props.sandpack.browserFrame) {
      this.props.sandpack.browserFrame.src =
        this.state.baseUrl + this.state.browserPath;
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
      // Enter
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

  render() {
    const { browserPath } = this.state;
    const { sandpack, className, ...props } = this.props;

    return (
      <div
        className={classNames(className, cn('Navigator', 'container'))}
        {...props}
      >
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
