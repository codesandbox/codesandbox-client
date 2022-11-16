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
import { dashboard } from '@codesandbox/common/lib/utils/url-generator';
import track from '@codesandbox/common/lib/utils/analytics';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { useSubscription } from 'app/hooks/useSubscription';

const StyledTitle = styled(Text)`
  font-size: 24px;
  line-height: 32px;
  letter-spacing: -0.019em;
  margin: 0;
`;

// When flex wraps and the list of features is
// shown below the call to action.
const WRAP_WIDTH = 1332;

type Feature = {
  icon: IconNames;
  label: string;
};
const FEATURES: Feature[] = [
  {
    icon: 'profile',
    label: 'Up to 20 editors',
  },
  {
    icon: 'npm',
    label: 'Private NPM packages',
  },
  {
    icon: 'sandbox',
    label: 'Unlimited sandboxes',
  },
  {
    icon: 'lock',
    label: 'Advanced privacy settings',
  },
  {
    icon: 'repository',
    label: 'Unlimited repositories',
  },
  {
    icon: 'server',
    label: '6GB RAM, 12GB Disk, 4 vCPUs',
  },
];

type UpgradeBannerProps = {
  teamId: string;
};
export const UpgradeBanner: React.FC<UpgradeBannerProps> = ({ teamId }) => {
  const [checkout, createCheckout] = useCreateCheckout();
  const [isBannerDismissed, dismissBanner] = useDismissible(
    'DASHBOARD_RECENT_UPGRADE'
  );
  const { isTeamAdmin } = useWorkspaceAuthorization();
  const { isEligibleForTrial } = useSubscription();

  if (isBannerDismissed) {
    return null;
  }

  const checkoutBtnDisabled = !isTeamAdmin || checkout.status === 'loading';

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
        <StyledTitle color="#EDFFA5" weight="600" block>
          Upgrade to <span css={{ textTransform: 'uppercase' }}>pro</span>
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
              {isTeamAdmin ? (
                <>
                  <Stack align="center" gap={6}>
                    <Button
                      aria-describedby="checkout-error"
                      onClick={() => {
                        if (checkoutBtnDisabled) {
                          return;
                        }

                        if (isEligibleForTrial) {
                          track('Home Banner - Start trial', {
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
                          team_id: teamId,
                          recurring_interval: 'month',
                          success_path: dashboard.recent(teamId),
                          cancel_path: dashboard.recent(teamId),
                        });
                      }}
                      loading={checkout.status === 'loading'}
                      disabled={checkoutBtnDisabled}
                      type="button"
                      autoWidth
                    >
                      {isEligibleForTrial ? 'Start trial' : 'Upgrade now'}
                    </Button>

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
                  {checkout.status === 'error' && (
                    <Text
                      css={{ marginTop: '8px' }}
                      id="checkout-error"
                      size={2}
                      variant="danger"
                    >
                      {checkout.error}. Please try again.
                    </Text>
                  )}
                </>
              ) : (
                <Button
                  as="a"
                  href={
                    isEligibleForTrial
                      ? '/docs/learn/plan-billing/trials'
                      : 'docs/learn/introduction/workspace#managing-teams-and-subscriptions'
                  }
                  target="_blank"
                  autoWidth
                >
                  Learn more
                </Button>
              )}
            </Stack>
          </Stack>
          <Grid
            as="ul"
            css={{
              listStyle: 'none',
              margin: '0 24px 0 0',
              padding: 0,

              [`@media screen and (max-width: ${WRAP_WIDTH}px)`]: {
                marginTop: '24px',
              },
            }}
            columnGap={3}
          >
            {FEATURES.map(f => (
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

                  [`@media screen and (min-width: ${WRAP_WIDTH + 1}px)`]: {
                    gridColumnEnd: 'span 6',
                  },
                }}
                key={f.icon}
                as="li"
              >
                <Stack css={{ color: '#EBEBEB' }} gap={4}>
                  <Icon css={{ flexShrink: 0 }} name={f.icon} />
                  <Text size={3}>{f.label}</Text>
                </Stack>
              </Column>
            ))}
          </Grid>
        </Stack>
      </Element>
    </Banner>
  );
};
