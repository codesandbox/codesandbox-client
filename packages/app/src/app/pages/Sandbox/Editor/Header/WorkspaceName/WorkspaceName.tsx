import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { dashboardUrl } from '@codesandbox/common/lib/utils/url-generator';

import { Stack, Text, Badge } from '@codesandbox/components';

export const WorkspaceName: React.FC<{
  name: string;
  isPro: boolean;
}> = ({ name, isPro }) => (
  <Stack gap={2} align="center">
    <RouterLink
      to={dashboardUrl()}
      css={{ lineHeight: 1, textDecoration: 'none', color: 'inherit' }}
    >
      <Text css={{ lineHeight: 1 }}>{name}</Text>
    </RouterLink>

    {isPro && (
      <Stack>
        <Badge variant="pro">Pro</Badge>
      </Stack>
    )}
  </Stack>
);
