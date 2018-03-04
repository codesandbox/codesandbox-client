import * as React from 'react';
import { IFiles, IFile } from '../../../types';

import File from '../File';

export interface Props {
  prefixedPath: string;
  files: IFiles;
  selectFile: (path: string) => void;
}

export default class ModuleList extends React.PureComponent<Props> {
  render() {
    const filesToShow: { path: string; code: string }[] = [];
    const directoriesToShow: { path: string }[] = [];
    const pathParts = this.props.prefixedPath.split('/');

    Object.keys(this.props.files).forEach(path => {
      if (path.startsWith(this.props.prefixedPath)) {
        const filePathParts = path.split('/');

        if (filePathParts.length === pathParts.length) {
          if (path.endsWith('/')) {
            directoriesToShow.push({ path });
          } else {
            filesToShow.push({ path, code: this.props.files[path].code });
          }
        }
      }
    });

    return (
      <div>
        {directoriesToShow.map(dir => (
          <File
            key={dir.path}
            selectFile={this.props.selectFile}
            path={dir.path}
          />
        ))}

        {filesToShow.map(file => (
          <File
            key={file.path}
            selectFile={this.props.selectFile}
            path={file.path}
          />
        ))}
      </div>
    );
  }
}
