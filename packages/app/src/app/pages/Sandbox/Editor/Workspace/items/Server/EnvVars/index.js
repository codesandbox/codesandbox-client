import React, { useEffect } from 'react';
import { inject, observer } from 'app/componentConnectors';

import { WorkspaceInputContainer } from '../../../elements';

import { EnvEntry } from './EnvEntry';
import { EnvModal } from './EnvModal';

const EnvironmentVariablesComponent = ({ signals: { editor }, store }) => {
  useEffect(() => {
    editor.fetchEnvironmentVariables();
  }, [editor]);

  const createEnv = ({ name, value }) => {
    editor.updateEnvironmentVariables({ name, value });
  };

  const deleteEnv = name => {
    editor.deleteEnvironmentVariable({ name });
  };

  const envVars = store.editor.currentSandbox.environmentVariables;

  if (!envVars) {
    return (
      <WorkspaceInputContainer>
        <div style={{ fontStyle: 'italic' }}>Loading...</div>
      </WorkspaceInputContainer>
    );
  }

  return (
    <div>
      {Object.keys(envVars.toJSON ? envVars.toJSON() : envVars).map(keyName => (
        <EnvEntry
          onSubmit={createEnv}
          onDelete={deleteEnv}
          key={keyName}
          name={keyName}
          value={
            typeof envVars.get === 'function'
              ? envVars.get(keyName)
              : envVars[keyName]
          }
        />
      ))}

      <WorkspaceInputContainer style={{ flexDirection: 'column' }}>
        <EnvModal onSubmit={createEnv} />
      </WorkspaceInputContainer>
    </div>
  );
};

export const EnvironmentVariables = inject('store', 'signals')(
  observer(EnvironmentVariablesComponent)
);
