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
import { useDismissible } from 'app/hooks';
import track from '@codesandbox/common/lib/utils/analytics';
import { SUBSCRIPTION_DOCS_URLS } from 'app/constants';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useDashboardVisit } from 'app/hooks/useDashboardVisit';
import { proUrl } from '@codesandbox/common/lib/utils/url-generator/dashboard';
import { useAppState } from 'app/overmind';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';

export const UbbUpgradeBanner: React.FC = () => {
  const [isBannerDismissed, dismissBanner] = useDismissible(
    'DASHBOARD_RECENT_UBB_UPGRADE'
  );
  const { activeTeam } = useAppState();
  const { isPro } = useWorkspaceSubscription();
  const { isAdmin } = useWorkspaceAuthorization();

  const { hasVisited } = useDashboardVisit();

  if (isBannerDismissed || !hasVisited || isPro) {
    return null;
  }

  return (
    <Banner
      onDismiss={() => {
        track('Home Banner - Dismiss', {
          codesandbox: 'V1',
          event_source: 'UI',
        });

        dismissBanner();
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
                to={proUrl({
                  workspaceId: activeTeam,
                  source: 'home_banner',
                  ubbBeta: true,
                })}
              >
                <Button
                  as="a"
                  onClick={() => {
                    track('Home Banner - Upgrade', {
                      codesandbox: 'V1',
                      event_source: 'UI',
                    });
                  }}
                  autoWidth
                >
                  Upgrade to Pro
                </Button>
              </RouterLink>
            )}
            <Link
              href={SUBSCRIPTION_DOCS_URLS.teams.non_trial}
              target="_blank"
              onClick={() => {
                track('Home Banner - Learn More', {
                  codesandbox: 'V1',
                  event_source: 'UI',
                });
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
