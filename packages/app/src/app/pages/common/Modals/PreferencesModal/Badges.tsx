import { Text, Element } from '@codesandbox/components';
import Badge from '@codesandbox/common/lib/utils/badges/Badge';
import React, { FunctionComponent } from 'react';

import { useAppState, useActions } from 'app/overmind';

export const Badges: FunctionComponent = () => {
  const { setBadgeVisibility } = useActions().preferences;
  const { badges } = useAppState().user;

  return (
    <>
      <Text block marginBottom={6} size={4} weight="bold">
        Badges
      </Text>

      <Text size={3}>
        You currently have{' '}
        {`${badges.length} badge${badges.length === 1 ? '' : 's'}`}. You can
        click on the badges to toggle visibility.
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
