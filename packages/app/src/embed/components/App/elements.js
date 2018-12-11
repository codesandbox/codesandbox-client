// @flow
import styled from 'styled-components';
import { SIDEBAR_SHOW_SCREEN_SIZE } from '../../util/constants';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100vw;
  color: white;
`;

export const Fullscreen = styled.div`
  width: 100vw;
  height: 100vh;
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
  box-shadow: -3px 3px 3px rgba(0, 0, 0, 0.5);

  @media (min-width: ${SIDEBAR_SHOW_SCREEN_SIZE}px) {
    left: 250px;
    transform: inherit;
    box-shadow: none;
    border-left: 1px solid ${props => props.theme.background4};
  }
`;
