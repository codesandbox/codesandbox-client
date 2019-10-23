import styled from 'styled-components';

export const Header = styled.header`
  background: #040404;
  box-shadow: 0px 1px 0px #242424;
  height: 48px;
  width: 100%;
`;

export const Nav = styled.nav`
  width: 866px;
  margin: auto;
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
`;

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

export const UserAvatar = styled.img`
  border: 1px solid #242424;
  border-radius: 2px;
  width: 24px;
  height: 24px;
  margin-left: 0.5rem;
`;

export const LogoWrapper = styled.section`
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue';
  display: flex;
  align-items: center;
  font-size: 13px;
  margin-right: 4rem;
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

  a {
    text-decoration: none;
    color: #757575;
    transition: all 200ms ease;

    &:hover {
      color: white;
    }
  }
`;

export const LogIn = styled.li`
  display: flex;
  align-items: center;
`;
