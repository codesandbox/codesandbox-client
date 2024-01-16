import React, { useState } from 'react';
import { Button, Stack } from '@codesandbox/components';
import { useActions, useAppState } from 'app/overmind';
import { SubscriptionStatus, TeamMemberAuthorization } from 'app/graphql/types';
import { useURLSearchParams } from 'app/hooks/useURLSearchParams';
import { InputSelect } from 'app/components/dashboard/InputSelect';
import { useHistory, useLocation } from 'react-router-dom';
import { StepHeader } from '../StepHeader';
import { AnimatedStep } from '../elements';
import { StepProps } from '../types';

export const SelectWorkspace: React.FC<StepProps> = ({
  onNextStep,
  onPrevStep,
  onDismiss,
  currentStep,
  numberOfSteps,
}) => {
  const { dashboard, activeTeam, user } = useAppState();
  const history = useHistory();
  const { setActiveTeam } = useActions();
  const { setQueryParam } = useURLSearchParams();
  const { pathname } = useLocation();
  const isSigningUpForBeta = pathname.includes('signup-beta');

  const workspacesEligibleForUpgrade = dashboard.teams
    .filter(
      t =>
        // Only teams where you are admin
        t.userAuthorizations.find(
          ua =>
            ua.userId === user?.id &&
            ua.authorization === TeamMemberAuthorization.Admin
        ) &&
        // And teams that are not Pro
        !(
          t.subscription?.status === SubscriptionStatus.Active ||
          t.subscription?.status === SubscriptionStatus.Trialing
        )
    )
    .filter(t =>
      isSigningUpForBeta
        ? // If this is the signup for ubb beta, show only workspaces that are not in ubb
          // Otherwise, show only workspaces that are ubb
          !t.featureFlags.ubbBeta
        : t.featureFlags.ubbBeta
    );

  const [workspaceId, setWorkspaceId] = useState<string>(activeTeam);

  const handleSubmit = e => {
    e.preventDefault();
    setActiveTeam({ id: workspaceId });
    setQueryParam('workspace', workspaceId);
    onNextStep();
  };

  if (user && workspacesEligibleForUpgrade.length === 0) {
    // No eligible workspace to upgrade
    history.replace('/create-workspace');
  }

  if (user && workspacesEligibleForUpgrade.length === 1) {
    // Skip selection if a single workspace can be upgraded
    setActiveTeam({ id: workspaceId });
    setQueryParam('workspace', workspaceId);
    onNextStep();
  }

  return (
    <AnimatedStep>
      <Stack direction="vertical" gap={6} css={{ maxWidth: '350px' }}>
        <StepHeader
          onPrevStep={onPrevStep}
          onDismiss={onDismiss}
          currentStep={currentStep}
          numberOfSteps={numberOfSteps}
          title="Choose workspace"
        />
        <Stack
          as="form"
          onSubmit={handleSubmit}
          direction="vertical"
          gap={6}
          css={{ width: '100%' }}
        >
          <InputSelect
            id="workspace"
            name="workspace"
            label="Select the workspace you want to upgrade"
            onChange={ev => setWorkspaceId(ev.target.value)}
            options={workspacesEligibleForUpgrade.map(w => ({
              label: w.name,
              value: w.id,
            }))}
          />

          <Button type="submit" size="large">
            Next
          </Button>
        </Stack>
      </Stack>
    </AnimatedStep>
  );
};
