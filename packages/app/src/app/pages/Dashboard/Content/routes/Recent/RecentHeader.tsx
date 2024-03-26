import React from 'react';
import { Stack, Text } from '@codesandbox/components';
import { useWorkspaceLimits } from 'app/hooks/useWorkspaceLimits';
import { RestrictedSandboxes } from 'app/components/StripeMessages/RestrictedSandboxes';
import { TopBanner } from './TopBanner';

export const RecentHeader: React.FC<{ title: string }> = ({ title }) => {
  const { hasReachedSandboxLimit } = useWorkspaceLimits();

  return (
    <Stack direction="vertical" gap={8}>
      {hasReachedSandboxLimit && <RestrictedSandboxes />}
      <TopBanner />

      <Text
        as="h1"
        css={{
          fontWeight: 400,
          fontSize: '24px',
          lineHeight: '32px',
          letterSpacing: '-0.019em',
          color: '#FFFFFF',
          margin: 0,
        }}
      >
        {title}
      </Text>
    </Stack>
  );
};
