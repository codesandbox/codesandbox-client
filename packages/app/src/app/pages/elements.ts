import styled, { css } from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  margin: 0;
`;

export const Content = styled.div`
  ${({ theme }) => css`
    display: flex;
    flex: auto;
    background-color: ${theme.background2};
  `}
`;
