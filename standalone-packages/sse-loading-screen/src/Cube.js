// Tell Babel to transform JSX into h() calls:
/** @jsx h */
import { h, Component } from 'preact/dist/preact.mjs';
import styled, { keyframes } from 'preact-emotion';

const isSafari =
  typeof navigator !== 'undefined' &&
  /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

const iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);

const SHADOW_SIZE = (() => {
  if (iOS) {
    return 0;
  }

  if (isSafari) {
    return 20;
  }

  return 20;
})();

const getContainerAnimation = () => keyframes`
  0% {
    transform: translateY(-5px);
  }
  50% {
    transform: translateY(5px);
  }
  100% {
    transform: translateY(-5px);
  }
`;

const Container = styled.div`
  animation: ${() => getContainerAnimation(0)} 8 s ease infinite;
  transform-style: preserve-3d;
  will-change: transform;
  transform-origin: 50% 50%;
  width: ${props => props.size + 1}px;
  height: ${props => props.size + 1}px;
  position: absolute;
  top: 50px;

  * {
    position: absolute;
    width: ${props => props.size + 1}px;
    height: ${props => props.size + 1}px;
  }
`;

const getAnimation = (offset: number) => keyframes`
  0% {
    transform: rotateY(${45 + offset}deg) rotateX(${50 + offset}deg);
  }
  100% {
    transform: rotateY(${45 + offset + 360}deg) rotateX(${50 + offset}deg);
  }
`;

const Sides = styled.div`
  ${({ noAnimation, offset, speed }) =>
    noAnimation
      ? `transform: rotateY(48deg) rotateX(-20deg) rotateZ(-20deg);`
      : `animation: ${getAnimation(offset)} ${speed}s linear infinite;`};
  transform-style: preserve-3d;
  will-change: transform;
  transform-origin: 50% 50%;

  transform: rotateY(48deg) rotateX(-20deg) rotateZ(-20deg);
  * {
    box-sizing: border-box;
    background-color: ${({ color }) => color};
    border: ${({ size }) => size / 70}px solid rgba(255, 255, 255, 0.4);
  }
`.withComponent(({ noAnimation, color, ...rest }) => <div {...rest} />);

const Side = styled.div`
  transform-origin: 50% 50%;
  will-change: transform;
  transform: ${({ rotate }) => rotate} translateZ(${({ size }) => size / 2}px);
  box-shadow: 0px 0px ${SHADOW_SIZE}px ${props => props.color};
`;

interface Props {
  size: number;
  className: string;
  noAnimation: boolean;
  speed: number;
  color: string;
  offset: number;
  id: string;
}

// eslint-disable-next-line
export default class Cube extends Component<Props> {
  // Set default properties
  static defaultProps = {
    color: 'rgba(63, 168, 243, 0.6)',
    speed: 25,
    noAnimation: false,
    offset: 0,
    width: 75,
  };

  render() {
    const {
      color,
      speed,
      offset,
      noAnimation,
      className,
      id,
      width,
      style,
    } = this.props;

    return (
      <Container style={style} id={id} className={className} size={width}>
        <Sides
          color={color}
          offset={offset}
          speed={speed}
          noAnimation={noAnimation}
          size={width}
        >
          <Side
            className="side"
            color={color}
            rotate="rotateX(90deg)"
            size={width}
          />
          <Side
            className="side"
            color={color}
            rotate="rotateX(-90deg)"
            size={width}
          />
          <Side
            className="side"
            color={color}
            rotate="rotateY(0deg)"
            size={width}
          />
          <Side
            className="side"
            color={color}
            rotate="rotateY(-180deg)"
            size={width}
          />
          <Side
            className="side"
            color={color}
            rotate="rotateY(-90deg)"
            size={width}
          />
          <Side
            className="side"
            color={color}
            rotate="rotateY(90deg)"
            size={width}
          />
        </Sides>
      </Container>
    );
  }
}
