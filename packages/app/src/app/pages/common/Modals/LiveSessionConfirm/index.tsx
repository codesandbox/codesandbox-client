import React from 'react';
import { Button, Stack, Text } from '@codesandbox/components';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import track from '@codesandbox/common/lib/utils/analytics';

import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { useCreateCheckout } from 'app/hooks';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useActions, useAppState } from 'app/overmind';
import { Alert } from '../Common/Alert';

export const LiveSessionConfirm: React.FC = () => {
  const {
    activeTeam,
    editor: {
      currentSandbox: { id },
    },
  } = useAppState();
  const { modalClosed, live } = useActions();
  const [checkout, createCheckout] = useCreateCheckout();
  const { isAdmin } = useWorkspaceAuthorization();
  const { isEligibleForTrial } = useWorkspaceSubscription();

  React.useEffect(() => {
    track('Live Session - notice seen', {
      codesandbox: 'V1',
      event_source: 'UI',
    });
  }, []);

  return (
    <Alert title="After February 20, Live Sessions will become a Pro feature.">
      {checkout.status === 'error' && (
        <Text marginBottom={8} variant="danger" size={12}>
          An error ocurred while trying to load the checkout. Please try again.
        </Text>
      )}
      <Stack gap={2} align="center" justify="flex-end">
        <Button
          onClick={() => {
            live.createLiveClicked(id);
            modalClosed();
          }}
          variant="link"
          autoWidth
        >
          Go Live now
        </Button>
        {isAdmin ? (
          <Button
            loading={checkout.status === 'loading'}
            variant="primary"
            onClick={() => {
              track('Live Session - upgrade clicked', {
                codesandbox: 'V1',
                event_source: 'UI',
              });

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
        ) : (
          <Button
            as="a"
            href="/pro"
            target="_blank"
            variant="secondary"
            autoWidth
          >
            Learn more
          </Button>
        )}
      </Stack>
    </Alert>
  );
};
