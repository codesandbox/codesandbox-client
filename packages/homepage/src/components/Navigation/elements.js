import styled from 'styled-components';
import { Link } from '@reach/router';

export const Header = styled.header`
  box-shadow: 0px 1px 0px ${props => props.theme.homepage.grey};
  height: 48px;
  width: 100%;
`;

export const SubNav = styled.div`
  width: 100%;
  font-weight: 500;
  font-size: 1rem;
  line-height: 24px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);

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
  width: 100%;

  li {
    margin: 0;
  }

  a,
  button {
    background: transparent;
    border: none;
    cursor: pointer;
    text-decoration: none;
    color: ${props => props.theme.homepage.muted};
    transition: all 200ms ease;
    outline: none;

    &:hover {
      color: ${props => props.theme.homepage.white};
    }
  }
`;

export const LogIn = styled.li`
  display: flex;
  align-items: center;
`;
