import Relative from '@codesandbox/common/lib/components/Relative';
import badges from '@codesandbox/common/lib/utils/badges/patron-info';
import React from 'react';

import './animations.css';
import { BadgeContainer } from './elements';
import Particles from './Particles';

const Badge = ({ badge, subscribed }) => {
  const BadgeComponent = badges[badge].Badge;

  return (
    <Relative>
      {/* We prerender all particles, performance reasons */}
      <Particles makeItRain={subscribed} badge={badge} />

      <BadgeContainer key={badge} id="badge">
        <img src={BadgeComponent} className={`badge ${badge}`} alt={badge} />
      </BadgeContainer>
    </Relative>
  );
};

export default Badge;
