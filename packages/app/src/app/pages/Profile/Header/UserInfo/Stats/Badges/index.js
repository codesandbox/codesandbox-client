import React from 'react';
import { Link } from 'react-router-dom';

import Margin from 'common/components/spacing/Margin';
import Badge from 'common/utils/badges/Badge';
import ContributorsBadge from 'app/components/ContributorsBadge';

import { patronUrl } from 'common/utils/url-generator';

function Badges({ badges, username }) {
  return (
    <Margin
      css={`
        display: flex;
        align-items: center;
      `}
      right={2}
    >
      <Link to={patronUrl()}>
        {badges.map(badge => (
          <Badge key={badge.id} badge={badge} size={64} />
        ))}
      </Link>

      <ContributorsBadge
        username={username}
        css={`
          margin-left: 1rem;
          font-size: 3rem;
          display: inline-block;
        `}
      />
    </Margin>
  );
}

export default Badges;
