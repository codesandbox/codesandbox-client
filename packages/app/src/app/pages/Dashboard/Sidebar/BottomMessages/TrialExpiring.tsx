import React from 'react';
import { Stack, Text, Button } from '@codesandbox/components';
import { useCreateCustomerPortal } from 'app/hooks/useCreateCustomerPortal';

export const TrialExpiring: React.FC<{
  activeTeam: string;
  daysLeft: number;
  isAdmin: boolean;
  cancelAtPeriodEnd: boolean;
}> = ({ daysLeft, isAdmin, activeTeam, cancelAtPeriodEnd }) => {
  const [loading, createCustomerPortal] = useCreateCustomerPortal({
    team_id: activeTeam,
  });

  return (
    <Stack align="flex-start" direction="vertical" gap={2}>
      <Text css={{ color: '#c2c2c2', fontWeight: 500, fontSize: 12 }}>
        {daysLeft === 0 && <>Your trial expires today.</>}
        {daysLeft === 1 && <>Your trial expires tomorrow.</>}
        {daysLeft > 1 && <>{daysLeft} days left on your trial.</>}
      </Text>
      <Text css={{ color: '#999', fontWeight: 400, fontSize: 12 }}>
        {cancelAtPeriodEnd ? (
          <>After this period, your Team will be migrated to the Free plan.</>
        ) : (
          <>
            After this period, your Team Pro subscription will be automatically
            renewed.
          </>
        )}
      </Text>
      {isAdmin && (
        <Button
          autoWidth
          variant="link"
          loading={loading}
          css={{
            fontSize: '12px',
            fontWeight: 500,
            color: '#EDFFA5',
            textDecoration: 'none',
            padding: '4px 0',
          }}
          onClick={createCustomerPortal}
        >
          Manage subscription
        </Button>
      )}
    </Stack>
  );
};
