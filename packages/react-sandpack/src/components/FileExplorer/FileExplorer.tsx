import * as React from 'react';

import ModuleList from './ModuleList';
import SandpackConsumer from '../SandpackConsumer';

import cn from '../../utils/cn';

export interface Props {
  style?: Object;
  className?: string;
}

export default class FileExplorer extends React.PureComponent<Props> {
  render() {
    const { style, className = '' } = this.props;
    return (
      <SandpackConsumer>
        {sandpack => (
          <div
            className={`${className} ${cn('FileExplorer', 'container')}`}
            style={style}
          >
            <ModuleList
              selectFile={sandpack.openFile}
              files={sandpack.files}
              prefixedPath="/"
              openedPath={sandpack.openedPath}
            />
          </div>
        )}
      </SandpackConsumer>
    );
  }
}
