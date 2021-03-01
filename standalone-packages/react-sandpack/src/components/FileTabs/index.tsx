import * as React from 'react';

import { useSandpack } from '../../contexts/sandpack-context';
import { getFileName } from '../../utils/string-utils';

export interface FileTabsProps {
  customStyle?: React.CSSProperties;
}

export const FileTabs: React.FC<FileTabsProps> = props => {
  const { sandpack } = useSandpack();

  const { activePath, openPaths, changeActiveFile } = sandpack;

  return (
    <div className="sp-tabs" style={props.customStyle}>
      <div
        className="sp-tabs-scrollable-container"
        role="tablist"
        aria-label="Select active file"
      >
        {openPaths.map(filePath => (
          <button
            className="sp-tab-button"
            type="button"
            role="tab"
            key={filePath}
            aria-selected={filePath === activePath}
            data-active={filePath === activePath}
            onClick={() => changeActiveFile(filePath)}
          >
            {getFileName(filePath)}
          </button>
        ))}
      </div>
    </div>
  );
};
