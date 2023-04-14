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
import { useDismissible, useGetCheckoutURL } from 'app/hooks';
import { dashboard } from '@codesandbox/common/lib/utils/url-generator';
import track from '@codesandbox/common/lib/utils/analytics';
import { SUBSCRIPTION_DOCS_URLS } from 'app/constants';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useDashboardVisit } from 'app/hooks/useDashboardVisit';
import { useActions, useAppState } from 'app/overmind';
import { getTrialEligibleTeams } from 'app/utils/teams';

const StyledTitle = styled(Text)`
  font-size: 24px;
  line-height: 32px;
  letter-spacing: -0.019em;
`;

// When flex wraps and the list of features
// is shown below the call to action.
const WRAP_WIDTH = 1320;

type Feature = {
  icon: IconNames;
  label: string;
};
const FEATURES_LIST: Feature[] = [
  {
    icon: 'sandbox',
    label: 'Unlimited private sandboxes',
  },
  {
    icon: 'server',
    label: '6GB RAM, 12GB Disk, 4 vCPUs',
  },
  {
    icon: 'repository',
    label: 'Unlimited private repositories',
  },
  {
    icon: 'sharing',
    label: 'Live sessions',
  },
  {
    icon: 'npm',
    label: 'Private NPM packages',
  },
  {
    icon: 'profile',
    label: 'Up to 20 editors',
  },
];

const Features: React.FC = () => {
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
          <Stack css={{ color: '#999' }} gap={3}>
            <Icon css={{ flexShrink: 0 }} name={f.icon} />
            <Text size={3}>{f.label}</Text>
          </Stack>
        </Column>
      ))}
    </Grid>
  );
};

export const UpgradeBanner: React.FC = () => {
  const {
    activeTeam,
    dashboard: { teams },
    personalWorkspaceId,
  } = useAppState();
  const { modalOpened, openCreateTeamModal } = useActions();
  const [isBannerDismissed, dismissBanner] = useDismissible(
    'DASHBOARD_RECENT_UPGRADE'
  );
  const { isBillingManager, isPersonalSpace } = useWorkspaceAuthorization();
  const { isEligibleForTrial } = useWorkspaceSubscription();
  const { hasVisited } = useDashboardVisit();

  const checkoutUrl = useGetCheckoutURL({
    success_path: dashboard.recent(activeTeam),
    cancel_path: dashboard.recent(activeTeam),
  });

  if (isBannerDismissed || !hasVisited) {
    return null;
  }

  const trialEligibleTeams = getTrialEligibleTeams({
    teams,
    personalWorkspaceId,
  });

  const renderMainCTA = () => {
    if (isPersonalSpace) {
      return (
        <Button
          css={{ padding: '4px 20px' }}
          onClick={() => {
            if (trialEligibleTeams.length > 0) {
              track('Home Banner - Start trial from personal workspace', {
                codesandbox: 'V1',
                event_source: 'UI',
              });

              modalOpened({ modal: 'selectWorkspaceToStartTrial' });
            } else {
              track('Home Banner - Create team from personal workspace', {
                codesandbox: 'V1',
                event_source: 'UI',
              });

              openCreateTeamModal();
            }
          }}
          autoWidth
        >
          Start 14-day free trial
        </Button>
      );
    }

    if (checkoutUrl) {
      return (
        <Button
          css={{ padding: '4px 20px' }}
          onClick={() => {
            if (isEligibleForTrial) {
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

            window.location.href = checkoutUrl;
          }}
          autoWidth
        >
          {isEligibleForTrial ? 'Start 14-day free trial' : 'Upgrade now'}
        </Button>
      );
    }

    return null;
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
          {isEligibleForTrial || isPersonalSpace
            ? 'Try Team Pro for free'
            : 'Upgrade to Team Pro'}
        </StyledTitle>
        <Stack
          css={{
            flexWrap: 'wrap',
          }}
          justify="space-between"
        >
          <Stack direction="vertical" justify="space-between">
            <StyledTitle block>
              {isEligibleForTrial || isPersonalSpace
                ? '14 days free trial. No credit card required.'
                : 'Enjoy the full CodeSandbox experience.'}
            </StyledTitle>
            <Stack
              css={{
                [`@media screen and (max-width: ${WRAP_WIDTH}px)`]: {
                  marginTop: '24px',
                },
              }}
              direction="vertical"
            >
              {checkoutUrl || isPersonalSpace ? (
                <Stack align="center" gap={6}>
                  {renderMainCTA()}
                  <Link
                    href="/pricing"
                    target="_blank"
                    onClick={() => {
                      track('Home Banner - Learn More', {
                        codesandbox: 'V1',
                        event_source: 'UI',
                      });
                    }}
                  >
                    <Text color="#999999" size={3}>
                      Learn more
                    </Text>
                  </Link>
                </Stack>
              ) : (
                <Button
                  as="a"
                  href={
                    isEligibleForTrial
                      ? SUBSCRIPTION_DOCS_URLS.teams.trial
                      : SUBSCRIPTION_DOCS_URLS.teams.non_trial
                  }
                  target="_blank"
                  autoWidth
                >
                  Learn more
                </Button>
              )}
            </Stack>
          </Stack>
          <Features />
        </Stack>
      </Element>
    </Banner>
  );
};
