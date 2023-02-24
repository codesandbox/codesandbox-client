import { ComboButton, Stack, Text } from '@codesandbox/components';
import { dashboard as dashboardUrls } from '@codesandbox/common/lib/utils/url-generator';
import { useGetCheckoutURL } from 'app/hooks/useCreateCheckout';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useAppState } from 'app/overmind';
import React from 'react';
import track from '@codesandbox/common/lib/utils/analytics';

type TeamSubscriptionOptionsProps = {
  buttonVariant?: React.ComponentProps<typeof ComboButton>['variant'];
  ctaCopy?: string;
  trackingLocation: string;
};
export const TeamSubscriptionOptions: React.FC<TeamSubscriptionOptionsProps> = ({
  buttonVariant,
  ctaCopy,
  trackingLocation,
}) => {
  const { activeTeam } = useAppState();
  const { isAdmin } = useWorkspaceAuthorization();
  const { isFree, isEligibleForTrial } = useWorkspaceSubscription();

  const canSubscribe = isAdmin && isFree && activeTeam !== null;
  const team_id = canSubscribe ? (activeTeam as string) : undefined;

  const monthlyCheckout = useGetCheckoutURL({
    team_id,
    success_path: dashboardUrls.settings(activeTeam),
    cancel_path: dashboardUrls.settings(activeTeam),
  });

  const yearlyCheckout = useGetCheckoutURL({
    team_id,
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
    <ComboButton
      as="a"
      href={monthlyCheckoutUrl}
      onClick={() => {
        track(`${trackingLocation} - Upgrade`, {
          codesandbox: 'V1',
          event_source: 'UI',
        });
      }}
      options={
        <>
          {isEligibleForTrial && (
            <ComboButton.Item
              onSelect={() => {
                track(
                  `${trackingLocation} - Upgrade option - Start free trial`,
                  {
                    codesandbox: 'V1',
                    event_source: 'UI',
                  }
                );

                window.location.href = monthlyCheckoutUrl;
              }}
            >
              Start free trial
            </ComboButton.Item>
          )}
          <ComboButton.Item
            onSelect={() => {
              track(`${trackingLocation} - Upgrade option - Upgrade to Pro`, {
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
              track(`${trackingLocation} - Upgrade option - Custom upgrade`, {
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
      variant={buttonVariant}
      fillSpace
    >
      {ctaCopy || (isEligibleForTrial ? 'Start free trial' : 'Upgrade to Pro')}
    </ComboButton>
  );
};
