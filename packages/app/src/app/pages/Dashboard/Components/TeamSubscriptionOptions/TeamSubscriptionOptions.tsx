import { ComboButton, Stack, Text } from '@codesandbox/components';
import { dashboard as dashboardUrls } from '@codesandbox/common/lib/utils/url-generator';
import { useGetCheckoutURL } from 'app/hooks';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useAppState } from 'app/overmind';
import React from 'react';
import track from '@codesandbox/common/lib/utils/analytics';

const DEFAULT_SEARCH_PARAMS = '?utm_source=settings_upgrade';

type TeamSubscriptionOptionsProps = {
  buttonVariant?: React.ComponentProps<typeof ComboButton>['variant'];
  buttonStyles?: React.ComponentProps<typeof ComboButton>['customStyles'];
  ctaCopy?: string;
  trackingLocation: string;
};
export const TeamSubscriptionOptions: React.FC<TeamSubscriptionOptionsProps> = ({
  buttonVariant,
  buttonStyles,
  ctaCopy,
  trackingLocation,
}) => {
  const { activeTeam } = useAppState();
  const { isEligibleForTrial } = useWorkspaceSubscription();

  const monthlyCheckout = useGetCheckoutURL({
    success_path: dashboardUrls.settings(activeTeam),
    cancel_path: dashboardUrls.settings(activeTeam),
  });

  const yearlyCheckout = useGetCheckoutURL({
    success_path: dashboardUrls.settings(activeTeam),
    cancel_path: dashboardUrls.settings(activeTeam),
    recurring_interval: 'year',
  });

  const monthlyCheckoutUrl =
    // eslint-disable-next-line no-nested-ternary
    monthlyCheckout !== null
      ? monthlyCheckout.state === 'READY'
        ? monthlyCheckout.url
        : `${monthlyCheckout.defaultUrl}${DEFAULT_SEARCH_PARAMS}`
      : null;

  const yearlyCheckoutUrl =
    // eslint-disable-next-line no-nested-ternary
    yearlyCheckout !== null
      ? yearlyCheckout.state === 'READY'
        ? yearlyCheckout.url
        : `${yearlyCheckout.defaultUrl}${DEFAULT_SEARCH_PARAMS}`
      : null;

  return (
    <ComboButton
      as="a"
      customStyles={buttonStyles}
      onClick={() => {
        track(`${trackingLocation} - Upgrade`, {
          codesandbox: 'V1',
          event_source: 'UI',
        });
      }}
      {...(monthlyCheckoutUrl ? { href: monthlyCheckoutUrl } : {})}
      options={
        <>
          {isEligibleForTrial && (
            <ComboButton.Item
              onSelect={() => {
                if (monthlyCheckoutUrl) {
                  track(
                    `${trackingLocation} - Upgrade option - Start free trial`,
                    {
                      codesandbox: 'V1',
                      event_source: 'UI',
                    }
                  );

                  window.location.href = monthlyCheckoutUrl;
                }
              }}
            >
              Start free trial
            </ComboButton.Item>
          )}
          <ComboButton.Item
            onSelect={() => {
              if (monthlyCheckoutUrl) {
                track(`${trackingLocation} - Upgrade option - Upgrade to Pro`, {
                  codesandbox: 'V1',
                  event_source: 'UI',
                });

                window.location.href = monthlyCheckoutUrl;
              }
            }}
          >
            Upgrade to Pro
          </ComboButton.Item>
          <ComboButton.Item
            onSelect={() => {
              if (yearlyCheckoutUrl) {
                track(`${trackingLocation} - Upgrade option - Custom upgrade`, {
                  codesandbox: 'V1',
                  event_source: 'UI',
                });

                window.location.href = yearlyCheckoutUrl;
              }
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
      variant={buttonVariant}
      fillSpace
    >
      {ctaCopy || (isEligibleForTrial ? 'Start free trial' : 'Upgrade to Pro')}
    </ComboButton>
  );
};
