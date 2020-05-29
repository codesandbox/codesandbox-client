import Badge from '@codesandbox/common/es/utils/badges/Badge';
import { Element, Text } from '@codesandbox/components';
import { useOvermind } from 'app/overmind';
import React, { FunctionComponent } from 'react';

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
    <>
      <Text size={4} marginBottom={6} block variant="muted" weight="bold">
        Badges
      </Text>

      <Text size={3}>
        You currently have {badges.length} badge
        {badges.length === 1 ? '' : 's'}. You can click on the badges to toggle
        visibility.
      </Text>

      <Element marginTop={4}>
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
      </Element>
    </>
  );
};
