import * as React from 'react';
import { Broadcast } from 'react-broadcast';
import { Manager, generatePackageJSON } from 'smooshpack';
import { listen } from 'codesandbox-api';

import { IFile, IFiles, IManagerState } from '../../types';

export interface State {
  files: IFiles;
  browserPath: string;
  openedPath: string;
  iframe: HTMLIFrameElement | null;
  managerState: IManagerState | undefined;
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
  bundlerURL?: string;
  skipEval?: boolean;
  template?:
    | 'create-react-app'
    | 'create-react-app-typescript'
    | 'parcel'
    | 'vue-cli'
    | 'angular-cli'
    | 'preact-cli';

  onFileChange?: (files: IFiles) => void;
}

export default class SandpackProvider extends React.PureComponent<
  Props,
  State
> {
  static defaultProps = {
    skipEval: false,
  };

  manager?: Manager;
  iframe?: HTMLIFrameElement;
  listener: Function;

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
      iframe: null,
      managerState: undefined,
    };

    this.listener = listen(this.handleMessage);
  }

  handleMessage = (message: any) => {
    if (message.type === 'success') {
      this.setState({ managerState: message.state });
    }
  };

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
    if (el) {
      this.manager = new Manager(
        el,
        {
          files: generatePackageJSON(
            this.props.files,
            this.props.dependencies,
            this.props.entry
          ),
          template: this.props.template,
        },
        {
          skipEval: this.props.skipEval,
        }
      );

      this.iframe = el;

      this.setState({ iframe: el });
    }
  };

  updateFiles = (files: IFiles) => {
    this.setState({ files });

    if (this.props.onFileChange) {
      this.props.onFileChange(files);
    }
    if (this.manager) {
      this.manager.updatePreview({ files, template: this.props.template });
    }
  };

  componentDidUpdate(props: Props) {
    if (
      props.files !== this.props.files ||
      props.dependencies !== this.props.dependencies ||
      props.entry !== this.props.entry ||
      props.template !== this.props.template
    ) {
      const newFiles = this.createMissingPackageJSON(
        this.props.files,
        this.props.dependencies,
        this.props.entry
      );

      this.updateFiles(newFiles);
    }
  }

  componentWillUnmount() {
    this.listener();
  }

  openFile = (path: string) => {
    this.setState({ openedPath: path });
  };

  render() {
    const { children } = this.props;
    const { iframe, files, browserPath, openedPath, managerState } = this.state;

    return (
      <Broadcast
        channel="sandpack"
        value={{
          files,
          openedPath,
          managerState,
          openFile: this.openFile,
          browserFrame: iframe,
          updateFiles: this.updateFiles,
          bundlerURL: this.manager ? this.manager.bundlerURL : undefined,
        }}
      >
        <div className="sandpack">
          {/* We create a hidden iframe, the bundler will live in this.
            We expose this iframe to the Consumer, so other components can show the full
            iframe for preview. An implementation can be found in `Preview` component. */}
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
            src={this.props.bundlerURL}
          />
          {children}
        </div>
      </Broadcast>
    );
  }
}
