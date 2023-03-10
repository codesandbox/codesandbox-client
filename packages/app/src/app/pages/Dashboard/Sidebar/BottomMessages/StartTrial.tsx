import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Stack, Text, Button } from '@codesandbox/components';
import track from '@codesandbox/common/lib/utils/analytics';
import { dashboard } from '@codesandbox/common/lib/utils/url-generator';
import { useGetCheckoutURL } from 'app/hooks';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';

const EVENT_NAME = 'Side banner - Start Trial';

export const StartTrial: React.FC<{ activeTeam: string }> = ({
  activeTeam,
}) => {
  const { isAdmin } = useWorkspaceAuthorization();
  const checkout = useGetCheckoutURL({
    success_path: dashboard.recent(activeTeam),
    cancel_path: dashboard.recent(activeTeam),
  }) as string;

  return (
    <Stack align="flex-start" direction="vertical" gap={2}>
      <Text css={{ color: '#999', fontWeight: 400, fontSize: 12 }}>
        Upgrade to Team PRO for the full CodeSandbox Experience.
      </Text>

      <Button
        {...(checkout.startsWith('/pro')
          ? {
              as: RouterLink,
              to: `${checkout}?utm_source=dashboard_import_limits`,
            }
          : {
              as: 'a',
              href: checkout, // goes to either /docs or Stripe
            })}
        variant="link"
        onClick={() => {
          track(isAdmin ? EVENT_NAME : `${EVENT_NAME} - As non-admin`, {
            codesandbox: 'V1',
            event_source: 'UI',
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
