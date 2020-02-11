import { useOvermind } from 'app/overmind';
import React, { useEffect, useState } from 'react';

import {
  Collapsible,
  Text,
  Element,
  List,
  ListItem,
  Stack,
} from '@codesandbox/components';
import { DeleteIcon, EditIcon } from './Icons';
import { VarForm } from './VarForm';

export const EnvVars = () => {
  const [editMode, setEditMode] = useState(false);
  const {
    actions: { editor },
    state: {
      editor: { currentSandbox },
    },
  } = useOvermind();

  useEffect(() => {
    editor.fetchEnvironmentVariables();
  }, [editor]);

  const deleteEnv = (name: string) => {
    editor.deleteEnvironmentVariable({ name });
  };
  const envVars = currentSandbox.environmentVariables;

  return (
    <Collapsible title="Secret Keys" defaultOpen>
      <Element paddingX={2}>
        <Text variant="muted" block>
          Secrets are available as environment variables. They are kept private
          and will not be transferred between forks.
        </Text>
      </Element>
      {envVars ? (
        <List marginTop={4}>
          {Object.keys(envVars).map(keyName => (
            <>
              {editMode ? (
                <VarForm
                  name={keyName}
                  value={envVars[keyName]}
                  onCancel={() => setEditMode(false)}
                  onSubmit={({ name, value }) => {
                    editor.updateEnvironmentVariables({ name, value });
                    setEditMode(false);
                  }}
                />
              ) : null}
              <ListItem justify="space-between" marginTop={editMode ? 4 : 0}>
                <Text>{keyName}</Text>
                {!editMode ? (
                  <Stack gap={2}>
                    <EditIcon
                      style={{ cursor: 'pointer' }}
                      onClick={() => setEditMode(true)}
                    />
                    <DeleteIcon
                      style={{ cursor: 'pointer' }}
                      onClick={() => deleteEnv(keyName)}
                    />
                  </Stack>
                ) : null}
              </ListItem>
            </>
          ))}
        </List>
      ) : null}

      <VarForm
        onSubmit={({ name, value }) =>
          editor.updateEnvironmentVariables({ name, value })
        }
      />
    </Collapsible>
  );
};
