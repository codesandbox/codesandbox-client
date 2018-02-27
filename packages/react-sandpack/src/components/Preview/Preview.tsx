import * as React from 'react';
import SandpackConsumer from '../SandpackConsumer';

export interface PreviewProps {
  browser: HTMLIFrameElement;
}

class Preview extends React.PureComponent<PreviewProps> {
  container?: HTMLDivElement;

  setContainerElement = (el: HTMLDivElement) => {
    this.container = el;
  };

  initializeFrame = () => {
    const { browser } = this.props;

    if (browser && this.container) {
      browser.style.width = '100%';
      browser.style.height = '500px';
      browser.style.visibility = 'visible';
      browser.style.position = 'relative';

      this.container.appendChild(browser);
    }
  };

  componentDidUpdate(prevProps: PreviewProps) {
    if (prevProps.browser !== this.props.browser) {
      this.initializeFrame();
    }
  }

  render() {
    return <div ref={this.setContainerElement} />;
  }
}

export default class ContainerElement extends React.PureComponent {
  render() {
    return (
      <SandpackConsumer>
        {state => <Preview browser={state.browserFrame} />}
      </SandpackConsumer>
    );
  }
}
