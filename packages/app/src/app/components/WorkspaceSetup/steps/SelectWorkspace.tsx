import React, { useState } from 'react';
import { Button, Stack } from '@codesandbox/components';
import { useActions, useAppState } from 'app/overmind';
import { SubscriptionStatus } from 'app/graphql/types';
import { useURLSearchParams } from 'app/hooks/useURLSearchParams';
import { InputSelect } from 'app/components/dashboard/InputSelect';
import { useHistory } from 'react-router-dom';
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
  const { dashboard, activeTeam } = useAppState();
  const history = useHistory();
  const { setActiveTeam } = useActions();
  const { setQueryParam } = useURLSearchParams();

  const workspacesEligibleForUpgrade = dashboard.teams.filter(
    t =>
      !(
        t.subscription?.status === SubscriptionStatus.Active ||
        t.subscription?.status === SubscriptionStatus.Trialing
      )
  );

  const [workspaceId, setWorkspaceId] = useState<string>(activeTeam);

  const handleSubmit = e => {
    e.preventDefault();
    setActiveTeam({ id: workspaceId });
    setQueryParam('workspace', workspaceId);
    onNextStep();
  };

  if (workspacesEligibleForUpgrade.length === 0) {
    // No eligible workspace to upgrade
    history.replace('/create-workspace');
  }

  return (
    <AnimatedStep>
      <Stack direction="vertical" gap={6} css={{ width: '350px' }}>
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
            defaultValue={workspaceId}
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
