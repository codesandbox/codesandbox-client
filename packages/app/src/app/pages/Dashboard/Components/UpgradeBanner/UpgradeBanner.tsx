import React from 'react';
import styled from 'styled-components';
import {
  Banner,
  Button,
  Column,
  Element,
  Grid,
  Icon,
  IconNames,
  Link,
  Stack,
  Text,
} from '@codesandbox/components';
import { useCreateCheckout, useDismissible } from 'app/hooks';
import track from '@codesandbox/common/lib/utils/analytics';
import { SUBSCRIPTION_DOCS_URLS } from 'app/constants';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useDashboardVisit } from 'app/hooks/useDashboardVisit';
import { useHistory } from 'react-router';
import { useAppState } from 'app/overmind';

// When flex wraps and the list of features
// is shown below the call to action.
const WRAP_WIDTH = 1320;

export const UpgradeBanner: React.FC = () => {
  const history = useHistory();
  const { userCanStartTrial } = useAppState();
  const [isBannerDismissed, dismissBanner] = useDismissible(
    'DASHBOARD_RECENT_UPGRADE'
  );
  const { isBillingManager, isPersonalSpace } = useWorkspaceAuthorization();
  const {
    isEligibleForTrial,
    isInactiveTeam,
    isLegacyFreeTeam,
    isPro,
  } = useWorkspaceSubscription();

  // Either the workspace is eligible for trial or user is on
  // a personal space and cand start a trial
  const trialAvailable =
    (isPersonalSpace && userCanStartTrial) || isEligibleForTrial;
  const { hasVisited } = useDashboardVisit();

  const [checkout, createCheckout, canCheckout] = useCreateCheckout();

  if (isBannerDismissed || !hasVisited || isPro) {
    return null;
  }

  const renderMainCTA = () => {
    // Dealing with workspaces that can upgrade to Pro
    // Go directly to the stripe page for the checkout
    if (canCheckout && (isInactiveTeam || isLegacyFreeTeam)) {
      return (
        <Button
          disabled={checkout.status === 'loading'}
          css={{ padding: '4px 20px' }}
          onClick={() => {
            if (isLegacyFreeTeam) {
              const event = 'Home Banner - Start trial';
              track(isBillingManager ? event : `${event} - As non-admin`, {
                codesandbox: 'V1',
                event_source: 'UI',
              });
            } else {
              track('Home Banner - Upgrade', {
                codesandbox: 'V1',
                event_source: 'UI',
              });
            }

            createCheckout({
              utm_source: 'restrictions_banner',
            });
          }}
          autoWidth
        >
          {isEligibleForTrial ? 'Start 14-day free trial' : 'Upgrade'}
        </Button>
      );
    }

    // Banner only shows for personal space, to upsell the pro workspaces
    // Takes the user to the /pro page
    if (isPersonalSpace) {
      return (
        <Button
          css={{ padding: '4px 20px' }}
          onClick={() => {
            track('Home Banner - Start trial from personal workspace', {
              codesandbox: 'V1',
              event_source: 'UI',
            });

            history.push('/pro');
          }}
          autoWidth
        >
          {userCanStartTrial ? 'Start 14-day free trial' : 'Upgrade'}
        </Button>
      );
    }

    return null;
  };

  const renderTitle = () => {
    if (isInactiveTeam) {
      return 'Reactivate Pro';
    }

    if (trialAvailable) {
      return 'Try Pro for free';
    }

    return 'Upgrade to Pro';
  };

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
        <StyledTitle color="#EDFFA5" weight="500" block>
          {renderTitle()}
        </StyledTitle>
        <Stack
          css={{
            flexWrap: 'wrap',
          }}
          justify="space-between"
        >
          <Stack direction="vertical" justify="space-between">
            <StyledTitle block>
              Enjoy the full CodeSandbox experience.
            </StyledTitle>
            <Stack
              css={{
                [`@media screen and (max-width: ${WRAP_WIDTH}px)`]: {
                  marginTop: '24px',
                },
              }}
              direction="vertical"
            >
              <Stack align="center" gap={6}>
                {renderMainCTA()}
                <Link
                  href={
                    trialAvailable
                      ? SUBSCRIPTION_DOCS_URLS.teams.trial
                      : SUBSCRIPTION_DOCS_URLS.teams.non_trial
                  }
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
          </Stack>
          <StyledFeatures />
        </Stack>
      </Element>
    </Banner>
  );
};

const StyledTitle = styled(Text)`
  font-size: 24px;
  line-height: 32px;
  letter-spacing: -0.019em;
`;

type Feature = {
  icon: IconNames;
  label: string;
};

const FEATURES_LIST: Feature[] = [
  {
    icon: 'profile',
    label: 'Unlimited editors',
  },
  {
    icon: 'lock',
    label: 'Advanced privacy settings',
  },
  {
    icon: 'sharing',
    label: 'Live sessions',
  },
  {
    icon: 'ai',
    label: 'Full access to AI tools',
  },
  {
    icon: 'sandbox',
    label: 'Private sandboxes',
  },
  {
    icon: 'npm',
    label: 'Private NPM packages',
  },
  {
    icon: 'repository',
    label: 'Private repositories',
  },
  {
    icon: 'server',
    label: '6GiB RAM, 12GB Disk, 4 vCPUs',
  },
];

const StyledFeatures: React.FC = () => {
  return (
    <Grid
      as="ul"
      css={{
        listStyle: 'none',
        margin: '0 24px 0 0',
        padding: 0,

        [`@media screen and (max-width: ${WRAP_WIDTH}px)`]: {
          marginTop: '40px',
        },
      }}
      columnGap={8}
      rowGap={4}
    >
      {FEATURES_LIST.map(f => (
        <Column
          css={{
            // Manually defining the columns width to ensure that the
            // columns have visual alignment on multiple breakpoints.
            gridColumnEnd: 'span 12',

            '@media screen and (min-width: 576px) and (max-width: 885px)': {
              gridColumnEnd: 'span 6',
            },

            '@media screen and (min-width: 886px)': {
              gridColumnEnd: 'span 6',
            },

            '@media screen and (min-width: 1024px)': {
              gridColumnEnd: 'span 4',
            },

            [`@media screen and (min-width: ${WRAP_WIDTH}px)`]: {
              gridColumnEnd: 'span 6',
            },
          }}
          key={f.icon}
          as="li"
        >
          <Stack gap={3}>
            <Icon css={{ flexShrink: 0, color: '#C2C2C2' }} name={f.icon} />
            <Text css={{ color: '#999' }} size={3}>
              {f.label}
            </Text>
          </Stack>
        </Column>
      ))}
    </Grid>
  );
};
