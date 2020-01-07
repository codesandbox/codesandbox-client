// @flow
import styled from 'styled-components';
import css from '@styled-system/css';

export const Container = styled.div(
  css({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100vw',
  })
);

export const Fullscreen = styled.div(
  css({
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    backgroundColor: 'editor.background',
    color: 'editor.foreground',
    h1: {
      // override common element which has hard coded color
      color: 'editor.foreground',
    },
  })
);

export const Moving = styled.div`
  transition: 0.3s ease all;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  bottom: 0;
  left: ${props => (props.sidebarOpen ? 250 : 0)}px;
  right: 0;
  width: ${props => (props.sidebarOpen ? 'calc(100% - 250px)' : '100%')};
  border: 1px solid;
  /* 8 digit hex code with last 2 for opacity */
  border-color: ${props => props.theme.colors.sideBar.border + '33'};
`;
