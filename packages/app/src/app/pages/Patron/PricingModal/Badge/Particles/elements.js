import styled, { css, keyframes } from 'styled-components';
import badges from 'common/lib/utils/badges/patron-info';

const particleAnimation = (deg: number) => keyframes`
  0% {
    transform: rotate(${deg}deg) translateY(50px) scale3d(1, 1, 1);
  }

  100% {
    transform: rotate(${deg}deg) translateY(${200 +
  Math.random() * 100}px) scale3d(0, 0, 0);
  }
`;

export const Particle = styled.div`
  animation: ${props => particleAnimation(props.deg, props.i)} 700ms ease;
  position: absolute;
  top: 0;
  bottom: 20px;
  left: 0;
  right: 0;
  margin: auto;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  ${props => {
    const color =
      badges[props.badge].colors[props.i % badges[props.badge].colors.length];

    return css`
      background-color: ${color};
      box-shadow: 0 0 5px ${color};
    `;
  }};
`;
