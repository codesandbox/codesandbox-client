import * as React from 'react';
import { useClasser } from '@code-hike/classer';
import { useSandpack } from '../../hooks/useSandpack';
import { getFileName } from '../../utils/string-utils';

export const FileTabs: React.FC = () => {
  const { sandpack } = useSandpack();
  const c = useClasser('sp');

  const { activePath, openPaths, changeActiveFile } = sandpack;

  return (
    <div className={c('tabs')}>
      <div
        className={c('tabs-scrollable-container')}
        role="tablist"
        aria-label="Select active file"
      >
        {openPaths.map(filePath => (
          <button
            className={c('tab-button')}
            type="button"
            role="tab"
            key={filePath}
            aria-selected={filePath === activePath}
            data-active={filePath === activePath}
            onClick={() => changeActiveFile(filePath)}
            title={filePath}
          >
            {getFileName(filePath)}
          </button>
        ))}
      </div>
    </div>
  );
};
