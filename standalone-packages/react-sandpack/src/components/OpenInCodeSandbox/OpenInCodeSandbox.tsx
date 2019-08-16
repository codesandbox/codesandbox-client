import * as React from 'react';
import { getParameters } from 'codesandbox-import-utils/lib/api/define';
import { IFiles } from '../../types';

import SandpackConsumer from '../SandpackConsumer';

export interface Props {
  render?: () => React.ReactNode;
}

export default class OpenInCodeSandbox extends React.Component<Props> {
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

  renderButton() {
    if (typeof this.props.render === 'function') {
      return this.props.render();
    }

    return <input type="submit" value="Open in CodeSandbox" />;
  }

  render() {
    const { render, ...props } = this.props;

    return (
      <SandpackConsumer>
        {sandpack => (
          <form
            action="https://codesandbox.io/api/v1/sandboxes/define"
            method="POST"
            target="_blank"
            {...props}
          >
            <input
              type="hidden"
              name="parameters"
              value={this.getFileParameters(sandpack.files)}
            />
            {this.renderButton()}
          </form>
        )}
      </SandpackConsumer>
    );
  }
}
