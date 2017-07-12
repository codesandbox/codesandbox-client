import React from 'react';
import styled from 'styled-components';

import Relative from 'app/components/Relative';

import './animations.css';
import badges from './badge-info';
import Particles from './Particles';

const BadgeContainer = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 162px;
  height: 178px;
  top: -90px;
`;

type Props = {
  badge: 'ruby' | 'sapphire' | 'rupee' | 'diamond',
};

const Badge = ({ badge }: Props) => {
  const BadgeComponent = badges[badge].Badge;
  return (
  <BadgeContainer>
    <BadgeComponent style={{zIndex: 20}} className={`badge ${badge}`} />

  </BadgeContainer>
  )
}

export default ({ badge }: Props) => (
  <Relative>
    {/* We prerender all particles, performance reasons */}
    <Particles badge={badge} />
    <Badge key={badge} id="badge" badge={badge} />
  </Relative>
)
