import styled from 'styled-components';
import css from '@styled-system/css';
import { isIOS } from '@codesandbox/common/lib/utils/platform';

export const Container = styled.div(
  css({
    flex: 250,
    width: 250,

    color: 'sideBar.foreground',
    zIndex: 10,
    backgroundColor: 'sideBar.background',
    overflow: 'auto',
    fontFamily: 'Inter, sans-serif',

    /* There is a bug with ios that causes the sidebar to be longer than the preview, when you then
     * scroll the preview it scrolls the editor down (page is longer). If I set this to 100% scrolling
     * is broken in Chrome though. That's why we have this check */
    height: isIOS ? '100%' : '100vh',
  })
);

export const Button = styled.a(
  css({
    transition: '0.3s ease background-color',
    backgroundColor: theme => (theme.light ? 'grays.200' : 'grays.500'),
    padding: 2,
    display: 'block',
    color: theme => (theme.light ? 'grays.800' : 'white'),
    border: 'none',
    outline: 'none',
    borderRadius: 2,
    width: '100%',
    fontSize: 3,
    boxSizing: 'border-box',
    cursor: 'pointer',
    textDecoration: 'none',
    textAlign: 'center',
    ':hover': {
      backgroundColor: theme => (theme.light ? 'grays.300' : 'grays.600'),
    },
  })
);
