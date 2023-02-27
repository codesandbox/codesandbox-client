import React from 'react';
import { Button, Stack, Text } from '@codesandbox/components';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import track from '@codesandbox/common/lib/utils/analytics';

import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { useCreateCheckout } from 'app/hooks';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useAppState } from 'app/overmind';
import { SUBSCRIPTION_DOCS_URLS } from 'app/constants';
import { Alert } from '../Common/Alert';

export const LiveSessionRestricted: React.FC = () => {
  const {
    activeTeam,
    editor: {
      currentSandbox: { id },
    },
  } = useAppState();
  const [checkout, createCheckout] = useCreateCheckout();
  const { isAdmin } = useWorkspaceAuthorization();
  const { isEligibleForTrial } = useWorkspaceSubscription();

  return (
    <Alert title="Upgrade to Pro to start a Live Session">
      {checkout.status === 'error' && (
        <Text marginBottom={8} variant="danger" size={12}>
          An error ocurred while trying to load the checkout. Please try again.
        </Text>
      )}

      {isAdmin ? (
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
              track('Live Session - learn more clicked', {
                codesandbox: 'V1',
                event_source: 'UI',
              });
            }}
            autoWidth
          >
            Learn more
          </Button>
          <Button
            loading={checkout.status === 'loading'}
            variant="primary"
            onClick={() => {
              track(
                `Live Session - ${
                  isEligibleForTrial ? 'trial' : 'upgrade'
                } clicked`,
                {
                  codesandbox: 'V1',
                  event_source: 'UI',
                }
              );

              createCheckout({
                team_id: activeTeam,
                recurring_interval: 'month',
                success_path: sandboxUrl({ id }),
                cancel_path: sandboxUrl({ id }),
              });
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
                track('Live Session - learn more clicked', {
                  codesandbox: 'V1',
                  event_source: 'UI',
                });
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
