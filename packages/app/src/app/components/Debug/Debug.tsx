import React from 'react';
import { Leva } from 'leva';
import { useEffects } from 'app/overmind';
import Portal from '@codesandbox/common/lib/components/Portal';
import { Element } from '@codesandbox/components';

const KEY = 'CSB_DEBUG';

export const Debug: React.FC = () => {
  const {
    browser: { storage },
  } = useEffects();
  const showDebugPanel = storage.get<boolean>(KEY) ?? false;
  const isProd = process.env.NODE_ENV === 'production';

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
          zIndex: 10,

          '> *': {
            pointerEvents: 'auto',
            top: 'auto',
            right: 0,
            bottom: 0,
            left: 'auto',
          },
        }}
      >
        <Leva
          // We can't return early because instances of `useControls`
          // will render the panel, so we need to explicitly hide it.
          hidden={isProd || !showDebugPanel}
          oneLineLabels
        />
      </Element>
    </Portal>
  );
};
