import * as React from 'react';
import { getParameters } from 'codesandbox-import-utils/lib/api/define';
import { IFiles } from '../../types';

import SandpackConsumer from '../SandpackConsumer';

export default class OpenInCodeSandbox extends React.Component {
  getFileParameters = (files: IFiles) => {
    const normalized: {
      [path: string]: { content: string; isBinary: boolean };
    } = Object.keys(files).reduce(
      (prev, next) => ({
        ...prev,
        [next.replace('/', '')]: {
          content: files[next].code,
          isBinary: false,
        },
      }),
      {}
    );

    return getParameters({ files: normalized });
  };

  render() {
    return (
      <SandpackConsumer>
        {sandpack => (
          <form
            action="https://codesandbox.io/api/v1/sandboxes/define"
            method="POST"
            target="_blank"
            {...this.props}
          >
            <input
              type="hidden"
              name="parameters"
              value={this.getFileParameters(sandpack.files)}
            />
            <input type="submit" value="Open in CodeSandbox" />
          </form>
        )}
      </SandpackConsumer>
    );
  }
}
