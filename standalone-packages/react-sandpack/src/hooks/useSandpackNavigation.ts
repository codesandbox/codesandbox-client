import { useSandpack } from './useSandpack';

export const useSandpackNavigation = () => {
  const { dispatch } = useSandpack();

  return {
    refresh: () => dispatch({ type: 'refresh' }),
    back: () => dispatch({ type: 'urlback' }),
    forward: () => dispatch({ type: 'urlforward' }),
  };
};
