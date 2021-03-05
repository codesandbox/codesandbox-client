import * as React from 'react';
import { useClasser } from '@code-hike/classer';
import { RefreshIcon } from '../../icons';
import { useSandpackNavigation } from '../../hooks/useSandpackNavigation';

export const RefreshButton: React.FC = () => {
  const { refresh } = useSandpackNavigation();
  const c = useClasser('sp');

  return (
    <button
      type="button"
      title="Refresh Sandpack"
      className={c('button', 'icon-standalone')}
      onClick={refresh}
    >
      <RefreshIcon />
    </button>
  );
};
