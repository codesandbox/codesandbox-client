import * as React from 'react';
import { useClasser } from '@code-hike/classer';
import { RunIcon } from '../icons';
import { useSandpack } from '../hooks/useSandpack';

export const RunButton = () => {
  const c = useClasser('sp');
  const { sandpack } = useSandpack();

  return (
    <button
      type="button"
      className={c('button')}
      style={{
        position: 'absolute',
        bottom: 'var(--sp-space-2)',
        right: 'var(--sp-space-2)',
      }}
      onClick={() => sandpack.runSandpack()}
    >
      <RunIcon />
      Run
    </button>
  );
};
