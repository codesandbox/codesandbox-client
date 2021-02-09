import * as React from 'react';
import { RefreshIcon } from '../../icons';
import { useSandpack } from '../../contexts/sandpack-context';

export const RefreshButton = () => {
  const { dispatch } = useSandpack();

  return (
    <button
      type="button"
      className="sp-button icon-standalone"
      style={{
        position: 'absolute',
        top: 'var(--space-2)',
        right: 'var(--space-2)',
        zIndex: 2,
      }}
      onClick={() => dispatch({ type: 'refresh' })}
    >
      <RefreshIcon />
    </button>
  );
};
