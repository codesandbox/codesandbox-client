import React from 'react';
import { Button, Stack, Textarea, Text } from '@codesandbox/components';
import { useAppState } from 'app/overmind';

export const TeamMembers: React.FC<{ onComplete: () => void }> = ({
  onComplete,
}) => {
  const { activeTeamInfo } = useAppState();

  return (
    <Stack direction="vertical">
      <Text as="h2">{activeTeamInfo.name}</Text>
      <Stack as="form" direction="vertical" onSubmit={e => e.preventDefault()}>
        <Text as="label" htmlFor="">
          Invite team members (Insert emails separated by a comma)
        </Text>
        <Textarea autoFocus required />
        <Button type="submit" disabled>
          Invite members
        </Button>
      </Stack>
      <Button onClick={onComplete} variant="secondary">
        Skip
      </Button>
    </Stack>
  );
};
