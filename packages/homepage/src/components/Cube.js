import React from 'react';
import styled, { css, keyframes } from 'styled-components';

const Cube = styled.div`
  width: ${props => props.size + 1}px;
  height: ${props => props.size + 1}px;

  * {
    position: absolute;
    width: ${props => props.size + 1}px;
    height: ${props => props.size + 1}px;
  }
`;

const getAnimation = (offset: number = 0) => {
  return keyframes`
  0% {
    transform: rotateY(${45 + offset}deg) rotateX(${-37.5 + offset}deg);
  }
  100% {
    transform: rotateY(${45 + offset + 360}deg) rotateX(${-37.5 +
    offset +
    360}deg);
  }
`;
};

const Sides = styled.div`
  ${({ noAnimation, offset, speed }) =>
    !noAnimation &&
    css`
      animation: ${getAnimation(offset)} ${speed}s linear infinite;
    `};
  transform-style: preserve-3d;
  will-change: transform;

  * {
    box-sizing: border-box;
    background-color: ${({ color }) => color.clearer(0.2)};
    border: ${({ size }) => size / 70}px solid rgba(255, 255, 255, 0.4);
  }
`.withComponent(({ noAnimation, color, ...rest }) => <div {...rest} />);

const Side = styled.div`
  transform-origin: 50% 50%;
  will-change: transform;
  transform: ${({ rotate }) => rotate} translateZ(${({ size }) => size / 2}px);
`;

type Props = {
  size: number,
  className: string,
  noAnimation: ?boolean,
  speed: number,
  color: string,
  offset: number,
};

const isSafari =
  typeof navigator !== 'undefined' &&
  /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
const SHADOW_SIZE = isSafari ? 100 : 150;

export default class GlowCube extends React.PureComponent<Props> {
  render() {
    const {
      size = 150,
      color = 'rgba(242,119,119,0.5)',
      speed = 1,
      offset = 0,
      noAnimation,
      className,
      ref,
      id,
    } = this.props;
    return (
      <Cube id={id} ref={ref} className={className} size={size}>
        <Sides
          color={color}
          offset={offset}
          speed={speed}
          noAnimation={noAnimation}
          size={size}
        >
          <Side
            style={{ boxShadow: `0px 0px ${SHADOW_SIZE}px ${color()}` }}
            rotate="rotateX(90deg)"
            size={size}
          />
          <Side
            style={{ boxShadow: `0px 0px ${SHADOW_SIZE}px ${color()}` }}
            rotate="rotateX(-90deg)"
            size={size}
          />
          <Side
            style={{ boxShadow: `0px 0px ${SHADOW_SIZE}px ${color()}` }}
            rotate="rotateY(0deg)"
            size={size}
          />
          <Side
            style={{ boxShadow: `0px 0px ${SHADOW_SIZE}px ${color()}` }}
            rotate="rotateY(-180deg)"
            size={size}
          />
          <Side
            style={{ boxShadow: `0px 0px ${SHADOW_SIZE}px ${color()}` }}
            rotate="rotateY(-90deg)"
            size={size}
          />
          <Side
            style={{ boxShadow: `0px 0px ${SHADOW_SIZE}px ${color()}` }}
            rotate="rotateY(90deg)"
            size={size}
          />
        </Sides>
      </Cube>
    );
  }
}
