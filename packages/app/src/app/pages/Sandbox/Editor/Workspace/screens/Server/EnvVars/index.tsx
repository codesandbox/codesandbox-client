import {
  Collapsible,
  Text,
  Element,
  List,
  ListItem,
  Stack,
} from '@codesandbox/components';
import React, { FunctionComponent, useEffect, useState } from 'react';

import { useAppState, useActions } from 'app/overmind';

import { DeleteIcon, EditIcon } from '../Icons';

import { VarForm } from './VarForm';

export const EnvVars: FunctionComponent = () => {
  const {
    deleteEnvironmentVariable,
    fetchEnvironmentVariables,
    updateEnvironmentVariables,
  } = useActions().editor;
  const { currentSandbox } = useAppState().editor;
  const [editMode, setEditMode] = useState(null);

  useEffect(() => {
    fetchEnvironmentVariables();
  }, [fetchEnvironmentVariables]);
  const envVars = currentSandbox.environmentVariables;

  return (
    <Collapsible defaultOpen title="Secret Keys">
      <Element paddingX={2}>
        <Text block variant="muted">
          Secrets are available as environment variables. They are kept private
          and will not be transferred between forks.
        </Text>
      </Element>

      {envVars ? (
        <List paddingTop={4}>
          {Object.keys(envVars).map(keyName =>
            editMode === keyName || !envVars[keyName] ? (
              <VarForm
                name={keyName}
                onCancel={() => setEditMode(null)}
                onSubmit={({ name, value }) => {
                  updateEnvironmentVariables({ name, value });
                  setEditMode(null);
                }}
                value={envVars[keyName]}
              />
            ) : (
              <ListItem justify="space-between" marginTop={editMode ? 4 : 0}>
                <Text>{keyName}</Text>

                <Stack gap={2}>
                  <EditIcon
                    onClick={() => setEditMode(keyName)}
                    style={{ cursor: 'pointer' }}
                  />

                  <DeleteIcon
                    onClick={() => deleteEnvironmentVariable(keyName)}
                    style={{ cursor: 'pointer' }}
                  />
                </Stack>
              </ListItem>
            )
          )}
        </List>
      ) : null}

      <VarForm onSubmit={updateEnvironmentVariables} />
    </Collapsible>
  );
};
