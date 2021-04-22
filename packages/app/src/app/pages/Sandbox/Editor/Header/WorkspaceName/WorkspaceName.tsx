import * as React from 'react';
import { useAppState } from 'app/overmind';

import css from '@styled-system/css';

import { Stack, Text, Tooltip } from '@codesandbox/components';
import { SubscriptionType } from 'app/graphql/types';
import { Badge } from './shared';
import { UpgradeToolTip } from './UpgradeToolTip';

const TeamBadge: React.FC = () => {
  const { activeTeamInfo } = useAppState();
  const isTeamPro =
    activeTeamInfo?.subscription?.type === SubscriptionType.TeamPro;

  if (isTeamPro) {
    return (
      <Tooltip label="Team pro">
        <Badge css={css({ backgroundColor: 'grays.500' })}>Pro</Badge>
      </Tooltip>
    );
  }

  return <UpgradeToolTip />;
};

export const WorkspaceName: React.FC = () => {
  const { user } = useAppState();

  return (
    <Stack gap={3} align="center">
      <Text>{user.name}</Text>

      <TeamBadge />
    </Stack>
  );
};
