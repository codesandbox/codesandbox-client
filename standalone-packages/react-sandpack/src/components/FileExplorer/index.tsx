import * as React from 'react';
import { useSandpack } from '../../hooks/useSandpack';
import { ModuleList } from './ModuleList';

export interface FileExplorerProps {
  customStyle?: React.CSSProperties;
}

export const FileExplorer: React.FC<FileExplorerProps> = props => {
  const { sandpack } = useSandpack();

  return (
    <div style={props.customStyle}>
      <ModuleList
        selectFile={sandpack.openFile}
        files={sandpack.files}
        prefixedPath="/"
        activePath={sandpack.activePath}
      />
    </div>
  );
};
