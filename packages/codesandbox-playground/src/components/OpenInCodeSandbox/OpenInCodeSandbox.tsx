import * as React from 'react';

import { IFileProps } from '../types';

const { getParameters } = require('codesandbox/lib/api/define');

export default class OpenInCodeSandbox extends React.Component<IFileProps> {
  static defaultProps = {
    entry: '/index.js',
  };

  getFileParameters = () => {
    const { files, dependencies } = this.props;
    const paramFiles = { ...files };

    const packageJSON = {
      main: this.props.entry,
      dependencies,
    };
    paramFiles['/package.json'] = {
      code: JSON.stringify(packageJSON, null, 2),
    };

    const normalized = Object.keys(paramFiles).reduce(
      (prev, next) => ({
        ...prev,
        [next.replace('/', '')]: {
          content: paramFiles[next].code,
          isBinary: false,
        },
      }),
      {}
    );

    return getParameters({ files: normalized });
  };

  render() {
    const { files, dependencies, ...props } = this.props;
    return (
      <form
        action="https://codesandbox.io/api/v1/sandboxes/define"
        method="POST"
        target="_blank"
        {...props}
      >
        <input
          type="hidden"
          name="parameters"
          value={this.getFileParameters()}
        />
        <input type="submit" value="Open in CodeSandbox" />
      </form>
    );
  }
}
