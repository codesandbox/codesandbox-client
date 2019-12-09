import * as React from 'react';
// Replace this with the library later
import CodeSandboxer from '../react-codesandboxer/CodeSandboxer';
import {
  GitInfo,
  Package,
  ImportReplacement,
  Files,
} from './codesandboxer-types';

export interface CodeSandboxerProps {
  /**
   * The absolute path to the example within the git file structure
   *
   * Example: 'examples/Basic.js'
   **/
  examplePath: string;
  /** Name for the codesandbox instance **/
  name?: string;
  /** This is all the information we need to fetch information from github or bitbucket **/
  gitInfo?: GitInfo;
  /** Pass in the example as code to prevent it being fetched **/
  example?: string | Promise<string>;
  /** Either take in a package.json object, or a string as the path of the package.json **/
  pkgJSON?: Package | string | Promise<Package | string>;
  /** paths in the example that we do not want to be pulled from their relativeLocation **/
  importReplacements?: Array<ImportReplacement>;
  /** Dependencies we always include. Most likely react and react-dom **/
  dependencies?: { [dep: string]: string };
  /** Do not actually deploy to codesanbox. Used to for testing alongside the return values of the render prop. **/
  skipRedirect?: boolean;
  ignoreInternalImports?: boolean;
  /** Called once loading has finished, whether it preloaded or not **/
  onLoadComplete?: (
    params: { parameters: string; files: Files } | { error: any }
  ) => void;
  /** Called once a deploy has occurred. This will still be called if skipRedirect is chosen **/
  afterDeploy?: (sandboxUrl: string, sandboxId: string) => void;
  /** Called once a deploy has occurred. This will still be called if skipRedirect is chosen **/
  afterDeployError?: (e: Error) => void;
  /** Pass in files separately to fetching them. Useful to go alongisde specific replacements in importReplacements **/
  providedFiles?: Files;
  /**
   * Allow codesandboxer to accept more extensions like .jsx
   **/
  extensions?: string[];
  template?: 'create-react-app' | 'create-react-app-typescript';
}

export interface Props {
  /**
   * Consumers may need access to the wrapper's style
   **/
  style?: Object;
  /**
   * What to show during loading
   */
  children?: JSX.Element;
  /**
   * The height of the embed, defaults to 500px. Will be overridden if custom styles are given.
   */
  height?: number | string;
  /**
   * The width of the embed, defaults to '100%'. Will be overridden if custom styles are given.
   */
  width?: number | string;
  /**
   * What to render when there's an error
   */
  renderError?: (e: Error) => JSX.Element;
  /**
   * The sandbox information to deploy
   */
  sandboxOptions?: CodeSandboxerProps;
  /**
   * Configuration options for the embed
   */
  embedOptions?: {
    /**
     * Hide the navigation bar of the preview
     */
    hidenavigation?: boolean;
    /**
     * Only evaluate the module that is opened in the editor
     */
    moduleview?: boolean;
    /**
     * Use the CodeMirror editor instead of Monaco (results in smaller payload size of the embed)
     */
    codemirror?: boolean;
    /**
     * Enable eslint (increases payload slightly)
     */
    eslint?: boolean;
    /**
     * Force a full refresh of the frame after every edit
     */
    forcerefresh?: boolean;
    /**
     * Start with the devtools open
     */
    expanddevtools?: boolean;
    /**
     * Only load the preview when the user clicks on a button
     */
    runonclick?: boolean;
    /**
     * Which view to open by default
     */
    view?: 'editor' | 'split' | 'preview';
    /**
     * Which preview window to open by default
     */
    previewwindow?: 'console' | 'tests' | 'browser';
    /**
     * Which module to open by default (absolute path starting with a '/')
     */
    module?: string;
    /**
     * Which url to initially load in address bar
     */
    initialpath?: string;
    /**
     * The font size of the editor (in px)
     */
    fontsize?: number;
    /**
     * Which lines to hightlight (only works in codemirror).
     */
    highlights?: number[];
    /**
     * Size of the editor (in percentage)
     */
    editorsize?: number;
    /**
     * Whether to show the editor and preview vertically
     */
    verticallayout?: boolean;
  };
}

export default class SandboxEmbed extends React.PureComponent<Props> {
  state: {
    sandboxId: string | null;
    oldSandboxId: string | null;
    error: {
      name: string;
      message: string;
    } | null;
  } = {
    sandboxId: null,
    oldSandboxId: null,
    error: null,
  };
  newSandboxTimeout = null;

  generateEmbedURL = (sandboxId: string) => {
    let url = `https://codesandbox.io/embed/${sandboxId}`;
    function getValue(option, value) {
      if (typeof value === 'boolean') {
        return value ? 1 : 0;
      }

      if (option === 'highlights') {
        return value.join(',');
      }

      return value;
    }

    const { embedOptions = {} } = this.props;

    embedOptions.module = embedOptions.module || '/example.js';
    const options = Object.keys(embedOptions)
      .map(option => `${option}=${getValue(option, embedOptions[option])}`)
      .join('&');

    if (options) {
      url += `?${options}`;
    }

    return url;
  };

  afterDeploy = (sandboxUrl: string, sandboxId: string) => {
    this.setState({ sandboxId, oldSandBoxId: null, error: null });

    if (this.props.sandboxOptions && this.props.sandboxOptions.afterDeploy) {
      this.props.sandboxOptions.afterDeploy(sandboxUrl, sandboxId);
    }
  };

  onLoadComplete = (
    params: { parameters: string; files: Files } & { error: any }
  ) => {
    if (params.error) {
      this.setState({ sandboxId: null, error: params.error });
    }

    if (this.props.sandboxOptions && this.props.sandboxOptions.onLoadComplete) {
      this.props.sandboxOptions.onLoadComplete(params);
    }
  };

  UNSAFE_componentWillUpdate(nextProps) {
    if (nextProps.sandboxOptions !== this.props.sandboxOptions) {
      // This will help smoothen the transition between two sandboxes

      this.setState({
        sandboxId: null,
        oldSandboxId: this.state.sandboxId,
        error: null,
      });

      this.newSandboxTimeout = setTimeout(() => {
        this.setState({
          oldSandboxId: null,
        });
      }, 600);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.newSandboxTimeout);
  }

  render() {
    const {
      style = {
        width: this.props.width == null ? '100%' : this.props.width,
        height: this.props.height == null ? 500 : this.props.height,
        outline: 0,
        border: 0,
        borderRadius: 4,
      },
    } = this.props;

    if (this.state.error) {
      return this.props.renderError ? (
        this.props.renderError(this.state.error)
      ) : (
        <div style={this.props.style}>
          Something went wrong while fetching the sandbox:{' '}
          {this.state.error.message}
        </div>
      );
    }

    const usedSandboxId = this.state.sandboxId || this.state.oldSandboxId;

    return (
      <React.Fragment>
        {usedSandboxId && (
          <iframe
            name="codesandbox"
            style={style}
            src={this.generateEmbedURL(usedSandboxId)}
          />
        )}
        {!this.state.sandboxId && (
          <CodeSandboxer
            {...this.props.sandboxOptions}
            autoDeploy
            skipRedirect
            afterDeploy={this.afterDeploy}
            onLoadComplete={this.onLoadComplete}
          >
            {() =>
              this.state.oldSandboxId
                ? null
                : this.props.children || 'Loading Sandbox...'
            }
          </CodeSandboxer>
        )}
      </React.Fragment>
    );
  }
}
