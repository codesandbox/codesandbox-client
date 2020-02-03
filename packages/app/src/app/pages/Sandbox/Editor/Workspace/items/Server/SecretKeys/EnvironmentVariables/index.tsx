import { useOvermind } from 'app/overmind';
import React, { FunctionComponent, useEffect } from 'react';

import { WorkspaceInputContainer } from '../../../../elements';

import { EnvModalContainer, LoadingContainer } from './elements';
import { EnvEntry } from './EnvEntry';
import { EnvModal } from './EnvModal';

export const EnvironmentVariables: FunctionComponent = () => {
  const {
    actions: {
      editor: { fetchEnvironmentVariables, updateEnvironmentVariables },
    },
    state: {
      editor: {
        currentSandbox: { environmentVariables },
      },
    },
  } = useOvermind();

  useEffect(() => {
    fetchEnvironmentVariables();
  }, [fetchEnvironmentVariables]);

  if (!environmentVariables) {
    return (
      <WorkspaceInputContainer>
        <LoadingContainer>Loading...</LoadingContainer>
      </WorkspaceInputContainer>
    );
  }

  return (
    <div>
      {Object.entries(environmentVariables).map(([key, value]) => (
        <EnvEntry key={key} name={key} value={value} />
      ))}

      <EnvModalContainer>
        <EnvModal onSubmit={updateEnvironmentVariables} />
      </EnvModalContainer>
    </div>
  );
};
