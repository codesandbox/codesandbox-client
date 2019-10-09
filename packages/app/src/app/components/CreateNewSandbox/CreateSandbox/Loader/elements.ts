import styled, { css } from 'styled-components';

export const fadeStyles = css`
  content: '';
  height: 92px;
  position: absolute;
  left: 0;
  width: calc(100% - 12px);
  background: linear-gradient(180deg, rgba(21, 21, 21, 0) 0%, #151515 100%);
  z-index: 99;
`;

export const LoadingWrapper = styled.div`
  overflow: hidden;
  height: calc(100% - 110px);

  &:after {
    ${fadeStyles}
    bottom: 0;
  }
`;

export const Individual = styled.div`
  margin: 1.5rem;
  margin-bottom: 0;
`;
