import React, { FunctionComponent } from 'react';
import { useOvermind } from 'app/overmind';
import { Padding } from './elements';

import Sandbox from './Sandbox';

export const SelectSandboxModal: FunctionComponent = () => {
  const {
    state: {
      profile: {
        isLoadingSandboxes,
        showcasedSandbox,
        userSandboxes
      }
    },
    actions: {
      profile: { newSandboxShowcaseSelected }
    }
  } = useOvermind();

  if (isLoadingSandboxes)
    return <Padding>Loading sandboxes...</Padding>;

  const currentShowcasedSandboxId = showcasedSandbox && showcasedSandbox.id;

  return (
    <div>
      {userSandboxes
        .filter(x => x)
        .map(sandbox => (
          <Sandbox
            active={sandbox.id === currentShowcasedSandboxId}
            key={sandbox.id}
            sandbox={sandbox}
            setShowcasedSandbox={id => newSandboxShowcaseSelected({ id })}
          />
        ))}
    </div>
  );
};
