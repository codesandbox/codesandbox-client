import React from 'react';
import Tooltip from 'app/components/Tooltip';

import getBadge from './';

type Props = {
  badge: {
    id: string,
    name: string,
  },
  size: number,
};

export default ({ badge, size }: Props) =>
  <Tooltip title={badge.name}>
    {/* Margin Bottom to compensate for the tooltip */}
    <img
      style={{ marginBottom: -7 }}
      width={size}
      src={getBadge(badge.id)}
      alt={badge.name}
    />
  </Tooltip>;
