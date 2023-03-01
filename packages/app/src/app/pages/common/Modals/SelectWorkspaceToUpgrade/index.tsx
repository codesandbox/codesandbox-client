import React from 'react';
import { Button, Element, Icon, Stack, Text } from '@codesandbox/components';
import track from '@codesandbox/common/lib/utils/analytics';

import { useCreateCheckout } from 'app/hooks';
import { useActions, useAppState } from 'app/overmind';
import { Alert } from '../Common/Alert';

export const SelectWorkspaceToUpgrade: React.FC = () => {
  const { activeTeam } = useAppState();
  const { modalClosed } = useActions();
  const [checkout, createCheckout] = useCreateCheckout();

  return (
    <Alert title="Choose a team to upgrade">
      <Text>Team Pro plan is only available for teams.</Text>
      {checkout.status === 'error' && (
        <Text marginBottom={8} variant="danger" size={12}>
          An error ocurred while trying to load the checkout. Please try again.
        </Text>
      )}
      <Stack
        css={{
          marginTop: '52px',
        }}
        gap={2}
        align="center"
        justify="flex-end"
      >
        <Button
          onClick={() => {
            track('');
            modalClosed();
          }}
          autoWidth
          variant="ghost"
        >
          Cancel
        </Button>
        <Button
          css={{
            gap: '4px',
          }}
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
              // success_path: sandboxUrl({ id }),
              // cancel_path: sandboxUrl({ id }),
            });
          }}
          autoWidth
        >
          Checkout
          <Element
            css={{
              transform: 'rotate(270deg)',
            }}
          >
            <Icon name="arrowDown" size={12} />
          </Element>
        </Button>
      </Stack>
    </Alert>
  );
};
