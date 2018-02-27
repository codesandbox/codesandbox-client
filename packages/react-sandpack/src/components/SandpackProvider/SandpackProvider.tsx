import * as React from 'react';
import { Broadcast } from 'react-broadcast';
import { Manager } from 'sandpack';

import { IFileProps, IFiles } from '../types';

export interface State {
  files: IFiles;
}

export default class SandpackProvider extends React.PureComponent<
  IFileProps,
  State
> {
  manager?: Manager;
  iframe?: HTMLIFrameElement;

  constructor(props: IFileProps) {
    super(props);

    this.state = {
      files: props.files,
    };
  }

  setupFrame = (el: HTMLIFrameElement) => {
    this.manager = new Manager(el, {
      files: this.props.files,
      entry: this.props.entry,
      dependencies: this.props.dependencies,
    });

    this.iframe = el;
  };

  updateFiles = (files: IFiles) => {
    this.setState({ files });

    if (this.manager) {
      this.manager.sendCode(files, {}, '/index.js');
    }
  };

  componentDidUpdate(props: IFileProps) {
    if (props.files !== this.props.files) {
      this.updateFiles(this.props.files);
    }
  }

  render() {
    const { children } = this.props;
    const { files } = this.state;
    return (
      <Broadcast
        channel="sandpack"
        value={{
          files,
          updateFiles: this.updateFiles,
          browserFrame: this.iframe,
        }}
      >
        <div className="sandpack">
          {/* We create a hidden iframe, the bundler will live in this. */}
          <iframe
            ref={this.setupFrame}
            style={{
              width: 0,
              height: 0,
              border: 0,
              outline: 0,
              position: 'absolute',
              visibility: 'hidden',
            }}
            src="http://localhost:3001"
          />
          {children}
        </div>
      </Broadcast>
    );
  }
}
