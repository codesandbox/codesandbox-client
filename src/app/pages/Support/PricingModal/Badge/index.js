import React from 'react';
import styled, {keyframes} from 'styled-components';

import Relative from 'app/components/Relative';

import badges from './badge-info';

const pop = keyframes`
  0% { transform: matrix3d(0.4, 0, 0, 0, 0, 0.4, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  3.4% { transform: matrix3d(0.589, 0, 0, 0, 0, 0.644, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  4.7% { transform: matrix3d(0.67, 0, 0, 0, 0, 0.76, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  6.81% { transform: matrix3d(0.796, 0, 0, 0, 0, 0.936, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  9.41% { transform: matrix3d(0.93, 0, 0, 0, 0, 1.101, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  10.21% { transform: matrix3d(0.965, 0, 0, 0, 0, 1.136, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  13.61% { transform: matrix3d(1.074, 0, 0, 0, 0, 1.199, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  14.11% { transform: matrix3d(1.085, 0, 0, 0, 0, 1.198, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  17.52% { transform: matrix3d(1.125, 0, 0, 0, 0, 1.144, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  18.72% { transform: matrix3d(1.127, 0, 0, 0, 0, 1.112, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  21.32% { transform: matrix3d(1.118, 0, 0, 0, 0, 1.042, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  24.32% { transform: matrix3d(1.09, 0, 0, 0, 0, 0.976, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  25.23% { transform: matrix3d(1.08, 0, 0, 0, 0, 0.963, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  29.03% { transform: matrix3d(1.038, 0, 0, 0, 0, 0.938, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  29.93% { transform: matrix3d(1.029, 0, 0, 0, 0, 0.939, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  35.54% { transform: matrix3d(0.988, 0, 0, 0, 0, 0.977, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  36.74% { transform: matrix3d(0.983, 0, 0, 0, 0, 0.987, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  41.04% { transform: matrix3d(0.976, 0, 0, 0, 0, 1.013, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  44.44% { transform: matrix3d(0.98, 0, 0, 0, 0, 1.019, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  52.15% { transform: matrix3d(0.995, 0, 0, 0, 0, 1.004, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  59.86% { transform: matrix3d(1.004, 0, 0, 0, 0, 0.994, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  63.26% { transform: matrix3d(1.004, 0, 0, 0, 0, 0.995, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  75.28% { transform: matrix3d(1.001, 0, 0, 0, 0, 1.002, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  85.49% { transform: matrix3d(0.999, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  90.69% { transform: matrix3d(0.999, 0, 0, 0, 0, 0.999, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  100% { transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
`;

const BadgeContainer = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  left: 0;
  right: 0;
  margin: 0 auto;
  top: -90px;
`;

const particleAnimation = (deg: number, i: number) => keyframes`
  0% {
    transform: rotate(${deg}deg) translateY(50px) scale(1, 1);
  }

  100% {
    transform: rotate(${deg}deg) translateY(${200 + (i % 2) * 50}px) scale(0, 0);
  }
`

const Particle = styled.div`
  animation: ${props => particleAnimation(props.deg, props.i)} 700ms ease;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => badges[props.badge].color};
  box-shadow: 0 0 5px ${props => badges[props.badge].color};
`;

const BadgeImage = styled.img`
  animation: ${pop} 1000ms linear both;
`

type Props = {
  badge: 'ruby' | 'sapphire' | 'rupee' | 'diamond',
};

const createParticles = (amount: number, badge) => (
  Array(amount).fill(0).map((_, i) =>
    <Particle i={i} deg={180 + (Math.floor(amount / 2) + i) * (360 / amount)} badge={badge} />
  )
)

const Badge = ({ badge }: Props) => (
  <BadgeContainer>
    {createParticles(badges[badge].particleCount, badge)}
    <BadgeImage alt={badge} src={badges[badge].svg} />
  </BadgeContainer>
)


export default class Badges extends React.PureComponent {
  props: Props;

  shouldComponentUpdate(nextProps) {
    return nextProps.badge !== this.props.badge
  }

  render() {
    const { badge } = this.props;
    return  (<Relative>
    {(badge === 'ruby') && <Badge badge="ruby" />}
    {(badge === 'sapphire') && <Badge badge="sapphire" />}
    {(badge === 'rupee') && <Badge badge="rupee" />}
    {badge === 'diamond' && <Badge badge="diamond" />}
    </Relative>);
  }
}


// {(badge === 'ruby' || badge === 'sapphire' || badge === 'rupee' || badge === 'diamond') && <Badge badge="ruby" />}
//     {(badge === 'sapphire' || badge === 'rupee' || badge === 'diamond') && <Badge badge="sapphire" />}
//     {(badge === 'rupee' || badge === 'diamond') && <Badge badge="rupee" />}
//     {badge === 'diamond' && <Badge badge="diamond" />}
