import React from 'react';
import { Button, Stack, Text } from '@codesandbox/components';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import track from '@codesandbox/common/lib/utils/analytics';

import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useAppState } from 'app/overmind';
import { SUBSCRIPTION_DOCS_URLS } from 'app/constants';
import { useCreateCheckout } from 'app/hooks';
import { Alert } from '../Common/Alert';

const EVENT_PARAMS = {
  codesandbox: 'V1',
  event_source: 'UI',
};

export const LiveSessionRestricted: React.FC = () => {
  const {
    activeTeam,
    editor: {
      currentSandbox: { id },
    },
  } = useAppState();
  const { isBillingManager, isPersonalSpace } = useWorkspaceAuthorization();
  const { isEligibleForTrial } = useWorkspaceSubscription();

  const [checkout, createCheckout, canCheckout] = useCreateCheckout();
  const disabled = checkout.status == 'loading';

  const docsUrl = isEligibleForTrial
    ? SUBSCRIPTION_DOCS_URLS.teams.trial
    : SUBSCRIPTION_DOCS_URLS.teams.non_trial;

  return (
    <Alert title="Upgrade to Pro to start a Live Session">
      {canCheckout ? (
        <Stack gap={2} align="center" justify="flex-end">
          <Button
            as="a"
            variant="link"
            href={docsUrl}
            onClick={() => {
              track('Live Session - learn more clicked', EVENT_PARAMS);
            }}
            autoWidth
          >
            Learn more
          </Button>
          {isPersonalSpace ? (
            <Button
              as="a"
              href="/pro?utm_source=v1_live_session_upgrade"
              variant="primary"
              autoWidth
            >
              Upgrade to Pro
            </Button>
          ) : (
            <Button
              variant="primary"
              disabled={disabled}
              onClick={() => {
                if (isEligibleForTrial) {
                  const event = 'Live Session - trial clicked';
                  track(
                    isBillingManager ? event : `${event} - As non-admin`,
                    EVENT_PARAMS
                  );
                } else {
                  track('Live Session - upgrade clicked', EVENT_PARAMS);
                }

                createCheckout({
                  success_path: sandboxUrl({ id }),
                  cancel_path: sandboxUrl({ id }),
                  team_id: activeTeam,
                  recurring_interval: 'month',
                  utm_source: 'v1_live_session_upgrade',
                });
              }}
              autoWidth
            >
              <Text>
                {isEligibleForTrial ? 'Start free trial' : 'Upgrade to Pro'}
              </Text>
            </Button>
          )}
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
              href={docsUrl}
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
