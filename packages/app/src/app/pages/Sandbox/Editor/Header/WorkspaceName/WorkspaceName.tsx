import * as React from 'react';

import css from '@styled-system/css';

import { Stack, Text, Tooltip } from '@codesandbox/components';
import { SubscriptionType } from 'app/graphql/types';
import { Badge } from './shared';
import { UpgradeToolTip } from './UpgradeToolTip';

const TeamBadge: React.FC<{
  plan?: SubscriptionType | string;
  showFreeBadge: boolean;
}> = ({ showFreeBadge, plan }) => {
  if (!plan) {
    return null;
  }

  if (plan === SubscriptionType.TeamPro || plan === 'patron') {
    return (
      <Tooltip label="Team pro">
        <Badge css={css({ backgroundColor: 'grays.500' })}>Pro</Badge>
      </Tooltip>
    );
  }

  if (!showFreeBadge) {
    return null;
  }

  return <UpgradeToolTip />;
};

export const WorkspaceName: React.FC<{
  name: string;
  plan?: SubscriptionType;
  showFreeBadge?: boolean;
}> = ({ name, plan, showFreeBadge = false }) => (
  <Stack gap={2} align="center">
    <Text css={{ lineHeight: 1 }}>{name}</Text>

    <TeamBadge showFreeBadge={showFreeBadge} plan={plan} />
  </Stack>
);
