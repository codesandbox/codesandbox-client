import React from 'react';
import { useAppState } from 'app/overmind';
import { Button, Stack, Text } from '@codesandbox/components';

export const TeamSubscription: React.FC = () => {
  const { activeTeamInfo } = useAppState();

  // Only teams that never had a subscription are elligible for
  // the 14-day free trial.
  const isElligibleForTrial = activeTeamInfo.subscription === null;

  return (
    <Stack direction="vertical">
      <Text as="p">{activeTeamInfo.name}</Text>
      <Text as="h2">Try Team Pro for free</Text>
      <Button>
        {isElligibleForTrial
          ? 'Start 14 day free trial'
          : 'Proceed to checkout'}
      </Button>
      <Button variant="secondary">Continue with free plan</Button>
    </Stack>
  );
};
