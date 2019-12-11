import React, { FunctionComponent } from 'react';

import { useOvermind } from 'app/overmind';

import { Padding } from './elements';
import { Sandbox } from './Sandbox';

export const SelectSandboxModal: FunctionComponent = () => {
  const {
    state: {
      profile: { isLoadingSandboxes, userSandboxes },
    },
  } = useOvermind();

  if (isLoadingSandboxes) {
    return <Padding>Loading sandboxes...</Padding>;
  }

  return (
    <div>
      {userSandboxes.filter(Boolean).map(sandbox => (
        <Sandbox key={sandbox.id} sandbox={sandbox} />
      ))}
    </div>
  );
};
