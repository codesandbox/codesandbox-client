import styled from 'styled-components';
import Dashboard from '-!svg-react-loader!common/icons/dashboard.svg';

export const Container = styled.div`
  display: ${props => (props.zenMode ? 'none' : 'flex')};
  position: relative;
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
`;

export const Left = styled.div`
  display: flex;
  height: 100%;
`;

export const Centered = styled.div`
  position: absolute;
  right: 0;
  left: 0;
  display: flex;
  justify-content: center;
  pointer-events: none;
`;

export const DashboardIcon = styled(Dashboard)`
  transition: 0.3s ease color;
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

  color: ${props => props.theme.gray};
  font-size: 27px;

  &:hover {
    color: white;
  }
`;
