import React, { memo } from 'react';
import { PatronBadge } from '@codesandbox/common/lib/types';
import badges from '@codesandbox/common/lib/utils/badges/patron-info';
import './animations.css';
import { Particles } from './Particles';

import { BadgeContainer } from './elements';

interface IBadgeProps {
  badge: PatronBadge;
  subscribed: boolean;
}

export const Badge: React.FC<IBadgeProps> = memo(({ badge, subscribed }) => {
  const BadgeComponent = badges[badge].Badge;

  return (
    <div
      css={`
        position: relative;
      `}
    >
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
    </div>
  );
});
