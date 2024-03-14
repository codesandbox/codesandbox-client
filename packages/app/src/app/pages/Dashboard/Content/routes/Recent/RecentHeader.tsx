import React from 'react';
import track from '@codesandbox/common/lib/utils/analytics';
import { Stack, Text } from '@codesandbox/components';
import {
  DEVBOX_BUTTON_DESCRIPTION,
  IMPORT_BUTTON_DESCRIPTION,
  SANDBOX_BUTTON_DESCRIPTION,
} from 'app/components/Create/utils/constants';
import { LargeCTAButton } from 'app/components/dashboard/LargeCTAButton';
import { useActions } from 'app/overmind';
import { EmptyPage } from 'app/pages/Dashboard/Components/EmptyPage';
import { useWorkspaceLimits } from 'app/hooks/useWorkspaceLimits';
import { RestrictedSandboxes } from 'app/components/StripeMessages/RestrictedSandboxes';
import { TopBanner } from './TopBanner';

export const RecentHeader: React.FC<{ title: string }> = ({ title }) => {
  const actions = useActions();
  const { isFrozen, hasReachedSandboxLimit } = useWorkspaceLimits();

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
