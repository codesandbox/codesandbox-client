// @flow
import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100vw;
  color: white;
`;

export const Fullscreen = styled.div`
  width: 100vw;
  height: 100%;
  overflow: hidden;
`;

export const Moving = styled.div`
  transition: 0.3s ease all;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  transform: translateX(${props => (props.sidebarOpen ? 250 : 0)}px);
  border: 1px solid;
  /* 8 digit hex code with last 2 for opacity */
  border-color: ${props => props.theme.colors.sideBar.border};
`;
