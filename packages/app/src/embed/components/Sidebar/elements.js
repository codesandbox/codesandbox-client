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
