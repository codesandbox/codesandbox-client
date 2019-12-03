import styled, { css } from 'styled-components';

export const Container = styled.footer`
  padding-bottom: 1rem;
  margin-top: 6rem;
  margin-bottom: 3rem;
`;

export const Nav = styled.nav`
  ${({ theme }) => css`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    grid-gap: 3rem;
    width: 1200px;
    max-width: 80%;
    padding-top: 2.5rem;
    margin: auto;
    margin-bottom: 4.5rem;
    border-top: 1px solid ${theme.homepage.grey};

    a {
      color: inherit;
      text-decoration: none;

      &:hover {
        color: ${theme.homepage.white};
      }
    }

    ul {
      padding: 0;
      margin: 0;
      list-style: none;

      li:first-child {
        margin-bottom: 1rem;
      }
    }
  `}
`;

export const Social = styled.ul`
  ${({ theme }) => css`
    display: grid;
    grid-template-columns: repeat(3, 1rem);
    grid-gap: 1rem;
    justify-content: center;
    padding: 0;
    margin: 0;
    list-style: none;

    svg {
      path {
        transition: all 200ms ease;
      }

      &:hover path {
        fill: ${theme.homepage.white};
      }
    }
  `}
`;
