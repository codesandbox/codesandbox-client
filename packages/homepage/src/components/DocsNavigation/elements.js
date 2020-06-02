import styled from 'styled-components';
import { Link } from '@reach/router';

export const Header = styled.header`
  box-shadow: 0px 1px 0px ${props => props.theme.homepage.grey};
  height: 48px;
  width: 100%;
  background: ${props => props.theme.homepage.greyDark};
`;

export const Nav = styled.nav`
  width: 1081px;
  padding: 0 16px;
  margin: auto;
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: space-between;
  font-size: 0.8125rem;

  ${props => props.theme.breakpoints.md} {
    display: none;
  }
`;

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  width: calc(100vw - 32px);
  justify-content: space-between;
`;

export const UserAvatar = styled.img`
  border: 1px solid ${props => props.theme.homepage.grey};
  border-radius: 2px;
  width: 24px;
  height: 24px;
  margin-left: 0.5rem;
`;

export const LogoWrapper = styled(Link)`
  font-family: ${props => props.theme.homepage.appleFont};
  display: flex;
  align-items: center;
  margin-right: 1rem;
  color: white;
  text-decoration: none;
`;

export const LogoImage = styled.img`
  margin-right: 1rem;
`;

export const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;

  li {
    margin: 0;

    &:not(:last-child) {
      margin-right: 1.5rem;
    }
  }

  a:not(.button),
  button {
    background: transparent;
    border: none;
    cursor: pointer;
    text-decoration: none;
    color: ${props => props.theme.homepage.muted};
    transition: all 200ms ease;
    outline: none;
    padding: 0;

    &:hover {
      color: ${props => props.theme.homepage.white};

      svg path {
        fill: ${props => props.theme.homepage.white};
      }
    }
  }

  a:not(.button).active {
    color: white;
  }
`;

export const LogIn = styled.li`
  display: flex;
  align-items: center;

  ${props => props.theme.breakpoints.lg} {
    display: none;
  }
`;
