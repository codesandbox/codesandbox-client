import * as React from 'react';

import File from '../File';
import ModuleList from '../ModuleList';

import { IFiles } from '../../../types';

export interface Props {
  prefixedPath: string;
  files: IFiles;
  selectFile: (path: string) => void;
  openedPath: string;
  depth: number;
}

export default class Directory extends React.Component<Props> {
  state = {
    open: true,
  };

  toggleOpen = () => {
    this.setState({ open: !this.state.open });
  };

  render() {
    const { prefixedPath, files, selectFile, openedPath, depth } = this.props;

    return (
      <div key={prefixedPath}>
        <File onClick={this.toggleOpen} path={prefixedPath + '/'} />
        {this.state.open && (
          <ModuleList
            prefixedPath={prefixedPath}
            files={files}
            selectFile={selectFile}
            openedPath={openedPath}
            depth={depth}
          />
        )}
      </div>
    );
  }
}
