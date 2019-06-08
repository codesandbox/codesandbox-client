import React from 'react';
import { observer } from 'mobx-react-lite';
import Lock from 'react-icons/lib/fa/lock';
import Unlock from 'react-icons/lib/fa/unlock';
import { useSignals, useStore } from 'app/store';
import { HazardButton } from './HazardButton';

export const ToggleFrozenButton = observer(() => {
  const {
    editor: { frozenUpdated },
  } = useSignals();
  const {
    editor: {
      currentSandbox: { isFrozen },
    },
  } = useStore();

  const toggleFrozen = () => frozenUpdated({ frozen: !isFrozen });

  return isFrozen ? (
    <HazardButton
      onClick={toggleFrozen}
      title="Unfreeze Sandbox"
      color="#66B9F4"
      hover="#0D7BC9"
    >
      <Lock />
      Frozen
    </HazardButton>
  ) : (
    <HazardButton onClick={toggleFrozen} title="Freeze Sandbox">
      <Unlock />
      Editing
    </HazardButton>
  );
});
