import * as React from 'react';
import { SandpackReactContext } from '../contexts/sandpack-context';
import { SandpackState } from '../types';

export function useSandpack() {
  const sandpack = React.useContext(SandpackReactContext);

  if (sandpack === null) {
    throw new Error(
      `useSandpack can only be used inside components wrapped by 'SandpackProvider'`
    );
  }

  const { dispatch, listen, ...rest } = sandpack;

  return {
    sandpack: { ...rest } as SandpackState,
    dispatch,
    listen,
  };
}
