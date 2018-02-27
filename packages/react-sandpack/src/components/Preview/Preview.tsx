import * as React from 'react';
import { Manager } from 'sandpack';

import { IFileProps } from '../types';

export default class Preview extends React.PureComponent<IFileProps> {
  static defaultProps = {
    dependencies: {},
    entry: '/index.js',
    sandboxUrl: 'https://sandbox.codesandbox.io',
  };

  manager?: Manager;

  setupFrame = (el: HTMLIFrameElement) => {
    if (el) {
      this.manager = new Manager(
        el,
        {
          dependencies: this.props.dependencies,
          files: this.props.files,
          entry: this.props.entry,
        },
        {
          sandboxUrl: this.props.sandboxUrl,
        }
      );
    }
  };

  sendCode = () => {
    if (this.manager) {
      this.manager.sendCode(
        this.props.files,
        this.props.dependencies,
        this.props.entry
      );
    }
  };

  componentDidUpdate(prevProps: IFileProps) {
    if (
      this.props.files !== prevProps.files ||
      this.props.dependencies !== prevProps.dependencies ||
      this.props.entry !== prevProps.entry
    ) {
      this.sendCode();
    }
  }

  render() {
    return (
      <iframe
        style={{
          width: this.props.width || '100%',
          height: this.props.height || '500px',
          border: 'none',
        }}
        src={this.props.sandboxUrl}
        ref={this.setupFrame}
      />
    );
  }
}
