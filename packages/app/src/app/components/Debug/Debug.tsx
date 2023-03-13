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
          right: 0,
          bottom: 0,
          width: '260px',
          pointerEvents: 'none',
          zIndex: 10,

          '> *': {
            pointerEvents: 'auto',
          },
        }}
      >
        <Leva hidden={!showDebugPanel} />
      </Element>
    </Portal>
  );
};
