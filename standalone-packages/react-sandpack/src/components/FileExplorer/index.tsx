import * as React from 'react';
import { useSandpack } from '../../hooks/useSandpack';
import { ModuleList } from './ModuleList';

// WIP
export const FileExplorer: React.FC = () => {
  const { sandpack } = useSandpack();

  return (
    <div>
      <ModuleList
        selectFile={sandpack.openFile}
        files={sandpack.files}
        prefixedPath="/"
        activePath={sandpack.activePath}
      />
    </div>
  );
};
