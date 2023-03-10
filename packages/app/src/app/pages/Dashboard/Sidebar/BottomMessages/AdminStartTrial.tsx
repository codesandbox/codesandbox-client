import { Stack, Text, Button } from '@codesandbox/components';
import React from 'react';
import track from '@codesandbox/common/lib/utils/analytics';
import { dashboard } from '@codesandbox/common/lib/utils/url-generator';
import { useGetCheckoutURL } from 'app/hooks/useCreateCheckout';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';

const EVENT_NAME = 'Side banner - Start Trial';

export const AdminStartTrial: React.FC<{ activeTeam: string }> = ({
  activeTeam,
}) => {
  const { isAdmin } = useWorkspaceAuthorization();
  const checkout = useGetCheckoutURL({
    success_path: dashboard.recent(activeTeam),
    cancel_path: dashboard.recent(activeTeam),
  });

  if (!checkout) {
    return null;
  }

  const checkoutUrl =
    checkout.state === 'READY' ? checkout.url : checkout.defaultUrl;

  return (
    <Stack align="flex-start" direction="vertical" gap={2}>
      <Text css={{ color: '#999', fontWeight: 400, fontSize: 12 }}>
        Upgrade to Team PRO for the full CodeSandbox Experience.
      </Text>

      <Button
        as="a"
        href={checkoutUrl}
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
