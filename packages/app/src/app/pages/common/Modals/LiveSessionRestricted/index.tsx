import React from 'react';
import { Button, Stack, Text } from '@codesandbox/components';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import track from '@codesandbox/common/lib/utils/analytics';

import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useAppState } from 'app/overmind';
import { SUBSCRIPTION_DOCS_URLS } from 'app/constants';
import { useGetCheckoutURL } from 'app/hooks';
import { Alert } from '../Common/Alert';

const EVENT_PARAMS = {
  codesandbox: 'V1',
  event_source: 'UI',
};

export const LiveSessionRestricted: React.FC = () => {
  const {
    editor: {
      currentSandbox: { id },
    },
  } = useAppState();
  const { isAdmin } = useWorkspaceAuthorization();
  const { isEligibleForTrial } = useWorkspaceSubscription();

  const checkout = useGetCheckoutURL({
    success_path: sandboxUrl({ id }),
    cancel_path: sandboxUrl({ id }),
  });

  let checkoutUrl: string | null = null;
  if (checkout) {
    checkoutUrl =
      checkout.state === 'READY' ? checkout.url : checkout.defaultUrl;
  }

  return (
    <Alert title="Upgrade to Pro to start a Live Session">
      {checkoutUrl ? (
        <Stack gap={2} align="center" justify="flex-end">
          <Button
            as="a"
            variant="link"
            href={
              isEligibleForTrial
                ? SUBSCRIPTION_DOCS_URLS.teams.trial
                : SUBSCRIPTION_DOCS_URLS.teams.non_trial
            }
            onClick={() => {
              track('Live Session - learn more clicked', EVENT_PARAMS);
            }}
            autoWidth
          >
            Learn more
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              if (isEligibleForTrial) {
                const event = 'Live Session - trial clicked';
                track(
                  isAdmin ? event : `${event} - As non-admin`,
                  EVENT_PARAMS
                );
              } else {
                track('Live Session - upgrade clicked', EVENT_PARAMS);
              }

              window.location.href = checkoutUrl;
            }}
            autoWidth
          >
            <Text>
              {isEligibleForTrial ? 'Start free trial' : 'Upgrade to Pro'}
            </Text>
          </Button>
        </Stack>
      ) : (
        <Stack direction="vertical" gap={6}>
          <Text as="p" variant="muted" css={{ marginTop: 0 }}>
            Contact your team admin to upgrade.
          </Text>
          <Stack justify="flex-end">
            <Button
              as="a"
              variant="secondary"
              href={
                isEligibleForTrial
                  ? SUBSCRIPTION_DOCS_URLS.teams.trial
                  : SUBSCRIPTION_DOCS_URLS.teams.non_trial
              }
              onClick={() => {
                track('Live Session - learn more clicked', EVENT_PARAMS);
              }}
              autoWidth
            >
              Learn more
            </Button>
          </Stack>
        </Stack>
      )}
    </Alert>
  );
};
