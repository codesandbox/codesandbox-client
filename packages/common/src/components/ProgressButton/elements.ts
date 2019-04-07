import styled, { css, keyframes } from 'styled-components';
import theme from '../../theme';

const loaderAnimation = keyframes`
  0%   { background-color:  ${theme.secondary()}; }
  50%, 100% { background-color: ${theme.secondary.lighten(0.5)()}; }
`;

export const Wrapper = styled.div`
  position: relative;
`;

const circle = css`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${theme.secondary()};
  opacity: 0.5;
  animation: ${loaderAnimation} 1s infinite linear alternate;
`;

export const Loader = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  ${circle} animation-delay: 0.5s;

  &:before {
    content: ' ';
    position: absolute;
    left: -15px;
    ${circle};
    animation-delay: 0s;
  }

  &:after {
    content: ' ';
    position: absolute;
    left: 15px;
    ${circle};
    animation-delay: 1s;
  }
`;
