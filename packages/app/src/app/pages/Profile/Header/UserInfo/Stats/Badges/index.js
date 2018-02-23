import React from 'react';
import { Link } from 'react-router-dom';

import Margin from 'common/components/spacing/Margin';
import Badge from 'common/utils/badges/Badge';
import { patronUrl } from 'common/utils/url-generator';

function Badges({ badges }) {
  return (
    <Margin right={2}>
      <Link to={patronUrl()}>
        {badges.map(badge => <Badge key={badge.id} badge={badge} size={64} />)}
      </Link>
    </Margin>
  );
}

export default Badges;
