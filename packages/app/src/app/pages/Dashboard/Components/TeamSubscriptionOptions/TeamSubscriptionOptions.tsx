import React from 'react';
import { ComboButton, Stack, Text } from '@codesandbox/components';
import { dashboard as dashboardUrls } from '@codesandbox/common/lib/utils/url-generator';
import track from '@codesandbox/common/lib/utils/analytics';
import { useCreateCheckout } from 'app/hooks';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useAppState } from 'app/overmind';

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

  const [checkout, createCheckout, canCheckout] = useCreateCheckout();
  const disabled = checkout.status === 'loading';

  const createMonthlyCheckout = () => {
    createCheckout({
      success_path: dashboardUrls.recent(activeTeam),
      utm_source: 'settings_upgrade',
    });
  };

  const createYearlyCheckout = () => {
    createCheckout({
      success_path: dashboardUrls.recent(activeTeam),
      utm_source: 'settings_upgrade',
    });
  };

  if (!canCheckout) {
    return (
      <Text as="p" variant="body" css={{ marginTop: 0 }}>
        Contact your team admin to upgrade.
      </Text>
    );
  }

  return (
    <ComboButton
      disabled={disabled}
      as="a"
      customStyles={buttonStyles}
      onClick={() => {
        createMonthlyCheckout();

        track(`${trackingLocation} - Upgrade`, {
          codesandbox: 'V1',
          event_source: 'UI',
        });
      }}
      options={
        <>
          {isEligibleForTrial && (
            <ComboButton.Item
              disabled={disabled}
              onSelect={() => {
                track(
                  `${trackingLocation} - Upgrade option - Start free trial`,
                  {
                    codesandbox: 'V1',
                    event_source: 'UI',
                  }
                );

                createMonthlyCheckout();
              }}
            >
              Start free trial
            </ComboButton.Item>
          )}
          <ComboButton.Item
            disabled={disabled}
            onSelect={() => {
              track(`${trackingLocation} - Upgrade option - Upgrade to Pro`, {
                codesandbox: 'V1',
                event_source: 'UI',
              });

              createMonthlyCheckout();
            }}
          >
            Upgrade to Pro
          </ComboButton.Item>
          <ComboButton.Item
            disabled={disabled}
            onSelect={() => {
              track(`${trackingLocation} - Upgrade option - Custom upgrade`, {
                codesandbox: 'V1',
                event_source: 'UI',
              });

              createYearlyCheckout();
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
      {disabled
        ? 'Loading...'
        : ctaCopy ||
          (isEligibleForTrial ? 'Start free trial' : 'Upgrade to Pro')}
    </ComboButton>
  );
};
