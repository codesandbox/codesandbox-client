import React, { FunctionComponent } from 'react';
import { useOvermind } from 'app/overmind';

import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import Badge from '@codesandbox/common/lib/utils/badges/Badge';
import { Title } from '../elements';

export const Badges: FunctionComponent = () => {
  const {
    state: {
      user: { badges },
    },
    actions: {
      preferences: { setBadgeVisibility },
    },
  } = useOvermind();
  const badgesCount = badges.length;

  return (
    <div>
      <Title>Badges</Title>
      <strong>
        You currently have {badgesCount} badge
        {badgesCount === 1 ? '' : 's'}. You can click on the badges to toggle
        visibility.
      </strong>
      <Margin top={2}>
        {badges.map(badge => (
          <Badge
            key={badge.id}
            tooltip={false}
            onClick={b =>
              setBadgeVisibility({
                ...b,
                visible: !b.visible,
              })
            }
            badge={badge}
            visible={badge.visible}
            size={128}
          />
        ))}
      </Margin>
    </div>
  );
};
