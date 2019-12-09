// @ts-ignore
import { SignInButton as BaseSignInButton } from 'app/pages/common/SignInButton';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import Dashboard from '-!svg-react-loader!@codesandbox/common/lib/icons/dashboard.svg';

export const Container = styled.div<{ zenMode: boolean }>`
  ${({ theme, zenMode }) => css`
    display: ${zenMode ? 'none' : 'flex'};
    justify-content: space-between;
    align-items: center;
    background-color: ${theme['titleBar.activeBackground'] ||
      theme.background2};
    font-size: 1.2rem;
    color: ${theme['titleBar.activeForeground'] ||
      css`rgba(255, 255, 255, 0.7)`};
    margin: 0;
    height: 3rem;
    font-weight: 400;
    flex: 0 0 3rem;
    width: 100%;
    box-sizing: border-box;
    border-bottom: 1px solid
      ${theme['titleBar.activeForeground']
        ? theme['titleBar.border'] || 'transparent'
        : theme.background2.darken(0.3)};
  `}
`;

export const Left = styled.div`
  display: flex;
  height: 100%;
  z-index: 999999999999;
`;

export const Right = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  z-index: 99999999999999;
`;

export const Centered = styled.div`
  position: absolute;
  right: 0;
  left: 0;
  display: flex;
  justify-content: center;
  z-index: 0; /* So pointer events on left and right continue */
  margin: 0 3rem;
`;

export const DashboardLink = styled(Link)`
  ${({ theme }) => css`
    transition: 0.3s ease color;
    cursor: pointer;
    color: ${theme.light ? css`rgba(0, 0, 0, 0.8)` : theme.gray};

    &:hover {
      color: white;
    }
  `}
`;

export const DashboardIcon = styled(Dashboard)`
  display: flex;
  position: relative;
  align-items: center;
  vertical-align: middle;
  height: 3rem;
  margin-right: 1rem;
  margin: 0 calc(0.8rem + 2px);
  box-sizing: border-box;
  overflow: hidden;
  text-decoration: none;
  font-size: 27px;
`;

export const AccountContainer = styled.div`
  z-index: 20;
  display: flex;
  align-items: center;
  height: 100%;
  margin-left: 1rem;
  margin-right: 1rem;
  box-sizing: border-box;
`;

export const UserMenuContainer = styled.div`
  display: absolute;
  z-index: 999999999999;
  margin: 5px 0;
  margin-right: 0;
  font-size: 0.8rem;
`;

export const SignInButton = styled(BaseSignInButton)`
  font-size: 0.75rem;
`;
