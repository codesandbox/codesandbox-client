import React, { useCallback } from 'react';
import { useOvermind } from 'app/overmind';
import Sandbox from './Sandbox';

import { Padding } from './elements';

const SelectSandboxModal: React.FC = () => {
  const {
    state: {
      profile: {
        isLoadingSandboxes,
        showcasedSandbox: { id },
        userSandboxes,
      },
    },
    actions: {
      profile: { newSandboxShowcaseSelected },
    },
  } = useOvermind();

  const setShowcasedSandbox = useCallback(
    sandboxId => {
      newSandboxShowcaseSelected({ id: sandboxId });
    },
    [newSandboxShowcaseSelected]
  );

  if (isLoadingSandboxes) {
    return <Padding>Loading sandboxes...</Padding>;
  }

  return (
    <div>
      {userSandboxes
        .filter(x => x)
        .map(sandbox => (
          <Sandbox
            active={sandbox.id === id}
            key={sandbox.id}
            sandbox={sandbox}
            setShowcasedSandbox={setShowcasedSandbox}
          />
        ))}
    </div>
  );
};

export default SelectSandboxModal;
