import * as React from 'react';

import css from '@styled-system/css';

import { Stack, Text, Tooltip } from '@codesandbox/components';
import { SubscriptionType } from 'app/graphql/types';
import { Badge } from './shared';
import { UpgradeToolTip } from './UpgradeToolTip';

const TeamBadge: React.FC<{
  plan?: SubscriptionType;
}> = ({ plan }) => {
  if ([SubscriptionType.TeamPro, SubscriptionType.PersonalPro].includes(plan)) {
    return (
      <Tooltip label="Team Pro">
        <Badge
          css={css({
            backgroundColor: 'secondaryButton.background',
            color: 'secondaryButton.foreground',
          })}
        >
          Pro
        </Badge>
      </Tooltip>
    );
  }

  return <UpgradeToolTip />;
};

export const WorkspaceName: React.FC<{
  name: string;
  plan?: SubscriptionType;
  showBadge?: boolean;
}> = ({ name, plan, showBadge = true }) => (
  <Stack gap={2} align="center">
    <Text css={{ lineHeight: 1 }}>{name}</Text>

    {showBadge && (
      <div>
        <TeamBadge plan={plan} />
      </div>
    )}
  </Stack>
);
