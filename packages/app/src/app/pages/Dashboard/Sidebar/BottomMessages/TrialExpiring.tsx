import React from 'react';
import { Stack, Text, Button } from '@codesandbox/components';
import { useCreateCustomerPortal } from 'app/hooks/useCreateCustomerPortal';
import track from '@codesandbox/common/lib/utils/analytics';

export const TrialExpiring: React.FC<{
  activeTeam: string;
  daysLeft: number;
  isAdmin: boolean;
  cancelAtPeriodEnd: boolean;
  hasPaymentMethod: boolean;
}> = ({
  daysLeft,
  isAdmin,
  activeTeam,
  cancelAtPeriodEnd,
  hasPaymentMethod,
}) => {
  const [loading, createCustomerPortal] = useCreateCustomerPortal({
    team_id: activeTeam,
  });

  return (
    <Stack align="flex-start" direction="vertical" gap={2}>
      <Text css={{ color: '#c2c2c2', fontWeight: 500, fontSize: 12 }}>
        {daysLeft === 0 && <>Your trial ends today.</>}
        {daysLeft === 1 && <>Your trial ends tomorrow.</>}
        {daysLeft > 1 && <>{daysLeft} days left on your trial.</>}
      </Text>

      {cancelAtPeriodEnd ? (
        <Text css={{ color: '#999', fontWeight: 400, fontSize: 12 }}>
          After this period, your Team will be migrated to the Free plan.
        </Text>
      ) : (
        <Text css={{ color: '#999', fontWeight: 400, fontSize: 12 }}>
          {hasPaymentMethod
            ? 'After this period, your Team Pro subscription will be automatically renewed.'
            : 'Update your payment method to continue this Pro subscription.'}
        </Text>
      )}

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
          onClick={() => {
            track(
              `Side banner - ${
                hasPaymentMethod ? 'Manage subscription' : 'Add payment details'
              }`,
              {
                codesandbox: 'V1',
                event_source: 'UI',
              }
            );

            createCustomerPortal();
          }}
        >
          {hasPaymentMethod ? 'Manage subscription' : 'Add payment details'}
        </Button>
      )}
    </Stack>
  );
};
