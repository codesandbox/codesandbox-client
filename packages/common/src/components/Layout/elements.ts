import styled, { css } from 'styled-components';

export const Main = styled.main`
  ${({ theme }) => css`
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 100vh;
    height: 100%;
    background-color: #040404;
    color: ${theme.white};
    ${theme.fonts.primary.normal};
  `}
`;

export const PageContent = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 1rem;
`;
