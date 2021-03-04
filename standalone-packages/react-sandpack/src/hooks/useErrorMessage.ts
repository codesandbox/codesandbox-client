import * as React from 'react';
import { useSandpack } from './useSandpack';

export const useErrorMessage = () => {
  const { sandpack } = useSandpack();

  React.useEffect(() => {
    sandpack.errorScreenRegisteredRef.current = true;
  }, []);

  const { error } = sandpack;
  if (!error) {
    return null;
  }

  return error.message;
};
