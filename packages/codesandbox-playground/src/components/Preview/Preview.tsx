import * as React from 'react';

import { IFileProps } from '../types';
import { sendCode } from '../../utils/frame';

export default class Preview extends React.PureComponent<IFileProps> {
  static defaultProps = {
    dependencies: {},
    entry: '/index.js',
    sandboxUrl: 'https://sandbox.codesandbox.io',
  };

  frame?: HTMLIFrameElement;

  setupFrame = (el: HTMLIFrameElement) => {
    if (el) {
      this.frame = el;
      this.frame.onload = () => {
        this.sendCode();
      };
    }
  };

  sendCode = () => {
    if (this.frame) {
      sendCode(
        this.frame,
        this.props.files,
        this.props.dependencies,
        this.props.entry
      );

      const modules = Object.keys(this.props.files).map(path => ({
        ...this.props.files[path],
        path,
      }));
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
