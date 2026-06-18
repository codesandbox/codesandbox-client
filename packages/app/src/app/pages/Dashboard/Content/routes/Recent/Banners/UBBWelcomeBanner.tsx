import * as React from 'react';
import {
  dashboard as dashboardURLs,
  docsUrl,
} from '@codesandbox/common/lib/utils/url-generator';
import { Banner, Button, Stack, Text, Icon } from '@codesandbox/components';

import { useAppState } from 'app/overmind';
import track from '@codesandbox/common/lib/utils/analytics';
import { BannerProps } from './types';

export const UBBWelcomeBanner: React.FC<BannerProps> = ({ onDismiss }) => {
  const { activeTeam } = useAppState();

  return (
    <Banner
      onDismiss={() => {
        track('UBB Welcome Banner - Dismiss');
        onDismiss();
      }}
    >
      <Stack gap={2} direction="vertical">
        <Text color="#EDFFA5" size={6} weight="500">
          Welcome to your new Pro workspace!
        </Text>
        <Text>
          Your Pro plan has been updated to our usage-based system. You can now:
        </Text>
      </Stack>

      <StyledProFeatures activeTeam={activeTeam} />

      <Stack align="center" gap={2}>
        <Button
          variant="ghost"
          autoWidth
          as="a"
          onClick={() => {
            track('UBB Welcome Banner - Learn more');
          }}
          href={docsUrl('/learn/plans/usage-based-billing')}
        >
          Learn more
        </Button>
      </Stack>
    </Banner>
  );
};

const StyledProFeatures: React.FC<{ activeTeam: string }> = ({
  activeTeam,
}) => {
  return (
    <Stack
      gap={6}
      as="ul"
      css={{
        listStyle: 'none',
        padding: '12px 0 24px 0',
        maxWidth: 960,
      }}
    >
      <Stack gap={2} as="li">
        <Icon css={{ flexShrink: 0 }} name="people" size={16} />
        <Text color="#a6a6a6" size={3}>
          <Text as="a" href={dashboardURLs.portalOverview(activeTeam)}>
            Add up to 20 workspace members
          </Text>{' '}
          at no extra cost.
        </Text>
      </Stack>
      <Stack gap={2} as="li">
        <Icon css={{ flexShrink: 0 }} name="machine" size={16} />
        <Text color="#a6a6a6" size={3}>
          <Text as="a" href={dashboardURLs.portalVMSettings(activeTeam)}>
            Choose from different VM sizes
          </Text>{' '}
          (up to 16 vCPUs + 32 GB RAM).
        </Text>
      </Stack>
      <Stack gap={2} as="li">
        <Icon css={{ flexShrink: 0 }} name="coins" size={16} />
        <Text color="#a6a6a6" size={3}>
          Code in Devboxes using credits (purchase more as needed).
        </Text>
      </Stack>
      <Stack gap={2} as="li">
        <Icon css={{ flexShrink: 0 }} name="sandbox" size={16} />
        <Text color="#a6a6a6" size={3}>
          Create unlimited Devboxes and personal Sandbox drafts.
        </Text>
      </Stack>
    </Stack>
  );
};
