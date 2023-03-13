import React from 'react';
import { useEffects } from 'app/overmind';
import Portal from '@codesandbox/common/lib/components/Portal';
import { Element } from '@codesandbox/components';
import { Leva } from 'leva';

const KEY = 'CSB_DEBUG';

export const Debug: React.FC = () => {
  const {
    browser: { storage },
  } = useEffects();
  const showDebugPanel = storage.get<boolean>(KEY) ?? false;

  if (!showDebugPanel) {
    return null;
  }

  return (
    <Portal>
      <Element
        css={{
          position: 'fixed',
          overflow: 'hidden',
          left: 0,
          right: 0,
          bottom: 0,
          top: 0,
          pointerEvents: 'none',

          '> *': {
            pointerEvents: 'auto',
            top: 'auto',
            right: 0,
            bottom: 0,
            left: 'auto',
          },
        }}
      >
        <Leva hidden={!showDebugPanel} oneLineLabels />
      </Element>
    </Portal>
  );
};
