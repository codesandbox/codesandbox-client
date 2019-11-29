import styled from 'styled-components';
import { Link } from '@reach/router';

export const Header = styled.header`
  box-shadow: 0px 1px 0px ${props => props.theme.homepage.grey};
  height: 48px;
  width: 100%;
  background: #040404;
`;

export const SubNav = styled.div`
  width: 100%;
  font-weight: 500;
  font-size: 1rem;
  line-height: 24px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999;

  color: ${props => props.theme.homepage.white};

  > nav {
    width: 866px;
    margin: auto;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  a {
    text-decoration: none;
    color: ${props => props.theme.homepage.white};
  }

  ul {
    display: flex;
    align-items: flex-end;
    margin: 0;
  }

  li {
    padding: 1rem 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 0;

    > div {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    &:not(:last-child) {
      margin-right: 5rem;
    }

    a {
      margin-top: 0.5rem;
    }
  }
`;

export const Nav = styled.nav`
  width: 866px;
  margin: auto;
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: space-between;
  font-size: 0.8125rem;

  ${props => props.theme.breakpoints.md} {
    display: none;
  }

  ${props => props.theme.breakpoints.lg} {
    .tablet-remove {
      display: none;
    }
  }
`;

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
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
  font-size: 0.8125rem;
  margin-right: 4rem;
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
  justify-content: space-around;
  align-items: center;
  width: 100%;

  li {
    margin: 0;
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
`;

export const LogIn = styled.li`
  display: flex;
  align-items: center;
`;

export const MobileNav = styled.nav`
  display: none;
  padding-left: 1rem;
  padding-right: 1rem;
  margin: auto;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  position: relative;
  z-index: 3;
  background: #040404;

  ${props => props.theme.breakpoints.md} {
    display: flex;
  }

  > div {
    display: flex;
    align-items: center;
  }

  > div > svg {
    cursor: pointer;
  }

  > div > a {
    font-style: normal;
    font-weight: 500;
    font-size: 1rem;
    text-decoration: none;
    margin-right: 1rem;
    color: ${props => props.theme.homepage.white};
  }
`;

export const PopUpNav = styled.nav`
  top: 48px;
  background: #151515;
  padding-top: 1.5rem;
  padding-bottom: 4rem;
  padding-right: 1rem;
  width: 100%;
  z-index: 3;
`;

export const Headers = styled.h3`
  font-style: normal;
  font-weight: 500;
  font-size: 0.8125rem;
  line-height: 16px;
  margin-bottom: 0.5rem;
  margin-top: 2rem;
  padding-left: 1rem;

  color: #757575;
`;

export const Items = styled.ul`
  padding: 0;
  list-style: none;
  margin: 0;

  li {
    padding: 0.5rem 0;
    padding-left: 1rem;

    &:hover {
      background: #242424;
    }
  }

  li a {
    display: flex;
    text-decoration: none;
  }

  section {
    width: 43px;
  }

  span {
    font-style: normal;
    font-weight: 500;
    font-size: 1rem;

    margin-left: 1rem;

    color: ${props => props.theme.homepage.white};
  }
`;

export const Pricing = styled.li`
  font-style: normal;
  font-weight: 500;
  font-size: 1rem;

  a {
    display: flex;
    align-items: center;
    color: ${props => props.theme.homepage.white};
    text-decoration: none;
    text-decoration: none;
  }

  section {
    width: 43px;
  }
`;
