import styled from 'styled-components';

export const Header = styled.div`
  height: 48px;
  min-height: 48px;

  width: 100%;
  background-color: ${props => props.theme.background};
`;

export const NavigationBar = styled.div`
  height: 40px;
  min-height: 40px;
  width: 100%;
  background-color: #eee;
`;

export const StatusBar = styled.div`
  height: 33px;
  min-height: 33px;
  width: 100%;
  background-color: ${props => props.theme.background4};
`;
