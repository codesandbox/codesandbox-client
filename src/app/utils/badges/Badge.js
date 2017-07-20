import React from 'react';
import styled from 'styled-components';
import Tooltip from 'app/components/Tooltip';

import getBadge from './';

const Image = styled.img`margin-bottom: -0.2em;`;

type Props = {
  badge: {
    id: string,
    name: string,
  },
  size: number,
};

export default ({ badge, size, ...props }: Props) =>
  <Tooltip title={badge.name}>
    {/* Margin Bottom to compensate for the tooltip */}
    <Image {...props} width={size} src={getBadge(badge.id)} alt={badge.name} />
  </Tooltip>;
