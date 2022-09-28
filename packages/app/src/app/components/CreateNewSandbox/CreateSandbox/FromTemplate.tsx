import { useAppState } from 'app/overmind';
import React, { useState } from 'react';
import {
  Stack,
  Element,
  Checkbox,
  Icon,
  Button,
} from '@codesandbox/components';

import { SelectContainer, StyledInput, StyledLabel } from './elements';

export interface FromTemplateProps {
  onCancel: () => void;
  onSubmit: () => void;
}

export const FromTemplate: React.FC<FromTemplateProps> = ({
  onCancel,
  onSubmit,
}) => {
  const { hasLogIn, user, dashboard, activeTeam } = useAppState();

  // TODO: Set generated name as default value if we can / need
  // otherwise tell the user if empty we generate a name
  const [sandboxName, setSandboxName] = useState<string>();
  const [createGitRepo, setCreateGitRepo] = useState<boolean>(false);
  const [selectedTeam, setSelectedTeam] = useState<string>(activeTeam);

  return (
    <Stack direction="vertical" gap={7} css={{ width: '100%' }}>
      <Element as="h2" css={{ fontSize: '16px', margin: 0 }}>
        New from template
      </Element>

      <form
        css={{ width: '100%' }}
        onSubmit={e => {
          e.preventDefault();
          onSubmit(); // TODO: Pass params
        }}
      >
        <Stack direction="vertical" gap={6}>
          <Stack direction="vertical" gap={2}>
            <StyledLabel htmlFor="sb-name">Sandbox name</StyledLabel>
            <StyledInput
              id="sb-name"
              type="text"
              value={sandboxName}
              onChange={e => setSandboxName(e.target.value)}
              aria-describedBy="name-desc"
            />
            <Element
              as="span"
              id="name-desc"
              css={{ color: '#999999', fontSize: '12px' }}
            >
              Leaving the field empty will generate a random name.
            </Element>
          </Stack>

          <Checkbox
            onChange={e => {
              setCreateGitRepo(e.target.checked);
            }}
            checked={createGitRepo}
            label="Create Git repository"
            disabled={!hasLogIn || !user || !dashboard.teams}
          />

          {createGitRepo ? (
            <SelectContainer>
              <Icon name="github" />
              <select
                value={selectedTeam}
                onChange={e => {
                  setSelectedTeam(e.target.value);
                }}
                disabled={!hasLogIn || !user || !dashboard.teams}
              >
                {dashboard.teams.map(team => (
                  <option key={team.id}>{team.name}</option>
                ))}
              </select>
            </SelectContainer>
          ) : null}
        </Stack>

        <Stack gap={2}>
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            css={{ width: 'auto' }}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" css={{ width: 'auto' }}>
            Create Sandbox
          </Button>
        </Stack>
      </form>
    </Stack>
  );
};
