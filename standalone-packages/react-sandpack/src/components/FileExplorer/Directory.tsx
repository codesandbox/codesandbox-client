import * as React from 'react';
import { IFiles } from 'smooshpack';

import { File } from './File';
import { ModuleList } from './ModuleList';

export interface Props {
  prefixedPath: string;
  files: IFiles;
  selectFile: (path: string) => void;
  activePath: string;
  depth: number;
}

interface State {
  open: boolean;
}

export class Directory extends React.Component<Props, State> {
  state = {
    open: true,
  };

  toggleOpen = () => {
    this.setState(state => ({ open: !state.open }));
  };

  render() {
    const { prefixedPath, files, selectFile, activePath, depth } = this.props;

    return (
      <div key={prefixedPath}>
        <File
          onClick={this.toggleOpen}
          path={prefixedPath + '/'}
          depth={depth}
        />
        {this.state.open && (
          <ModuleList
            prefixedPath={prefixedPath}
            files={files}
            selectFile={selectFile}
            activePath={activePath}
            depth={depth}
          />
        )}
      </div>
    );
  }
}
