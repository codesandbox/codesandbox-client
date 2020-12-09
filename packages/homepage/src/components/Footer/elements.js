import styled from 'styled-components';

export const FooterWrapper = styled.footer`
  padding-bottom: 1rem;
  margin-top: 6rem;
  margin-bottom: 3rem;
`;

export const Nav = styled.section`
  padding-top: 2.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  grid-gap: 3rem;
  max-width: 80%;
  width: 1200px;
  margin: auto;
  margin-bottom: 4.5rem;

  a {
    color: inherit;
    text-decoration: none;

    &:hover {
      color: ${props => props.theme.homepage.white};
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
`;

export const Social = styled.ul`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  margin: 0;
  list-style: none;

  svg {
    path {
      transition: all 200ms ease;
    }

    &:hover path {
      fill: ${props => props.theme.homepage.white};
    }
  }
`;
