import * as React from 'react';

import { dashboard as dashboardURLs } from '@codesandbox/common/lib/utils/url-generator';
import { Banner, Button, Stack, Text, Icon } from '@codesandbox/components';

import { useDismissible } from 'app/hooks';
import { useAppState } from 'app/overmind';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';

export const UBBBetaWelcomeBanner: React.FC = () => {
  const { activeTeam } = useAppState();
  const [isBannerDismissed, dismissBanner] = useDismissible(
    'DASHBOARD_UBB_BETA_WELCOME'
  );
  const { isPro, isFree } = useWorkspaceSubscription();

  if (isBannerDismissed) {
    return null;
  }

  return (
    <Banner onDismiss={dismissBanner}>
      <Stack gap={2} direction="vertical">
        {isPro ? (
          <>
            <Text color="#EDFFA5" size={6} weight="500">
              Welcome to your new Pro workspace!
            </Text>
            <Text>
              Your Pro plan has been updated to our usage-based system. You can
              now:
            </Text>
          </>
        ) : (
          <>
            <Text color="#EDFFA5" size={6} weight="500">
              Welcome to your new Free workspace!
            </Text>
            <Text>
              Your Free plan has been updated to our usage-based system. You can
              now:
            </Text>
          </>
        )}
      </Stack>

      {isPro ? (
        <StyledProFeatures activeTeam={activeTeam} />
      ) : (
        <StyledFreeFeatures activeTeam={activeTeam} />
      )}

      <Stack
        align="center"
        gap={2}
        css={{
          marginTop: '24px',
        }}
      >
        <Button autoWidth onClick={dismissBanner}>
          Dismiss
        </Button>

        {isFree && (
          <Button
            variant="ghost"
            as="a"
            target="_blank"
            autoWidth
            href={dashboardURLs.upgradeUrl({ workspaceId: activeTeam })}
          >
            View upgrade options
          </Button>
        )}

        <Button
          variant="ghost"
          target="_blank"
          autoWidth
          as="a"
          href="/docs/learn/plans/usage-based-billing"
          onClick={() => {
            dismissBanner();
          }}
        >
          Learn more
        </Button>
      </Stack>
    </Banner>
  );
};

const StyledFreeFeatures: React.FC<{ activeTeam: string }> = ({
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
        <Icon css={{ flexShrink: 0 }} name="lock" size={16} />
        <Text color="#a6a6a6" size={3}>
          Use private Sandboxes, Devboxes and Repositories.
        </Text>
      </Stack>
      <Stack gap={2} as="li">
        <Icon css={{ flexShrink: 0 }} name="people" size={16} />
        <Text color="#a6a6a6" size={3}>
          Collaborate live with{' '}
          <Text as="a" href={dashboardURLs.portalOverview(activeTeam)}>
            up to 5 workspace members.
          </Text>
        </Text>
      </Stack>
      <Stack gap={2} as="li">
        <Icon css={{ flexShrink: 0 }} name="coins" size={16} />
        <Text color="#a6a6a6" size={3}>
          Code in Devboxes using 400 free credits (up to 40 hours) per month.
        </Text>
      </Stack>
      <Stack gap={2} as="li">
        <Icon css={{ flexShrink: 0 }} name="vscode" size={16} />
        <Text color="#a6a6a6" size={3}>
          Use all of our AI features and our{' '}
          <span style={{ whiteSpace: 'nowrap' }}>VS Code</span> extension for
          free.
        </Text>
      </Stack>
    </Stack>
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
