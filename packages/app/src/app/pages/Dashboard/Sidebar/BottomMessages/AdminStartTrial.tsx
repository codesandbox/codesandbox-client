import { Stack, Text, Button } from '@codesandbox/components';
import React from 'react';
import { useCreateCheckout } from 'app/hooks';
import track from '@codesandbox/common/lib/utils/analytics';
import { dashboard } from '@codesandbox/common/lib/utils/url-generator';
import { useActions } from 'app/overmind';

export const AdminStartTrial: React.FC<{ activeTeam: string }> = ({
  activeTeam,
}) => {
  const [checkout, createCheckout] = useCreateCheckout();
  const { modalOpened } = useActions();

  return (
    <Stack align="flex-start" direction="vertical" gap={2}>
      <Text css={{ color: '#999', fontWeight: 400, fontSize: 12 }}>
        Upgrade to Team PRO for the full Codesandbox Experience.
      </Text>
      {checkout.status === 'error' ? (
        <Text variant="danger" css={{ fontWeight: 400, fontSize: 12 }}>
          An error ocurred while trying to load the trial subscription. Please
          try again later and{' '}
          <Button
            variant="link"
            css={{
              color: 'inherit',
              textDecoration: 'underline',
              padding: '0',
              display: 'inline',
              width: 'auto',
              height: 'auto',
            }}
            onClick={() => {
              modalOpened({ modal: 'feedback' });
            }}
          >
            report the issue
          </Button>{' '}
          if it persists.
        </Text>
      ) : (
        <Button
          autoWidth
          variant="link"
          loading={checkout.status === 'loading'}
          onClick={() => {
            track('Side banner - Start Trial', {
              codesandbox: 'V1',
              event_source: 'UI',
            });

            createCheckout({
              team_id: activeTeam,
              recurring_interval: 'month' as string,
              success_path: dashboard.recent(activeTeam),
              cancel_path: dashboard.recent(activeTeam),
            });
          }}
          css={{
            fontSize: '12px',
            fontWeight: 500,
            color: '#EDFFA5',
            textDecoration: 'none',
            padding: '4px 0',
          }}
        >
          Start trial
        </Button>
      )}
    </Stack>
  );
};
