import * as React from 'react';
import { useClasser } from '@code-hike/classer';
import { useErrorMessage } from '../hooks/useErrorMessage';

export const ErrorOverlay = () => {
  const errorMessage = useErrorMessage();
  const c = useClasser('sp');

  if (!errorMessage) {
    return null;
  }

  return (
    <div className={c('overlay', 'error')}>
      <div className={c('error-message')}>{errorMessage}</div>
    </div>
  );
};
