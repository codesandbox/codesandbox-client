import { Stack, Text, Link } from '@codesandbox/components';
import { Link as RouterLink } from 'react-router-dom';
import React from 'react';

export const AdminUpgradeToTeamPro = () => (
  <Stack align="flex-start" direction="vertical" gap={2}>
    <Text css={{ color: '#999', fontWeight: 400, fontSize: 12 }}>
      Upgrade to Team PRO for the full CodeSandbox Experience.
    </Text>
    <Link
      as={RouterLink}
      to="/pro"
      title="Upgrade to Team PRO"
      css={{
        fontSize: '12px',
        fontWeight: 500,
        color: '#EDFFA5',
        textDecoration: 'none',
      }}
    >
      Upgrade now
    </Link>
  </Stack>
);
