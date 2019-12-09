import React, { FunctionComponent } from 'react';
import { useOvermind } from 'app/overmind';

import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import Badge from '@codesandbox/common/lib/utils/badges/Badge';

import { Title } from '../elements';

export const Badges: FunctionComponent = () => {
  const {
    actions: {
      preferences: { setBadgeVisibility },
    },
    state: {
      user: { badges },
    },
  } = useOvermind();

  return (
    <div>
      <Title>Badges</Title>

      <strong>
        You currently have {badges.length} badge
        {badges.length === 1 ? '' : 's'}. You can click on the badges to toggle
        visibility.
      </strong>

      <Margin top={2}>
        {badges.map(badge => (
          <Badge
            badge={badge}
            onClick={({ id, visible }) =>
              setBadgeVisibility({ id, visible: !visible })
            }
            key={badge.id}
            size={128}
            tooltip={false}
            visible={badge.visible}
          />
        ))}
      </Margin>
    </div>
  );
};
