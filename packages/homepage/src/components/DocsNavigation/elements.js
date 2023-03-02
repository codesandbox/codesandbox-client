import styled, { css } from 'styled-components';
import { Link } from '@reach/router';

export const Header = styled.header`
  box-shadow: 0px 1px 0px ${props => props.theme.homepage.grey};
  height: 48px;
  width: 100%;
  background: ${props => props.theme.homepage.greyDark};
`;

export const Nav = styled.nav`
  padding: 0 16px;
  margin: auto;
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: space-between;
  font-size: 0.8125rem;
  .hide-m {
    ${props => props.theme.breakpoints.md} {
      display: none;
    }
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
  border-radius: 99999px;
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
  margin-right: 0.25rem;
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
      margin-right: 1rem;
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

export const SearchWrapper = styled.div`
  > div {
    position: relative;

    &:before {
      z-index: 9;
      left: 4px;
      top: 6px;
      position: absolute;
      width: 12px;
      height: 12px;
      content: '';
      background-image: url('data:image/svg+xml,%3Csvg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath fill-rule="evenodd" clip-rule="evenodd" d="M6.96631 7.93238C6.2316 8.5533 5.29574 8.92526 4.27663 8.92526C1.91471 8.92526 0 6.9273 0 4.46269C0 1.99808 1.91471 0.00012207 4.27663 0.00012207C6.63855 0.00012207 8.55326 1.99808 8.55326 4.46269C8.55326 5.52611 8.19679 6.50266 7.60174 7.26932L12 11.8588L11.3646 12.5219L6.96631 7.93238ZM7.65462 4.46269C7.65462 6.40942 6.14224 7.98755 4.27663 7.98755C2.41102 7.98755 0.898637 6.40942 0.898637 4.46269C0.898637 2.51596 2.41102 0.93783 4.27663 0.93783C6.14224 0.93783 7.65462 2.51596 7.65462 4.46269Z" fill="%23757575"/%3E%3C/svg%3E%0A');
    }
  }
  ${props => props.theme.breakpoints.md} {
    display: none;

    > div {
      margin-left: 16px;
    }
    ${props =>
      props.open &&
      css`
        display: block;
        height: 52px;
        background: #151515;
        box-shadow: 0px 1px 0px #242424;
        left: 0;
        position: absolute;
        width: 100%;
        top: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
      `}
  }
`;

export const Search = styled.input`
  background: #242424;
  height: 24px;
  font-size: 13px;
  line-height: 24px;
  margin-right: 24px;
  padding: 8px;
  padding-left: 24px;
  width: 320px;

  display: flex;
  align-items: center;

  color: #fff;
  border: 1px solid #343434;
  border-radius: 2px;

  ${props => props.theme.breakpoints.md} {
    width: calc(100vw - 32px);
  }
`;

export const OpenSearch = styled.button`
  display: none;
  margin-right: 8px;
  cursor: pointer;

  ${props => props.theme.breakpoints.md} {
    display: flex;
  }
`;
