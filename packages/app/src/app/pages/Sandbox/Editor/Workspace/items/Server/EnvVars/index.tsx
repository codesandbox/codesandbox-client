import { useOvermind } from 'app/overmind';
import React, { useEffect } from 'react';

import { WorkspaceInputContainer } from '../../../elements';
import { EnvEntry } from './EnvEntry';
import { EnvModal } from './EnvModal';

export const EnvironmentVariables: React.FC<{}> = props => {
  const {
    actions: { editor },
    state: {
      editor: { currentSandbox },
    },
  } = useOvermind();
  useEffect(() => {
    editor.fetchEnvironmentVariables();
  }, [editor]);

  const createEnv = ({ name, value }) => {
    editor.updateEnvironmentVariables({ name, value });
  };

  const deleteEnv = name => {
    editor.deleteEnvironmentVariable({ name });
  };

  const envVars = currentSandbox.environmentVariables;

  if (!envVars) {
    return (
      <WorkspaceInputContainer>
        <div style={{ fontStyle: 'italic' }}>Loading...</div>
      </WorkspaceInputContainer>
    );
  }

  return (
    <div>
      {Object.keys(envVars).map(keyName => (
        <EnvEntry
          onSubmit={createEnv}
          onDelete={deleteEnv}
          key={keyName}
          name={keyName}
          value={envVars[keyName]}
        />
      ))}

      <WorkspaceInputContainer style={{ flexDirection: 'column' }}>
        <EnvModal onSubmit={createEnv} />
      </WorkspaceInputContainer>
    </div>
  );
};
