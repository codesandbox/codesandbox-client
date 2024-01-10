import { Stack, Text, Link } from '@codesandbox/components';
import { Link as RouterLink } from 'react-router-dom';
import React from 'react';
import track from '@codesandbox/common/lib/utils/analytics';
import { proUrl } from '@codesandbox/common/lib/utils/url-generator/dashboard';

export const UpgradeFreeTeamToPro = ({ activeTeam }) => (
  <Stack align="flex-start" direction="vertical" gap={2}>
    <Text css={{ color: '#999', fontWeight: 400, fontSize: 12 }}>
      Upgrade to <Text css={{ color: '#c2c2c2', fontWeight: 500 }}>Pro</Text>{' '}
      for the full CodeSandbox Experience.
    </Text>
    <Link
      as={RouterLink}
      to={proUrl({ source: 'side_banner_team_pro', workspaceId: activeTeam })}
      title="Upgrade to Pro"
      css={{
        fontSize: '12px',
        fontWeight: 500,
        color: '#EDFFA5',
        textDecoration: 'none',
      }}
      onClick={() => {
        track('Side banner - Upgrade to Pro', {
          codesandbox: 'V1',
          event_source: 'UI',
        });
      }}
    >
      Upgrade now
    </Link>
  </Stack>
);
