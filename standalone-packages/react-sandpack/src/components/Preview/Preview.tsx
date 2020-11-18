import { listen } from 'codesandbox-api';
import * as React from 'react';
import { ISandpackContext } from '../../types';
import withSandpack from '../../utils/with-sandpack';

export interface PreviewProps {
  sandpack: ISandpackContext;
  style?: React.CSSProperties;
}

class Preview extends React.Component<PreviewProps> {
  container?: HTMLDivElement;
  listener?: Function;

  setContainerElement = (el: HTMLDivElement) => {
    this.container = el;
    this.listener = listen(this.handleMessage);
  };

  handleMessage = (message: any) => {
    if (message.type === 'resize') {
      if (this.props.sandpack.browserFrame) {
        this.props.sandpack.browserFrame.style.height = message.height;
      }
    }
  };

  initializeFrame = () => {
    const { browserFrame } = this.props.sandpack;

    if (browserFrame && this.container) {
      browserFrame.style.width = '100%';
      browserFrame.style.height = '500px';
      browserFrame.style.visibility = 'visible';
      browserFrame.style.position = 'relative';

      this.container.appendChild(browserFrame);
    }
  };

  componentDidUpdate(prevProps: PreviewProps) {
    if (prevProps.sandpack.browserFrame !== this.props.sandpack.browserFrame) {
      this.initializeFrame();
    }
  }

  render() {
    return <div style={this.props.style} ref={this.setContainerElement} />;
  }
}

export default withSandpack(Preview);
