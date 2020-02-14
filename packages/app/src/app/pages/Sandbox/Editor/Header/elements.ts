import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';

import { SignInButton as SignInButtonBase } from 'app/pages/common/SignInButton';

import Dashboard from '-!svg-react-loader!@codesandbox/common/lib/icons/dashboard.svg';

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
