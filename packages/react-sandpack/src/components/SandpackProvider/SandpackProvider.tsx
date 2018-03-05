import * as React from 'react';
import { Broadcast } from 'react-broadcast';
import { Manager } from 'sandpack';

import { IFile, IFiles } from '../../types';

export interface State {
  files: IFiles;
  browserPath: string;
  openedPath: string;
}

export interface Props {
  files: IFiles;
  initialPath?: string;
  entry?: string;
  dependencies?: {
    [depName: string]: string;
  };
  width?: number | string;
  height?: number | string;
  sandboxUrl: string;
  skipEval: boolean;
}

export default class SandpackProvider extends React.PureComponent<
  Props,
  State
> {
  static defaultProps = {
    sandboxUrl: 'http://localhost:3001',
    skipEval: false,
  };

  manager?: Manager;
  iframe?: HTMLIFrameElement;

  constructor(props: Props) {
    super(props);

    this.state = {
      files: this.createMissingPackageJSON(
        props.files,
        props.dependencies,
        props.entry
      ),
      browserPath: props.initialPath || '/',
      openedPath: props.entry || '/index.js',
    };
  }

  createMissingPackageJSON(
    files: IFiles,
    dependencies?: {
      [depName: string]: string;
    },
    entry?: string
  ) {
    const newFiles = { ...files };

    if (!newFiles['/package.json']) {
      if (!dependencies) {
        throw new Error(
          'No dependencies specified, please specify either a package.json or dependencies.'
        );
      }

      if (!entry) {
        throw new Error(
          "No entry specified, please specify either a package.json with 'main' field or dependencies."
        );
      }

      newFiles['/package.json'] = {
        code: JSON.stringify(
          {
            name: 'run',
            main: entry,
            dependencies,
          },
          null,
          2
        ),
      };
    }

    return newFiles;
  }

  setupFrame = (el: HTMLIFrameElement) => {
    this.manager = new Manager(el, this.props.files, {
      skipEval: this.props.skipEval,
    });

    this.iframe = el;
  };

  updateFiles = (files: IFiles) => {
    this.setState({ files });

    if (this.manager) {
      this.manager.sendCode(files);
    }
  };

  componentDidUpdate(props: Props) {
    if (
      props.files !== this.props.files ||
      props.dependencies !== this.props.dependencies ||
      props.entry !== this.props.entry
    ) {
      const newFiles = this.createMissingPackageJSON(
        this.props.files,
        this.props.dependencies,
        this.props.entry
      );

      this.updateFiles(newFiles);
    }
  }

  openFile = (path: string) => {
    this.setState({ openedPath: path });
  };

  render() {
    const { children } = this.props;
    const { files, browserPath, openedPath } = this.state;

    return (
      <Broadcast
        channel="sandpack"
        value={{
          files,
          openedPath,
          openFile: this.openFile,
          browserFrame: this.iframe,
          updateFiles: this.updateFiles,
          sandboxUrl: this.props.sandboxUrl,
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
            src={this.props.sandboxUrl}
          />
          {children}
        </div>
      </Broadcast>
    );
  }
}
