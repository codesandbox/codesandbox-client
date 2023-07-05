import React from 'react';
import { Stack, Text, Button } from '@codesandbox/components';
import track from '@codesandbox/common/lib/utils/analytics';
import { useCreateCheckout } from 'app/hooks';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { dashboard } from '@codesandbox/common/lib/utils/url-generator';

const EVENT_NAME = 'Side banner - Start Trial';

export const StartTrial: React.FC<{ activeTeam: string }> = ({
  activeTeam,
}) => {
  const { isBillingManager } = useWorkspaceAuthorization();

  const [checkout, createCheckout] = useCreateCheckout();
  const disabled = checkout.status === 'loading';

  return (
    <Stack align="flex-start" direction="vertical" gap={2}>
      <Text css={{ color: '#999', fontWeight: 400, fontSize: 12 }}>
        Upgrade to Team PRO for the full CodeSandbox Experience.
      </Text>

      <Button
        disabled={disabled}
        variant="link"
        onClick={() => {
          track(
            isBillingManager ? EVENT_NAME : `${EVENT_NAME} - As non-admin`,
            {
              codesandbox: 'V1',
              event_source: 'UI',
            }
          );

          createCheckout({
            success_path: dashboard.recent(activeTeam),
            utm_source: 'dashboard_import_limits',
          });
        }}
        css={{
          fontSize: '12px',
          fontWeight: 500,
          color: '#EDFFA5',
          textDecoration: 'none',
          padding: '4px 0',
        }}
        autoWidth
      >
        Start trial
      </Button>
    </Stack>
  );
};
