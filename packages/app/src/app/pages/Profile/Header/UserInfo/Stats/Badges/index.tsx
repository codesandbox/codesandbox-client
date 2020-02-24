import Badge from '@codesandbox/common/lib/utils/badges/Badge';
import { patronUrl } from '@codesandbox/common/lib/utils/url-generator';
import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';

import { useOvermind } from 'app/overmind';

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
