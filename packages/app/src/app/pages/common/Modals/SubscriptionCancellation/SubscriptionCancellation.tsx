import track from '@codesandbox/common/lib/utils/analytics';
import {
  Element,
  Button,
  IconButton,
  Stack,
  Text,
} from '@codesandbox/components';
import { LoseFeatures } from 'app/components/LoseFeatures/LoseFeatures';
import { useCreateCustomerPortal } from 'app/hooks/useCreateCustomerPortal';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useActions, useAppState } from 'app/overmind';
import React from 'react';

export const SubscriptionCancellationModal: React.FC = () => {
  const { activeTeamInfo } = useAppState();
  const { hasActiveTeamTrial, isPaddle } = useWorkspaceSubscription();
  const [paddleLoading, setPaddeLoading] = React.useState(false);
  const { modalClosed, pro } = useActions();
  const [loadingCustomerPortal, createCustomerPortal] = useCreateCustomerPortal(
    {
      team_id: activeTeamInfo?.id,
    }
  );

  const handleCloseModal = () => {
    track('Team Settings: close cancel subscription modal', {
      codesandbox: 'V1',
      event_source: 'UI',
    });

    modalClosed();
  };

  return (
    <Stack css={{ padding: '24px' }} direction="vertical" gap={12}>
      <Stack direction="vertical" gap={6} css={{ textAlign: 'center' }}>
        <Stack direction="vertical" gap={4}>
          <Stack justify="flex-end">
            <IconButton name="cross" title="Close" onClick={handleCloseModal} />
          </Stack>
          <Text
            as="h2"
            size={19}
            color="#C2C2C2"
            align="center"
            lineHeight="28px"
            css={{ margin: 0 }}
          >
            You&apos;ll lose access to all Pro features
          </Text>
        </Stack>
        <LoseFeatures />
      </Stack>

      <Stack gap={4} justify="space-between">
        <Element css={{ flexGrow: 1 }}>
          <Button onClick={handleCloseModal} variant="secondary">
            Continue {hasActiveTeamTrial ? 'trial' : 'subscription'}
          </Button>
        </Element>
        <Element css={{ flexGrow: 1 }}>
          {isPaddle ? (
            <Button
              loading={paddleLoading}
              onClick={() => {
                setPaddeLoading(true);
                track('Team Settings - confirm paddle cancel subscription', {
                  codesandbox: 'V1',
                  event_source: 'UI',
                });

                pro.cancelWorkspaceSubscription();
              }}
              variant="primary"
            >
              I understand
            </Button>
          ) : (
            <Button
              loading={loadingCustomerPortal}
              onClick={() => {
                track('Team Settings: confirm cancellation from modal', {
                  codesandbox: 'V1',
                  event_source: 'UI',
                });

                createCustomerPortal();
              }}
              variant="primary"
            >
              OK
            </Button>
          )}
        </Element>
      </Stack>
    </Stack>
  );
};
