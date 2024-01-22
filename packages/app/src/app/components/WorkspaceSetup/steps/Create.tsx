import React, { useEffect, useRef, useState } from 'react';
import { useActions, useAppState } from 'app/overmind';
import {
  Stack,
  Button,
  Text,
  Link,
  Element,
  Icon,
} from '@codesandbox/components';
import { InputText } from 'app/components/dashboard/InputText';
import { docsUrl } from '@codesandbox/common/lib/utils/url-generator';
import { useURLSearchParams } from 'app/hooks/useURLSearchParams';
import { useGlobalPersistedState } from 'app/hooks/usePersistedState';
import { StepProps } from '../types';
import { StepHeader } from '../StepHeader';
import { AnimatedStep } from '../elements';

export const Create: React.FC<StepProps> = ({
  onNextStep,
  onPrevStep,
  onDismiss,
  currentStep,
  numberOfSteps,
}) => {
  const { dashboard, activeTeam, activeTeamInfo } = useAppState();
  const actions = useActions();
  const [, setFreshWorkspaceId] = useGlobalPersistedState<string>(
    'FRESH_WORKSPACE_ID',
    undefined
  );
  const { getQueryParam, setQueryParam } = useURLSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const urlWorkspaceId = getQueryParam('workspace');
  const teamIsAlreadyCreated = !!urlWorkspaceId;

  useEffect(() => {
    if (activeTeam !== urlWorkspaceId) {
      actions.setActiveTeam({ id: urlWorkspaceId });
    }
  }, [urlWorkspaceId, activeTeam]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.setCustomValidity(error);
    }
  }, [error]);

  const onSubmit = async event => {
    event.preventDefault();
    const teamName = event.target.name.value?.trim();

    if (!teamName) {
      return;
    }

    setError('');
    setLoading(true);

    try {
      if (teamIsAlreadyCreated) {
        actions.dashboard.renameCurrentTeam({ name: teamName });
      } else {
        const team = await actions.dashboard.createTeam({
          teamName,
        });

        setQueryParam('workspace', team.id);
        setFreshWorkspaceId(team.id);
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

    setError('');

    // Get the input and remove any whitespace from both ends.
    const trimmedName = value?.trim() ?? '';

    // Validate if the name input is filled with whitespaces.
    if (!trimmedName) {
      setError('Workspace name cannot be empty.');
    }

    // Check if there's any team with the same name.
    if (
      dashboard.teams.some(
        team => team.name === trimmedName && team.id !== activeTeam
      )
    ) {
      setError('You already have a workspace with this name.');
    }
  };

  if (teamIsAlreadyCreated && !activeTeamInfo) {
    return null;
  }

  return (
    <AnimatedStep>
      <Stack direction="vertical" gap={8} css={{ width: '400px' }}>
        <StepHeader
          onPrevStep={onPrevStep}
          onDismiss={onDismiss}
          currentStep={currentStep}
          numberOfSteps={numberOfSteps}
          title="Name your workspace"
        />
        <Stack
          as="form"
          onSubmit={onSubmit}
          direction="vertical"
          gap={4}
          css={{ width: '100%' }}
        >
          <Stack gap={2} direction="vertical">
            <Element css={{ position: 'relative', paddingBottom: '24px' }}>
              <InputText
                label="Workspace name"
                id="teamname"
                name="name"
                required
                autoComplete="off"
                autoFocus
                defaultValue={teamIsAlreadyCreated ? activeTeamInfo.name : ''}
                onChange={handleInput}
                ref={inputRef}
              />

              {error && (
                <Text
                  css={{ position: 'absolute', bottom: 0, left: 0 }}
                  variant="danger"
                >
                  {error}
                </Text>
              )}
            </Element>
          </Stack>

          <Button
            loading={loading}
            disabled={loading || !!error}
            type="submit"
            size="large"
          >
            Next
          </Button>
        </Stack>
        <Link
          href={docsUrl('/learn/plans/workspace')}
          target="_blank"
          rel="noreferrer"
        >
          <Stack gap={1} align="center">
            <Text>More about teams and workspaces</Text>
            <Icon name="external" size={16} />
          </Stack>
        </Link>
      </Stack>
    </AnimatedStep>
  );
};
