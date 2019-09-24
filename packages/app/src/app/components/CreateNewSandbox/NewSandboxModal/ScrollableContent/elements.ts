import styled, { css, createGlobalStyle, keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
      opacity: 0;
  }

  to {
      opacity: 1;
  }
`;

export const ScrollContent = styled.div`
  height: 100%;
  overflow: auto;
  opacity: 0;
  animation: ${fadeIn} 300ms ease forwards;
`;

export const fadeStyles = css`
  content: '';
  height: 92px;
  position: absolute;
  left: 0;
  width: calc(100% - 11px);
  background: linear-gradient(180deg, rgba(21, 21, 21, 0) 0%, #151515 100%);
  z-index: 99;
`;

export const ScrollWrapper = styled.div<{ scrolled: boolean }>`
  height: calc(100% - 71px);
  position: relative;
  &:after {
    ${fadeStyles}
    bottom: 0;
  }
  ${props =>
    props.scrolled &&
    css`
      &:before {
        ${fadeStyles}
        top: 0;
        transform: rotate(180deg);
      }
    `};
`;

export const ScrollBarCSS = createGlobalStyle`
body {
  .scrollbar-track-y {
    background: transparent;
    right: 0.25rem;
    z-index: 999;
  }

  .scrollbar-thumb {
    background: rgba(36, 36, 36, 0.4);
    border: 0.5px solid rgba(255, 255, 255, 0.8);
    box-sizing: border-box;
    border-radius: 50px;
    width: 4px;
  }

  .scroll-content {
    padding-bottom: 50px;
  }
}
`;
