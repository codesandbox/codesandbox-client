import { useSandpack } from '../contexts/sandpack-context';

export const useSandpackActions = () => {
  const { dispatch } = useSandpack();

  return {
    refresh: () => dispatch({ type: 'refresh' }),
  };
};
