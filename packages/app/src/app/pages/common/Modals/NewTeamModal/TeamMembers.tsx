import React from 'react';
import { Button, Stack, Text } from '@codesandbox/components';
import { useAppState } from 'app/overmind';
import { StyledButton } from 'app/components/dashboard/Button';
import { Textarea } from 'app/components/dashboard/Textarea';

export const TeamMembers: React.FC<{ onComplete: () => void }> = ({
  onComplete,
}) => {
  const { activeTeamInfo } = useAppState();

  return (
    <Stack
      align="center"
      direction="vertical"
      gap={6}
      css={{
        paddingTop: '60px',
        paddingBottom: '48px',
        maxWidth: '370px',
        width: '100%',
      }}
    >
      <Text
        as="h2"
        size={32}
        weight="500"
        align="center"
        css={{
          margin: 0,
          color: '#ffffff',
          fontFamily: 'Everett, sans-serif',
          lineHeight: '42px',
          letterSpacing: '-0.01em',
        }}
      >
        {activeTeamInfo.name}
      </Text>
      <Stack
        as="form"
        onSubmit={e => e.preventDefault()}
        direction="vertical"
        gap={6}
        css={{ width: '100%' }}
      >
        <Textarea
          label="Invite team members (Insert emails separated by a comma)"
          name="members"
          id="member"
          autoFocus
          required
          rows={3}
        />
        <StyledButton type="submit" disabled>
          Invite members
        </StyledButton>
      </Stack>
      <Button onClick={onComplete} variant="link">
        Skip
      </Button>
    </Stack>
  );
};
