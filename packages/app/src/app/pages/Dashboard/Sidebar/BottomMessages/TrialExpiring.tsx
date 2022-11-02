import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Stack, Text, Link } from '@codesandbox/components';

export const TrialExpiring: React.FC<{
  daysLeft: number;
  isAdmin: boolean;
}> = ({ daysLeft, isAdmin }) => (
  <Stack align="flex-start" direction="vertical" gap={2}>
    <Text css={{ color: '#c2c2c2', fontWeight: 500, fontSize: 12 }}>
      {daysLeft === 0 && <>Your trial expires today.</>}
      {daysLeft === 1 && <>Your trial expires tomorrow.</>}
      {daysLeft > 1 && <>{daysLeft} days left on your trial.</>}
    </Text>
    <Text css={{ color: '#999', fontWeight: 400, fontSize: 12 }}>
      After this period, your Team Pro subscription will be automatically
      renewed.
    </Text>
    {isAdmin && (
      <Link
        as={RouterLink}
        to="/dashboard/settings"
        title="Manage subscription"
        css={{
          fontSize: '12px',
          fontWeight: 500,
          color: '#EDFFA5',
          textDecoration: 'none',
        }}
      >
        Manage subscription
      </Link>
    )}
  </Stack>
);
