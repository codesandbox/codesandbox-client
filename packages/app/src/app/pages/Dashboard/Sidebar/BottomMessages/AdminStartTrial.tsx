import { Stack, Text, Link } from '@codesandbox/components';
import { Link as RouterLink } from 'react-router-dom';
import React from 'react';

export const AdminStartTrial = () => (
  <Stack align="flex-start" direction="vertical" gap={2}>
    <Text css={{ color: '#999', fontWeight: 400, fontSize: 12 }}>
      Upgrade to Team PRO for the full Codesandbox Experience.
    </Text>
    <Link
      as={RouterLink}
      to="/pro"
      title="Start Team PRO trial"
      css={{
        fontSize: '12px',
        fontWeight: 500,
        color: '#EDFFA5',
        textDecoration: 'none',
      }}
    >
      Start trial
    </Link>
  </Stack>
);
