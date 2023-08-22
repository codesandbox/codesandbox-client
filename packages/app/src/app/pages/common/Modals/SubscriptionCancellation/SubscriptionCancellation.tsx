import React, { useEffect } from 'react';
import * as typeformEmbed from '@typeform/embed';
import track from '@codesandbox/common/lib/utils/analytics';
import { Button, IconButton, Stack, Text } from '@codesandbox/components';
import { useCreateCustomerPortal } from 'app/hooks/useCreateCustomerPortal';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useActions, useAppState } from 'app/overmind';
import { SubscriptionType } from 'app/graphql/types';

const PERSONAL_PRO_MODAL = 'https://codesandbox.typeform.com/to/UiMxcTD8';
const TEAM_PRO_MODAL = 'https://codesandbox.typeform.com/to/oeh6CNdL';

const Typeform = () => {
  const el = React.useRef();
  const { activeTeamInfo } = useAppState();

  const [, createCustomerPortal] = useCreateCustomerPortal({
    team_id: activeTeamInfo?.id,
  });

  useEffect(() => {
    const formUrl =
      activeTeamInfo.subscription?.type === SubscriptionType.TeamPro
        ? TEAM_PRO_MODAL
        : PERSONAL_PRO_MODAL;
    if (el.current) {
      typeformEmbed.makeWidget(
        el.current,
        `${formUrl}?team_id=${activeTeamInfo.id}`,
        {
          opacity: 0,
          hideScrollbars: true,
          hideFooter: true,
          hideHeaders: true,
          onSubmit: () => {
            setTimeout(() => {
              createCustomerPortal();
            }, 1500);
          },
        }
      );
    }
  }, [el, activeTeamInfo.id]);

  return (
    <Stack>
      <div style={{ width: '100%', height: 700 }} ref={el} />
    </Stack>
  );
};

export const SubscriptionCancellationModal: React.FC = () => {
  const [hasFormOpen, setFormOpen] = React.useState(false);
  const { hasActiveTeamTrial, isPaddle } = useWorkspaceSubscription();
  const [paddleLoading, setPaddeLoading] = React.useState(false);
  const { modalClosed, pro } = useActions();
  const { activeTeamInfo } = useAppState();
  const [, createCustomerPortal] = useCreateCustomerPortal({
    team_id: activeTeamInfo?.id,
  });

  const handleCloseModal = () => {
    track('Team Settings: close cancel subscription modal', {
      codesandbox: 'V1',
      event_source: 'UI',
    });

    modalClosed();
  };

  if (hasFormOpen) {
    return <Typeform />;
  }

  return (
    <Stack css={{ padding: '24px' }} direction="vertical" gap={8}>
      <Stack direction="vertical" gap={4}>
        <Stack direction="horizontal" justify="space-between" align="center">
          <Text size={16} color="#C2C2C2" weight="500">
            Are you sure you want to cancel?
          </Text>

          <Stack>
            <IconButton
              variant="square"
              name="cross"
              title="Close"
              onClick={handleCloseModal}
            />
          </Stack>
        </Stack>
        <Text size={13} color="#999999">
          Everything in the workspace will be restricted until you either move
          your work to a new pro workspace or reactivate this one.
        </Text>
      </Stack>

      <Stack gap={4} css={{ width: '100%' }} direction="horizontal">
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
            autoWidth
            onClick={() => {
              track('Team Settings: confirm cancellation from modal', {
                codesandbox: 'V1',
                event_source: 'UI',
              });

              const showModal = false;
              if (showModal) {
                setFormOpen(true);
              } else {
                createCustomerPortal();
              }
            }}
            variant="primary"
          >
            Cancel {hasActiveTeamTrial ? 'trial' : 'subscription'}
          </Button>
        )}
        <Button onClick={handleCloseModal} variant="secondary" autoWidth>
          Continue {hasActiveTeamTrial ? 'trial' : 'subscription'}
        </Button>
      </Stack>
    </Stack>
  );
};
