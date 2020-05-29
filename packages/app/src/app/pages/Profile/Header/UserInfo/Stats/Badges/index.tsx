import Badge from '@codesandbox/common/es/utils/badges/Badge';
import { patronUrl } from '@codesandbox/common/es/utils/url-generator';
import { useOvermind } from 'app/overmind';
import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';

import { ContributorsBadge, Margin } from './elements';

export const Badges: FunctionComponent = () => {
  const {
    state: {
      profile: {
        current: { badges, username },
      },
    },
  } = useOvermind();

  return (
    <Margin right={2}>
      <Link to={patronUrl()}>
        {badges.map(badge => (
          <Badge badge={badge} key={badge.id} size={64} />
        ))}
      </Link>

      <ContributorsBadge username={username} />
    </Margin>
  );
};
