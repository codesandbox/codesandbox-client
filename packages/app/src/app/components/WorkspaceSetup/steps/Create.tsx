import React, { useEffect, useRef, useState } from 'react';
import { useActions, useAppState, useEffects } from 'app/overmind';
import { useHistory } from 'react-router-dom';
import {
  Stack,
  Button,
  Text,
  Link,
  Element,
  Icon,
} from '@codesandbox/components';
import { InputText } from 'app/components/dashboard/InputText';
import track from '@codesandbox/common/lib/utils/analytics';
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
  const [disableButton, setDisableButton] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);

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
        track('Workspace Name Step - Rename Workspace');
      } else {
        const team = await actions.dashboard.createTeam({
          teamName,
        });

        setQueryParam('workspace', team.id);
        setFreshWorkspaceId(team.id);

        track('Workspace Name Step - Create Workspace');

        await actions.dashboard.getTeams();
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
                disabled={disableButton || loading}
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
            loading={loadingButton || loading}
            disabled={disableButton || loading || !!error}
            type="submit"
            size="large"
            autoWidth
          >
            Next
          </Button>
        </Stack>

        <JoinWorkspace
          onStart={() => setLoadingButton(true)}
          onDidFinish={() => setLoadingButton(false)}
          onDidFindWorkspace={() => setDisableButton(true)}
          onRejectWorkspace={() => setDisableButton(false)}
        />

        <Link
          href={docsUrl('/learn/plans/workspace')}
          target="_blank"
          rel="noreferrer"
        >
          <Stack gap={2} align="center">
            <Text>More about teams and workspaces</Text>
            <Icon name="external" size={14} />
          </Stack>
        </Link>
      </Stack>
    </AnimatedStep>
  );
};

const JoinWorkspace: React.FC<{
  onDidFindWorkspace: () => void;
  onRejectWorkspace: () => void;
  onStart: () => void;
  onDidFinish: () => void;
}> = ({ onDidFindWorkspace, onStart, onDidFinish, onRejectWorkspace }) => {
  const [hidden, setHidden] = useState(true);
  const effects = useEffects();
  const actions = useActions();
  const [eligibleWorkspace, setEligibleWorkspace] = useState<{
    id: string;
    name: string;
  }>(null);
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    onStart();

    effects.gql.queries
      .getEligibleWorkspaces({})
      .then(result => {
        const hasEligibleWorkspace = result.me.eligibleWorkspaces.length > 0;
        if (hasEligibleWorkspace) {
          onDidFindWorkspace();
          setEligibleWorkspace(result.me.eligibleWorkspaces[0]);
        }
      })
      .catch(e => {})
      .finally(() => {
        onDidFinish();
      });
  }, []);

  const joinWorkspace = () => {
    setLoading(true);
    effects.gql.mutations
      .joinEligibleWorkspace({
        workspaceId: eligibleWorkspace.id,
      })
      .then(async () => {
        await actions.setActiveTeam({ id: eligibleWorkspace.id });
        await actions.dashboard.getTeams();

        history.push(`/dashboard/recent?workspace=${eligibleWorkspace.id}`);
      });
  };

  if (eligibleWorkspace && hidden) {
    return (
      <>
        <Text css={{ textAlign: 'center' }}>or</Text>
        <Stack
          direction="vertical"
          css={{
            background: '#1A1A1A',
            padding: 18,
            marginLeft: -18,
            marginRight: -18,
            borderRadius: 4,
          }}
        >
          <Text
            margin={0}
            as="h1"
            color="#fff"
            weight="medium"
            fontFamily="everett"
            size={24}
          >
            You have been invited to join the {eligibleWorkspace.name} workspace
          </Text>
          <p>
            Your email matches the domain of the {eligibleWorkspace.name}{' '}
            workspace.
          </p>

          <Stack gap={4} css={{ marginTop: 32 }}>
            <Button
              autoWidth
              loading={loading}
              type="submit"
              size="large"
              onClick={joinWorkspace}
              css={{ flex: 1 }}
            >
              Join workspace
            </Button>

            <Button
              autoWidth
              type="submit"
              size="large"
              css={{ flex: 1 }}
              variant="secondary"
              onClick={() => {
                setHidden(false);
                onRejectWorkspace();
              }}
            >
              Reject
            </Button>
          </Stack>
        </Stack>
      </>
    );
  }

  return null;
};
