import React from 'react';
import { getParameters } from 'codesandbox/lib/api/define';

import { filePropTypes } from '../../utils/prop-types';

export default class OpenInCodeSandbox extends React.Component {
  static propTypes = {
    ...filePropTypes,
  };

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

    paramFiles['/package.json'] = { code: JSON.stringify(packageJSON) };

    const normalized = Object.keys(paramFiles).reduce(
      (prev, next) => ({
        ...prev,
        [next.replace('/', '')]: {
          ...paramFiles[next],
          content: paramFiles[next].code,
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
