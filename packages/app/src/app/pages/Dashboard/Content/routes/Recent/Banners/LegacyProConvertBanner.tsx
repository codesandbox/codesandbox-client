import React from 'react';
import {
  Banner,
  Button,
  Link,
  Element,
  Stack,
  Text,
} from '@codesandbox/components';
import { Link as RouterLink } from 'react-router-dom';
import track from '@codesandbox/common/lib/utils/analytics';
import { upgradeUrl } from '@codesandbox/common/lib/utils/url-generator/dashboard';
import { useAppState } from 'app/overmind';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { docsUrl } from '@codesandbox/common/lib/utils/url-generator';
import { BannerProps } from './types';

export const LegacyProConvertBanner: React.FC<BannerProps> = ({
  onDismiss,
}) => {
  const { activeTeam } = useAppState();
  const { isAdmin } = useWorkspaceAuthorization();

  return (
    <Banner
      onDismiss={() => {
        track('Legacy Pro Convert Banner - Dismiss');
        onDismiss();
      }}
    >
      <Element css={{ overflow: 'hidden' }}>
        <Stack gap={8} direction="vertical">
          <Stack gap={2} direction="vertical">
            <Text color="#EDFFA5" size={6} weight="500">
              Pay only for what you use
            </Text>
            <Text css={{ textWrap: 'balance' }}>
              Switch to one of our new Pro plans to get usage-based pricing
              (instead of seat-based), more virtual machine options, adjustable
              spending controls, and access to storage add-ons.
            </Text>
          </Stack>

          <Stack align="center" gap={6}>
            {isAdmin && (
              <RouterLink
                to={upgradeUrl({
                  workspaceId: activeTeam,
                  source: 'home_banner',
                })}
              >
                <Button
                  onClick={() => {
                    track('Legacy Pro Convert Banner - Upgrade');
                    onDismiss();
                  }}
                  autoWidth
                >
                  Upgrade to Pro
                </Button>
              </RouterLink>
            )}
            {isAdmin && (
              <Button
                as="a"
                href="mailto:support@codesandbox.io?subject=Convert to usage based billing"
                autoWidth
              >
                Contact us
              </Button>
            )}
            <Link
              href={docsUrl(
                '/learn/plans/workspace#managing-teams-and-subscriptions'
              )}
              onClick={() => {
                track('Legacy Pro Convert Banner - Learn more');
              }}
            >
              <Text size={3}>Learn more</Text>
            </Link>
          </Stack>
        </Stack>
      </Element>
    </Banner>
  );
};
