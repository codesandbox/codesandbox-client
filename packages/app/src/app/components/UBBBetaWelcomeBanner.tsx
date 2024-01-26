import * as React from 'react';

import { dashboard as dashboardURLs } from '@codesandbox/common/lib/utils/url-generator';
import { Banner, Button, Stack, Text, Icon } from '@codesandbox/components';

import { useDismissible } from 'app/hooks';
import { SUBSCRIPTION_DOCS_URLS } from 'app/constants';
import { useAppState } from 'app/overmind';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';

export const UBBBetaWelcomeBanner: React.FC = () => {
  const [isBannerDismissed, dismissBanner] = useDismissible(
    'DASHBOARD_UBB_BETA_WELCOME'
  );

  if (isBannerDismissed) {
    return null;
  }

  return (
    <Banner onDismiss={dismissBanner}>
      <Stack gap={2} direction="vertical">
        <Text color="#EDFFA5" size={6} weight="500">
          Welcome to the usage-based billing beta
        </Text>
        <Text>
          This workspace has been added to an early beta experience. You can
          now:
        </Text>
      </Stack>

      <StyledFeatures />

      <Stack
        align="center"
        gap={2}
        css={{
          marginTop: '24px',
        }}
      >
        <Button
          target="_blank"
          autoWidth
          onClick={() => {
            window.open(SUBSCRIPTION_DOCS_URLS.teams.non_trial);
            dismissBanner();
          }}
        >
          Learn more
        </Button>
        <Button autoWidth variant="ghost" onClick={dismissBanner}>
          Dismiss
        </Button>
      </Stack>
    </Banner>
  );
};

const StyledFeatures: React.FC = () => {
  const { activeTeam } = useAppState();
  const { isFree } = useWorkspaceSubscription();

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
        <Icon css={{ flexShrink: 0 }} name="lock" size={16} />
        <Text color="#a6a6a6" size={3}>
          Create private sandboxes and devboxes for free.
        </Text>
      </Stack>

      <Stack gap={2} as="li">
        <Icon css={{ flexShrink: 0 }} name="server" size={16} />
        <Text color="#a6a6a6" size={3}>
          Customize{' '}
          <a href={dashboardURLs.portalVMSettings(activeTeam)}>
            Virtual Machine specs
          </a>{' '}
          for your repositories and Devboxes.
        </Text>
      </Stack>

      <Stack gap={2} as="li">
        <Icon css={{ flexShrink: 0 }} name="sandbox" size={16} />
        <Text color="#a6a6a6" size={3}>
          Run devboxes and repositories on credits.
        </Text>
      </Stack>

      <Stack gap={2} as="li">
        <Icon css={{ flexShrink: 0 }} name="profile" size={16} />
        <Text color="#a6a6a6" size={3}>
          <a href={dashboardURLs.portalOverview(activeTeam)}>
            Add {isFree ? 'up to 5' : 'more'} members
          </a>{' '}
          to your workspace.
        </Text>
      </Stack>
    </Stack>
  );
};
