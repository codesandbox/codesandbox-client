import { useAppState } from 'app/overmind';
import React, { useState } from 'react';
import {
  Badge,
  Stack,
  Element,
  Checkbox,
  Icon,
  Button,
  Text,
} from '@codesandbox/components';

import { StyledSelect } from './elements';
import { CreateSandboxParams } from './types';
import { InputText } from '../dashboard/InputText';

interface FromTemplateProps {
  isV2: boolean;
  onCancel: () => void;
  onSubmit: (params: CreateSandboxParams) => void;
}

export const FromTemplate: React.FC<FromTemplateProps> = ({
  isV2,
  onCancel,
  onSubmit,
}) => {
  const { hasLogIn, user, dashboard, activeTeam } = useAppState();

  // TODO: Set generated name as default value if we can / need
  // otherwise tell the user if empty we generate a name
  const [sandboxName, setSandboxName] = useState<string>();

  const createRepo = false;
  // TODO: Enable when checkbox is active again
  // const [createRepo, setCreateRepo] = useState<boolean>(false);
  const [selectedTeam, setSelectedTeam] = useState<string>(activeTeam);

  return (
    <Stack
      direction="vertical"
      gap={7}
      css={{ width: '100%', height: '100%', paddingBottom: '24px' }}
    >
      <Stack css={{ justifyContent: 'space-between' }}>
        <Text
          as="h2"
          css={{
            fontSize: '16px',
            fontWeight: 500,
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          New from template
        </Text>
        {isV2 && <Badge icon="cloud">Cloud</Badge>}
      </Stack>

      <Element
        as="form"
        css={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          justifyContent: 'space-between',
        }}
        onSubmit={e => {
          e.preventDefault();
          onSubmit({
            name: sandboxName,
            createRepo,
            githubOwner: selectedTeam,
          });
        }}
      >
        <Stack direction="vertical" gap={6}>
          <Stack direction="vertical" gap={2}>
            <InputText
              autoFocus
              id="sb-name"
              name="sb-name"
              type="text"
              label="Sandbox name"
              value={sandboxName}
              onChange={e => setSandboxName(e.target.value)}
              aria-describedby="name-desc"
            />
            <Element
              as="span"
              id="name-desc"
              css={{ color: '#999999', fontSize: '12px' }}
            >
              Leaving this field empty will generate a random name.
            </Element>
          </Stack>

          <Checkbox
            id="sb-repo"
            disabled
            checked={createRepo}
            label={
              <Text
                css={{
                  fontSize: 13,
                  display: 'block',
                  marginTop: 2,
                  marginLeft: 4,
                  color: '#999999',
                  lineHeight: '16px',
                }}
              >
                Create git repository (coming soon)
              </Text>
            }
          />

          {createRepo ? (
            <StyledSelect
              icon={() => <Icon css={{ marginLeft: 8 }} name="github" />}
              onChange={e => {
                setSelectedTeam(e.target.value);
              }}
              value={selectedTeam}
              disabled={!hasLogIn || !user || !dashboard.teams}
            >
              {dashboard.teams.map(team => (
                <option key={team.id}>{team.name}</option>
              ))}
            </StyledSelect>
          ) : null}
        </Stack>

        <Stack css={{ justifyContent: 'flex-end' }}>
          <Stack gap={2}>
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              css={{ width: 'auto' }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              css={{ width: 'auto', paddingRight: 24, paddingLeft: 24 }}
            >
              Create Sandbox
            </Button>
          </Stack>
        </Stack>
      </Element>
    </Stack>
  );
};
