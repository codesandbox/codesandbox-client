import React, { useEffect, useState } from 'react';
import { useActions, useAppState } from 'app/overmind';
import { Stack, Text, Link, Element, Icon } from '@codesandbox/components';
import { InputText } from 'app/components/dashboard/InputText';
import { StyledButton } from 'app/components/dashboard/Button';
import { docsUrl } from '@codesandbox/common/lib/utils/url-generator';
import { useHistory } from 'react-router-dom';
import { StepProps } from '../types';

export const Create: React.FC<StepProps> = ({ onNextStep }) => {
  const { dashboard, activeTeam, activeTeamInfo } = useAppState();
  const actions = useActions();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [existingTeamError, setExistingTeamError] = useState(false);

  const searchParams = new URLSearchParams(history.location.search);
  const urlWorkspaceId = searchParams.get('workspace');
  const teamIsAlreadyCreated = !!urlWorkspaceId;

  useEffect(() => {
    if (activeTeam !== urlWorkspaceId) {
      actions.setActiveTeam({ id: urlWorkspaceId });
    }
  }, [urlWorkspaceId, activeTeam]);

  const onSubmit = async event => {
    event.preventDefault();
    const teamName = event.target.name.value?.trim();

    if (!teamName) {
      return;
    }

    setError(null);
    setLoading(true);

    try {
      if (teamIsAlreadyCreated) {
        actions.dashboard.setTeamInfo({
          name: teamName,
          description: null,
          file: null,
        });
      } else {
        const team = await actions.dashboard.createTeam({
          teamName,
        });

        history.replace(`${history.location.pathname}?workspace=${team.id}`);
        await actions.setActiveTeam({ id: team.id });
      }
    } catch {
      setError('There was a problem saving your workspace');
    } finally {
      setLoading(false);
    }

    onNextStep();
  };

  const handleInput = e => {
    const { value } = e.target;

    // Get the input and remove any whitespace from both ends.
    const trimmedName = value?.trim() ?? '';

    // Validate if the name input is filled with whitespaces.
    if (trimmedName) {
      e.target.setCustomValidity('');
    } else {
      e.target.setCustomValidity('Workspace name is required.');
    }

    // Check if there's any team with the same name.
    setExistingTeamError(
      Boolean(dashboard.teams.find(team => team.name === trimmedName))
    );
  };

  if (teamIsAlreadyCreated && !activeTeamInfo) {
    return null; // TODO: Loader
  }

  return (
    <Stack align="center" direction="vertical" gap={6}>
      <Stack align="center" direction="vertical" gap={2}>
        <Text
          as="h2"
          size={32}
          weight="500"
          align="center"
          css={{
            color: '#ffffff',
            fontFamily: 'Everett, sans-serif',
          }}
        >
          Create workspace
        </Text>
        <Text color="#999">Let&apos;s give your workspace a name</Text>
      </Stack>
      <Stack
        as="form"
        onSubmit={onSubmit}
        direction="vertical"
        gap={6}
        css={{ width: '100%' }}
      >
        <Stack gap={2} direction="vertical">
          <InputText
            label="Workspace name"
            placeholder="My workspace"
            id="teamname"
            name="name"
            required
            autoFocus
            hideLabel
            defaultValue={teamIsAlreadyCreated ? activeTeamInfo.name : ''}
            onChange={handleInput}
          />

          {existingTeamError && (
            <Text size={3} variant="danger">
              Name already taken, please choose another one.
            </Text>
          )}

          {error && (
            <Text size={3} variant="danger">
              {error}
            </Text>
          )}
        </Stack>

        <StyledButton
          loading={loading}
          disabled={loading || existingTeamError}
          type="submit"
        >
          Next
        </StyledButton>
      </Stack>
      <Element paddingTop={10}>
        <Link
          href={docsUrl('/learn/plans/workspace')}
          target="_blank"
          rel="noreferrer"
        >
          <Stack
            css={{
              color: '#999999',
            }}
            gap={3}
            justify="center"
          >
            <Text size={2}>More about teams and workspaces</Text>
            <Icon name="external" size={16} />
          </Stack>
        </Link>
      </Element>
    </Stack>
  );
};
