import * as React from 'react';
import { IFiles, IFile } from '../../../types';

import File from '../File';
import Directory from '../Directory';

export interface Props {
  prefixedPath: string;
  files: IFiles;
  selectFile: (path: string) => void;
  openedPath: string;
  depth?: number;
}

export default class ModuleList extends React.PureComponent<Props> {
  render(): JSX.Element {
    const {
      depth = 0,
      openedPath,
      selectFile,
      prefixedPath,
      files,
    } = this.props;

    const filesToShow: { path: string }[] = [];
    const directoriesToShow: Set<string> = new Set();
    const pathParts = prefixedPath.split('/');

    Object.keys(files).forEach(path => {
      if (path.startsWith(prefixedPath)) {
        const filePathParts = path.split('/');

        if (filePathParts.length === pathParts.length) {
          if (path.endsWith('/')) {
            directoriesToShow.add(path);
          } else {
            filesToShow.push({ path });
          }
        } else if (filePathParts.length === pathParts.length + 1) {
          filePathParts.pop();
          directoriesToShow.add(filePathParts.join('/') + '/');
        }
      }
    });

    return (
      <div style={{ marginLeft: `${0.5 * depth}rem` }}>
        {Array.from(directoriesToShow).map(dir => (
          <Directory
            key={dir}
            prefixedPath={dir}
            files={files}
            selectFile={selectFile}
            openedPath={openedPath}
            depth={depth + 1}
          />
        ))}

        {filesToShow.map(file => (
          <File
            key={file.path}
            selectFile={this.props.selectFile}
            path={file.path}
            active={openedPath === file.path}
          />
        ))}
      </div>
    );
  }
}
