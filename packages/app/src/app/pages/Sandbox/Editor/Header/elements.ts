import styled from 'styled-components';
// @ts-ignore
import Dashboard from '-!svg-react-loader!common/lib/icons/dashboard.svg';
import { Link } from 'react-router-dom';

export const Container = styled.div<{ zenMode: boolean }>`
  display: ${props => (props.zenMode ? 'none' : 'flex')};
  position: fixed;
  z-index: 5;
  justify-content: space-between;
  align-items: center;
  background-color: ${props =>
    props.theme['titleBar.activeBackground'] || props.theme.background2};
  font-size: 1.2rem;
  color: ${props =>
    props.theme['titleBar.activeForeground'] || 'rgba(255, 255, 255, 0.7)'};
  margin: 0;
  height: 3rem;
  font-weight: 400;
  flex: 0 0 3rem;
  width: 100%;
  box-sizing: border-box;
  border-bottom: 1px solid
    ${props =>
      props.theme['titleBar.activeForeground']
        ? props.theme['titleBar.border'] || 'transparent'
        : props.theme.background2.darken(0.3)};
`;

export const Right = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  z-index: 1;
`;

export const Left = styled.div`
  display: flex;
  height: 100%;
  z-index: 1;
`;

export const Centered = styled.div`
  position: absolute;
  right: 0;
  left: 0;
  display: flex;
  justify-content: center;
  z-index: 0; /* So pointer events on left and right continue */
`;

export const DashboardLink = styled(Link)`
  transition: 0.3s ease color;
  cursor: pointer;

  color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.8)' : props.theme.gray};

  &:hover {
    color: white;
  }
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
