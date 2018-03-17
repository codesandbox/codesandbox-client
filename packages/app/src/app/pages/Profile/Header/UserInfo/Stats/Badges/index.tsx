import * as React from 'react';
import { Link } from 'react-router-dom';

import Margin from 'common/components/spacing/Margin';
import BadgeComponent from 'common/utils/badges/Badge';
import { patronUrl } from 'common/utils/url-generator';

import { Badge } from 'app/store/modules/profile/types'

type Props = {
  badges: Badge[]
}

const Badges: React.SFC<Props> = ({ badges }) => {
  return (
    <Margin right={2}>
      <Link to={patronUrl()}>
        {badges.map(badge => <BadgeComponent key={badge.id} badge={badge} size={64} />)}
      </Link>
    </Margin>
  );
}

export default Badges;
