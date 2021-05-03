import * as React from 'react';

import css from '@styled-system/css';

import { Stack, Text, Tooltip } from '@codesandbox/components';
import { SubscriptionType } from 'app/graphql/types';
import { Badge } from './shared';
import { UpgradeToolTip } from './UpgradeToolTip';

const TeamBadge: React.FC<{
  plan?: SubscriptionType | string;
}> = ({ plan }) => {
  if (plan === SubscriptionType.TeamPro || plan === 'patron') {
    return (
      <Tooltip label="Team pro">
        <Badge css={css({ backgroundColor: 'grays.500' })}>Pro</Badge>
      </Tooltip>
    );
  }

  return <UpgradeToolTip />;
};

export const WorkspaceName: React.FC<{
  name: string;
  plan?: SubscriptionType;
}> = ({ name, plan }) => (
  <Stack gap={2} align="center">
    <Text css={{ lineHeight: 1 }}>{name}</Text>

    <div>
      <TeamBadge plan={plan} />
    </div>
  </Stack>
);
