import styled, { css } from 'styled-components';

export const Container = styled.div`
  ${({ theme }) => css`
    display: grid;
    grid-template-rows: min-content auto;
    width: 100%;
    height: 100vh;
    color: ${theme.white};
  `}
`;

export const Header = styled.header`
  margin: auto;
  width: 1280px;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-self: start;
  justify-self: center;
  min-width: 320px;
  margin-top: 8rem;
`;

export const Title = styled.h1`
  display: flex;
  justify-content: center;
`;

export const Subtitle = styled.h2`
  display: flex;
  justify-content: center;
`;

export const Actions = styled.section`
  display: flex;
  justify-content: center;
  padding: 0 1rem;

  > a {
    display: inline-flex;
    align-items: center;

    &:not(:first-child) {
      margin-left: 1rem;
    }
  }
`;

export const ButtonIcon = styled.span`
  display: inline-flex;
  align-items: center;
  padding-right: 0.5rem;
  font-size: 16px;
`;
