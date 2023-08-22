import React from 'react';
import { Button, Stack, Text } from '@codesandbox/components';
import { useCreateCheckout } from 'app/hooks';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { SUBSCRIPTION_DOCS_URLS } from 'app/constants';
import track from '@codesandbox/common/lib/utils/analytics';
import { proUrl } from '@codesandbox/common/lib/utils/url-generator/dashboard';
import { Alert } from '../Common/Alert';

const EVENT_PARAMS = {
  codesandbox: 'V1',
  event_source: 'UI',
};

export const EditorSeatsUpgrade: React.FC = () => {
  const [checkout, createCheckout, canCheckout] = useCreateCheckout();
  const disabled = checkout.status === 'loading';

  const { isBillingManager, isPersonalSpace } = useWorkspaceAuthorization();
  const { isEligibleForTrial } = useWorkspaceSubscription();

  const docsUrl = `${
    isEligibleForTrial
      ? SUBSCRIPTION_DOCS_URLS.teams.trial
      : SUBSCRIPTION_DOCS_URLS.teams.non_trial
  }?utm_source=editor_seats_upgrade`;

  return (
    <Alert title="Upgrade to Pro to add more editor seats">
      {canCheckout ? (
        <Stack gap={2} align="center" justify="flex-end">
          <Button
            as="a"
            variant="link"
            href={docsUrl}
            onClick={() => {
              track('Editor seats modal - learn more clicked', EVENT_PARAMS);
            }}
            autoWidth
          >
            Learn more
          </Button>
          {isPersonalSpace ? (
            <Button
              as="a"
              href={proUrl({ source: 'editor_seats_upgrade' })}
              variant="primary"
              autoWidth
            >
              Upgrade to Pro
            </Button>
          ) : (
            <Button
              disabled={disabled}
              variant="primary"
              onClick={() => {
                if (isEligibleForTrial) {
                  const event = 'Editor seats modal - trial clicked';
                  track(
                    isBillingManager ? event : `${event} - As non-admin`,
                    EVENT_PARAMS
                  );
                } else {
                  track('Editor seats modal - upgrade clicked', EVENT_PARAMS);
                }

                createCheckout({
                  utm_source: 'editor_seats_upgrade',
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
                track('Editor seats modal - learn more clicked', EVENT_PARAMS);
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
