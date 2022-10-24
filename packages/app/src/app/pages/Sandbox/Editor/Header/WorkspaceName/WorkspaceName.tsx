import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { dashboardUrl } from '@codesandbox/common/lib/utils/url-generator';

import { Stack, Text } from '@codesandbox/components';
import { SubscriptionType } from 'app/graphql/types';
import { UpgradeToolTip } from './UpgradeToolTip';

export const WorkspaceName: React.FC<{
  name: string;
  plan?: SubscriptionType;
}> = ({ name, plan }) => (
  <Stack gap={2} align="center">
    <RouterLink
      to={dashboardUrl()}
      css={{ lineHeight: 1, textDecoration: 'none', color: 'inherit' }}
    >
      <Text css={{ lineHeight: 1 }}>{name}</Text>
    </RouterLink>

    {!plan && (
      <Stack>
        <UpgradeToolTip />
      </Stack>
    )}
  </Stack>
);
