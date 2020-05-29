import './animations.css';

import Relative from '@codesandbox/common/es/components/Relative';
import { PatronBadge } from '@codesandbox/common/es/types';
import badges from '@codesandbox/common/es/utils/badges/patron-info';
import React, { memo } from 'react';

import { BadgeContainer } from './elements';
import { Particles } from './Particles';

interface IBadgeProps {
  badge: PatronBadge;
  subscribed: boolean;
}

export const Badge: React.FC<IBadgeProps> = memo(({ badge, subscribed }) => {
  const BadgeComponent = badges[badge].Badge;

  return (
    <Relative>
      {/* We prerender all particles, performance reasons */}
      <Particles makeItRain={subscribed} badge={badge} />
      <BadgeContainer key={badge} id="badge">
        <img
          style={{ height: '100%' }}
          src={BadgeComponent}
          className={`badge ${badge}`}
          alt={badge}
        />
      </BadgeContainer>
    </Relative>
  );
});
