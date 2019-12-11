import styled from 'styled-components';

export const AnimationContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
`;

export const FallbackImageBackground = styled.div`
  background-image: url(${props => props.fallback});
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: 50% 50%;
`;
