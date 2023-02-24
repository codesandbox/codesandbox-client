import React from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import { ComboButton, Stack, Text } from '@codesandbox/components';
import { dashboard as dashboardUrls } from '@codesandbox/common/lib/utils/url-generator';
import track from '@codesandbox/common/lib/utils/analytics';

import { useGetCheckoutURL } from 'app/hooks/useCreateCheckout';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { useAppState } from 'app/overmind';

import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { Card } from '../../components';

const List = styled(Stack)`
  padding-left: 1em;
  margin: 0;

  ${Text} {
    list-style: disc;
    display: list-item;
  }
`;

export const Upgrade = () => {
  const { activeTeam } = useAppState();
  const { isTeamAdmin, isPersonalSpace } = useWorkspaceAuthorization();
  const { isFree, isEligibleForTrial } = useWorkspaceSubscription();
  const monthlyCheckout = useGetCheckoutURL({
    team_id:
      (isTeamAdmin || isPersonalSpace) && isFree ? activeTeam : undefined,
    success_path: dashboardUrls.settings(activeTeam),
    cancel_path: dashboardUrls.settings(activeTeam),
  });

  const yearlyCheckout = useGetCheckoutURL({
    team_id:
      (isTeamAdmin || isPersonalSpace) && isFree ? activeTeam : undefined,
    success_path: dashboardUrls.settings(activeTeam),
    cancel_path: dashboardUrls.settings(activeTeam),
    recurring_interval: 'year',
  });

  const monthlyCheckoutUrl =
    monthlyCheckout.state === 'READY'
      ? monthlyCheckout.url
      : '/pro?utm_source=settings_upgrade';

  const yearlyCheckoutUrl =
    yearlyCheckout.state === 'READY'
      ? yearlyCheckout.url
      : '/pro?utm_source=settings_upgrade';

  return (
    <Card
      css={{
        backgroundColor: 'white',
      }}
    >
      <Stack
        direction="vertical"
        gap={4}
        css={css({ color: 'grays.800', fontWeight: '500' })}
      >
        <Text size={4}>Upgrade to Team Pro</Text>
        <List
          direction="vertical"
          gap={1}
          as="ul"
          css={css({ fontWeight: '400' })}
        >
          <Text as="li" size={3}>
            Advanced privacy settings
          </Text>
          <Text as="li" size={3}>
            Private NPM packages
          </Text>
          <Text as="li" size={3}>
            Unlimited editor seats
          </Text>
          <Text as="li" size={3}>
            Centralized billing
          </Text>
        </List>

        <ComboButton
          as="a"
          href={monthlyCheckoutUrl}
          onClick={() => {
            track('Team Settings - Upgrade', {
              codesandbox: 'V1',
              event_source: 'UI',
            });
          }}
          options={
            <>
              {isEligibleForTrial && (
                <ComboButton.Item
                  onSelect={() => {
                    track('Team Settings - Upgrade option - Start free trial', {
                      codesandbox: 'V1',
                      event_source: 'UI',
                    });

                    window.location.href = monthlyCheckoutUrl;
                  }}
                >
                  Start free trial
                </ComboButton.Item>
              )}
              <ComboButton.Item
                onSelect={() => {
                  track('Team Settings - Upgrade option - Upgrade to Pro', {
                    codesandbox: 'V1',
                    event_source: 'UI',
                  });

                  window.location.href = monthlyCheckoutUrl;
                }}
              >
                Upgrade to Pro
              </ComboButton.Item>
              <ComboButton.Item
                onSelect={() => {
                  track('Team Settings - Upgrade option - Custom upgrade', {
                    codesandbox: 'V1',
                    event_source: 'UI',
                  });

                  window.location.href = yearlyCheckoutUrl;
                }}
              >
                <Stack direction="vertical">
                  <Text>Custom upgrade</Text>
                  <Text
                    css={{
                      fontSize: '11px',
                      lineHeight: '16px',
                      color: '#999999',
                    }}
                  >
                    Upgrade with a custom number
                    <br /> of paid seats. Annual plan only.
                  </Text>
                </Stack>
              </ComboButton.Item>
            </>
          }
          variant="trial"
          fillSpace
        >
          {isEligibleForTrial ? 'Start free trial' : 'Upgrade to Pro'}
        </ComboButton>
      </Stack>
    </Card>
  );
};
