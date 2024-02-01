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

export const FreeUpgradeBanner: React.FC<BannerProps> = ({ onDismiss }) => {
  const { activeTeam } = useAppState();
  const { isAdmin } = useWorkspaceAuthorization();

  return (
    <Banner
      onDismiss={() => {
        track('Pro Upsell Banner - Dismiss');
        onDismiss();
      }}
    >
      <Element css={{ overflow: 'hidden' }}>
        <Stack gap={8} direction="vertical">
          <Stack gap={2} direction="vertical">
            <Text color="#EDFFA5" size={6} weight="500">
              Get the full CodeSandbox experience
            </Text>
            <Text>
              Go Pro to unlock better VMs, more runtime hours, more sandboxes
              and more workspace members.
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
                    track('Pro Upsell Banner - Upgrade');
                    onDismiss();
                  }}
                  autoWidth
                >
                  Upgrade to Pro
                </Button>
              </RouterLink>
            )}
            <Link
              href={docsUrl(
                '/learn/plans/workspace#managing-teams-and-subscriptions'
              )}
              target="_blank"
              onClick={() => {
                track('Pro Upsell Banner - Learn more');
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
