import React, { useEffect } from 'react';
import * as typeformEmbed from '@typeform/embed';
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

const Typeform = () => {
  const el = React.useRef();
  const { activeTeamInfo } = useAppState();

  const [, createCustomerPortal] = useCreateCustomerPortal({
    team_id: activeTeamInfo?.id,
  });

  useEffect(() => {
    if (el.current) {
      typeformEmbed.makeWidget(
        el.current,
        `https://codesandbox.typeform.com/to/UiMxcTD8?team_id=${activeTeamInfo.id}`,
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
    <Stack css={{ padding: '24px' }} direction="vertical" gap={12}>
      <Stack direction="vertical" gap={6} css={{ textAlign: 'center' }}>
        <Stack direction="vertical" gap={4}>
          <Stack justify="flex-end">
            <IconButton name="cross" title="Close" onClick={handleCloseModal} />
          </Stack>
          <Stack justify="center">
            <Text
              as="h2"
              size={19}
              color="#C2C2C2"
              align="center"
              lineHeight="28px"
              css={{ margin: 0, maxWidth: '400px' }}
              weight="400"
            >
              Are you sure you want to cancel? You&apos;ll lose access to all
              Pro features
            </Text>
          </Stack>
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
              onClick={() => {
                track('Team Settings: confirm cancellation from modal', {
                  codesandbox: 'V1',
                  event_source: 'UI',
                });

                setFormOpen(true);
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
