import * as React from 'react';

import ModuleList from './ModuleList';
import SandpackConsumer from '../SandpackConsumer';

export interface Props {}

export default class FileExplorer extends React.PureComponent<Props> {
  render() {
    return (
      <SandpackConsumer>
        {sandpack => (
          <div>
            <ModuleList
              selectFile={sandpack.openFile}
              files={sandpack.files}
              prefixedPath="/"
            />
          </div>
        )}
      </SandpackConsumer>
    );
  }
}
